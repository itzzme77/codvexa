# Face Recognition API Server
# This Flask server provides face enrollment and verification endpoints

from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from facenet_pytorch import MTCNN, InceptionResnetV1
from PIL import Image
import io
import base64
import numpy as np
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native

# Initialize face detection and recognition models
print("Loading face recognition models...")
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
mtcnn = MTCNN(image_size=160, margin=0, device=device, keep_all=False)
resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)
print("Models loaded successfully!")

# Directory to store face embeddings
EMBEDDINGS_DIR = 'face_embeddings'
os.makedirs(EMBEDDINGS_DIR, exist_ok=True)

def base64_to_image(base64_string):
    """Convert base64 string to PIL Image"""
    try:
        # Remove data URL prefix if present
        if 'base64,' in base64_string:
            base64_string = base64_string.split('base64,')[1]
        
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        return image
    except Exception as e:
        print(f"Error converting base64 to image: {e}")
        return None

def get_face_embedding(image):
    """Extract face embedding from image"""
    try:
        # Detect face and get cropped image
        img_cropped = mtcnn(image)
        
        if img_cropped is None:
            return None
        
        # Get embedding
        img_cropped = img_cropped.unsqueeze(0).to(device)
        embedding = resnet(img_cropped).detach().cpu().numpy()[0]
        
        return embedding
    except Exception as e:
        print(f"Error getting face embedding: {e}")
        return None

def save_user_embedding(user_id, embedding):
    """Save user face embedding to file"""
    try:
        file_path = os.path.join(EMBEDDINGS_DIR, f'{user_id}.npy')
        np.save(file_path, embedding)
        
        # Also save metadata
        metadata = {
            'user_id': user_id,
            'enrolled_at': datetime.now().isoformat(),
            'embedding_shape': embedding.shape
        }
        metadata_path = os.path.join(EMBEDDINGS_DIR, f'{user_id}_metadata.json')
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f)
        
        return True
    except Exception as e:
        print(f"Error saving embedding: {e}")
        return False

def load_user_embedding(user_id):
    """Load user face embedding from file"""
    try:
        file_path = os.path.join(EMBEDDINGS_DIR, f'{user_id}.npy')
        if not os.path.exists(file_path):
            return None
        embedding = np.load(file_path)
        return embedding
    except Exception as e:
        print(f"Error loading embedding: {e}")
        return None

def compare_embeddings(embedding1, embedding2, threshold=0.6):
    """Compare two face embeddings using cosine distance"""
    try:
        # Calculate cosine distance
        distance = np.linalg.norm(embedding1 - embedding2)
        similarity = 1 - distance
        
        is_match = bool(distance < threshold)  # Convert numpy bool to Python bool
        confidence = float((1 - distance) * 100)  # Convert to percentage
        
        return is_match, confidence, float(distance)
    except Exception as e:
        print(f"Error comparing embeddings: {e}")
        return False, 0.0, 1.0

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'device': str(device),
        'models_loaded': True
    })

@app.route('/enroll', methods=['POST'])
def enroll_face():
    """Enroll a new face for a user"""
    try:
        data = request.json
        user_id = data.get('userId')
        image_base64 = data.get('image')
        
        if not user_id or not image_base64:
            return jsonify({
                'success': False,
                'error': 'Missing userId or image'
            }), 400
        
        # Convert base64 to image
        image = base64_to_image(image_base64)
        if image is None:
            return jsonify({
                'success': False,
                'error': 'Invalid image format'
            }), 400
        
        # Get face embedding
        embedding = get_face_embedding(image)
        if embedding is None:
            return jsonify({
                'success': False,
                'error': 'No face detected in image'
            }), 400
        
        # Save embedding
        if not save_user_embedding(user_id, embedding):
            return jsonify({
                'success': False,
                'error': 'Failed to save face data'
            }), 500
        
        return jsonify({
            'success': True,
            'message': f'Face enrolled successfully for user {user_id}',
            'userId': user_id
        })
    
    except Exception as e:
        print(f"Error in enroll endpoint: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/verify', methods=['POST'])
def verify_face():
    """Verify a face against enrolled user"""
    try:
        data = request.json
        user_id = data.get('userId')
        image_base64 = data.get('image')
        
        if not user_id or not image_base64:
            return jsonify({
                'success': False,
                'error': 'Missing userId or image'
            }), 400
        
        # Load stored embedding
        stored_embedding = load_user_embedding(user_id)
        if stored_embedding is None:
            return jsonify({
                'success': False,
                'error': 'User not enrolled. Please enroll first.',
                'enrolled': False
            }), 404
        
        # Convert base64 to image
        image = base64_to_image(image_base64)
        if image is None:
            return jsonify({
                'success': False,
                'error': 'Invalid image format'
            }), 400
        
        # Get face embedding from new image
        new_embedding = get_face_embedding(image)
        if new_embedding is None:
            return jsonify({
                'success': False,
                'error': 'No face detected in image'
            }), 400
        
        # Compare embeddings
        is_match, confidence, distance = compare_embeddings(stored_embedding, new_embedding)
        
        return jsonify({
            'success': True,
            'verified': is_match,
            'confidence': float(confidence),
            'distance': float(distance),
            'userId': user_id,
            'message': 'Face verified successfully' if is_match else 'Face verification failed'
        })
    
    except Exception as e:
        print(f"Error in verify endpoint: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/delete', methods=['POST'])
def delete_face():
    """Delete enrolled face data for a user"""
    try:
        data = request.json
        user_id = data.get('userId')
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'Missing userId'
            }), 400
        
        # Delete files
        embedding_path = os.path.join(EMBEDDINGS_DIR, f'{user_id}.npy')
        metadata_path = os.path.join(EMBEDDINGS_DIR, f'{user_id}_metadata.json')
        
        deleted = False
        if os.path.exists(embedding_path):
            os.remove(embedding_path)
            deleted = True
        if os.path.exists(metadata_path):
            os.remove(metadata_path)
        
        if not deleted:
            return jsonify({
                'success': False,
                'error': 'User face data not found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': f'Face data deleted for user {user_id}'
        })
    
    except Exception as e:
        print(f"Error in delete endpoint: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/enrolled-users', methods=['GET'])
def get_enrolled_users():
    """Get list of all enrolled users"""
    try:
        files = os.listdir(EMBEDDINGS_DIR)
        user_ids = [f.replace('.npy', '') for f in files if f.endswith('.npy')]
        
        users = []
        for user_id in user_ids:
            metadata_path = os.path.join(EMBEDDINGS_DIR, f'{user_id}_metadata.json')
            if os.path.exists(metadata_path):
                with open(metadata_path, 'r') as f:
                    metadata = json.load(f)
                    users.append(metadata)
            else:
                users.append({'user_id': user_id})
        
        return jsonify({
            'success': True,
            'count': len(users),
            'users': users
        })
    
    except Exception as e:
        print(f"Error getting enrolled users: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("\n" + "="*50)
    print("Face Recognition API Server")
    print("="*50)
    print(f"Device: {device}")
    print(f"Embeddings directory: {EMBEDDINGS_DIR}")
    print("\nAvailable endpoints:")
    print("  POST /enroll - Enroll a new face")
    print("  POST /verify - Verify a face")
    print("  POST /delete - Delete face data")
    print("  GET /enrolled-users - List enrolled users")
    print("  GET /health - Health check")
    print("\nStarting server on http://0.0.0.0:5000")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
