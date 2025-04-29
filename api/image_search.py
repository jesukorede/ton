from tensorflow.keras.applications import ResNet50
from tensorflow.keras.preprocessing import image
import numpy as np

class ImageSearchEngine:
    def __init__(self):
        self.model = ResNet50(weights='imagenet', include_top=False)
        
    def extract_features(self, img_path):
        img = image.load_img(img_path, target_size=(224, 224))
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        features = self.model.predict(x)
        return features.flatten()