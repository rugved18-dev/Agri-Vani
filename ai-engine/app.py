import os
import base64
import numpy as np
import requests
from flask import Flask, request, jsonify
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = Flask(__name__)

# --- 1. LOAD THE TRAINED MODEL ---
print("⏳ Loading AI Model... (This may take a few seconds)")
try:
    model = tf.keras.models.load_model('plant_disease_model.h5')
    print("✅ Model Loaded Successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    print("Make sure 'plant_disease_model.h5' is in the ai-engine folder!")
    exit()

# --- 2. CLASS NAMES (full PlantVillage 38-class dataset) ---
CLASS_NAMES = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy',
]

# Validate that the model output size matches CLASS_NAMES
try:
    model_output_classes = model.output_shape[-1]
    if model_output_classes != len(CLASS_NAMES):
        print(f"⚠️  WARNING: Model has {model_output_classes} output classes but CLASS_NAMES has {len(CLASS_NAMES)} entries!")
        print(f"   Truncating/padding CLASS_NAMES to match model output ({model_output_classes} classes)")
        if model_output_classes < len(CLASS_NAMES):
            CLASS_NAMES = CLASS_NAMES[:model_output_classes]
        else:
            CLASS_NAMES += [f'Unknown_class_{i}' for i in range(len(CLASS_NAMES), model_output_classes)]
    print(f"✅ CLASS_NAMES validated: {len(CLASS_NAMES)} classes match model output")
except Exception as e:
    print(f"⚠️  Could not validate model output shape: {e}")


SOLUTIONS = {
    "healthy": "Your crop looks healthy! Keep monitoring water and nutrients.",
    "Bacterial_spot": "Use copper-based fungicides. Remove and destroy infected leaves.",
    "Early_blight": "Remove infected leaves. Ensure good airflow. Apply chlorothalonil fungicide.",
    "Late_blight": "Apply fungicides immediately. Avoid overhead watering. Destroy infected plants.",
    "Leaf_Mold": "Improve ventilation. Apply fungicides. Avoid leaf wetness.",
    "Septoria_leaf_spot": "Remove infected leaves. Apply fungicide at first sign.",
    "Spider_mites": "Use miticide or neem oil. Keep plants well-watered.",
    "Target_Spot": "Apply fungicide. Remove severely infected leaves.",
    "Yellow_Leaf_Curl_Virus": "Control whiteflies (vector). Remove infected plants.",
    "mosaic_virus": "Remove infected plants. Control aphids. Use virus-free seeds.",
}

def get_solution(disease_name):
    for keyword, solution in SOLUTIONS.items():
        if keyword.lower() in disease_name.lower():
            return solution
    return "Consult a local agricultural expert for treatment advice."

def prepare_image_from_bytes(image_bytes):
    """Process raw image bytes into model input."""
    img = Image.open(BytesIO(image_bytes))
    img = img.convert('RGB')
    img = img.resize((128, 128))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)
    return img_array

def prepare_image_from_url(image_url):
    """Download image from URL and prepare for model."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    response = requests.get(image_url, headers=headers, timeout=30)
    if response.status_code != 200:
        raise Exception(f"Failed to download image. Status: {response.status_code}")
    return prepare_image_from_bytes(response.content)

@app.route('/', methods=['GET'])
def home():
    return "🧠 Agri-Vani AI Engine is Running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        image_url = data.get('imageUrl')
        image_base64 = data.get('imageBase64')

        if not image_url and not image_base64:
            return jsonify({"error": "Provide either 'imageUrl' or 'imageBase64'"}), 400

        if image_base64:
            # ✅ Direct base64 — no cloud download needed
            print("📸 Analyzing image from base64...")
            image_bytes = base64.b64decode(image_base64)
            processed_image = prepare_image_from_bytes(image_bytes)
        else:
            # Fallback: download from URL
            print(f"📸 Downloading & Analyzing: {image_url}")
            processed_image = prepare_image_from_url(image_url)

        predictions = model.predict(processed_image)
        score = tf.nn.softmax(predictions[0])
        class_index = np.argmax(score)
        confidence = round(100 * float(np.max(score)), 2)
        predicted_disease = CLASS_NAMES[class_index]
        solution = get_solution(predicted_disease)

        result = {
            "disease": predicted_disease.replace("_", " "),
            "confidence": confidence,
            "solution": solution
        }

        print(f"✅ Result: {result['disease']} ({confidence}%)")
        return jsonify(result)

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)