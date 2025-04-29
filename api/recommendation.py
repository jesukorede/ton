from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class ProductRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.product_descriptions = []
        
    def train(self, product_descriptions):
        self.product_descriptions = product_descriptions
        self.tfidf_matrix = self.vectorizer.fit_transform(product_descriptions)
        
    def get_recommendations(self, product_id, num_recommendations=3):
        if not self.product_descriptions:
            return []
            
        product_vector = self.tfidf_matrix[product_id]
        cosine_sim = cosine_similarity(product_vector, self.tfidf_matrix)
        sim_scores = list(enumerate(cosine_sim[0]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        return [i[0] for i in sim_scores[1:num_recommendations+1]]