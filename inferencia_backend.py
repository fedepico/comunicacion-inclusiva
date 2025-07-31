import numpy as np
import cv2
import base64
from tensorflow.keras.models import load_model

# Cargar modelo entrenado
modelo = load_model("app/modelos/sign_language_model_reducido.h5")
clases = list("ABCDEFGHIJ")  # Puedes ajustar si tienes más

def base64_to_frame(b64_string):
    img_bytes = base64.b64decode(b64_string.split(',')[1])
    img_array = np.frombuffer(img_bytes, dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)  # Mantener RGB
    img = cv2.resize(img, (64, 64))
    img = img.astype(np.float32) / 255.0
    return img
