import os
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

# --- 2. DEFINE THE CLASS NAMES ---
# These must match the order from your Google Colab training EXACTLY.
# Based on PlantVillage, here are the standard classes:
CLASS_NAMES = [
    'Pepper__bell___Bacterial_spot', 'Pepper__bell___healthy',
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

# --- 3. HELPER FUNCTION: PREPARE IMAGE ---
# --- 3. HELPER FUNCTION: PREPARE IMAGE ---
def prepare_image(image_url):
    # 1. Define Headers (The "Fake ID") - MUST BE HERE
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    }

    # 2. Download the Image
    response = requests.get(image_url, headers=headers)
    
    # Check if download worked
    if response.status_code != 200:
        raise Exception(f"Failed to download image. Status: {response.status_code}")

    # 3. Process the Image
    img = Image.open(BytesIO(response.content))
    img = img.convert('RGB') # Fix for PNG/Transparency issues
    
    # IMPORTANT: Resize to 128x128 (Must match your Training Model)
    img = img.resize((128, 128)) 
    
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0) 
    return img_array
@app.route('/', methods=['GET'])
def home():
    return "🧠 Real AI Engine is Running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        image_url = data.get('imageUrl')

        if not image_url:
            return jsonify({"error": "No image URL provided"}), 400

        print(f"📸 Downloading & Analyzing: {image_url}")

        # 1. Preprocess the image
        processed_image = prepare_image(image_url)

        # 2. Ask the Brain (Model)
        predictions = model.predict(processed_image)
        
        # 3. Find the highest confidence score
        score = tf.nn.softmax(predictions[0])
        class_index = np.argmax(score)
        confidence = round(100 * np.max(score), 2)
        predicted_disease = CLASS_NAMES[class_index]

        # 4. Generate a Solution (Simple lookup)
        # You can expand this dictionary later!
        solution = "Consult an expert."
        if "healthy" in predicted_disease:
            solution = "Your crop looks healthy! Keep monitoring water."
        elif "Bacterial_spot" in predicted_disease:
            solution = "Use copper-based fungicides."
        elif "Early_blight" in predicted_disease:
            solution = "Remove infected leaves and ensure good airflow."
        elif "Late_blight" in predicted_disease:
            solution = "Apply fungicides immediately and avoid overhead watering."

        result = {
            "disease": predicted_disease.replace("_", " "), # Make it readable
            "confidence": confidence,
            "solution": solution
        }

        print(f"✅ Result: {result['disease']} ({confidence}%)")
        return jsonify(result)

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"error": str(e)}), 500
    


if __name__ == '__main__':
    app.run(port=5002, debug=True)