from flask import Flask, request, jsonify
from flask_cors import CORS
from recommendation import ProductRecommender
from shopping_assistant import ShoppingAssistant

app = Flask(__name__)
CORS(app)

# Initialize AI components
recommender = ProductRecommender()
assistant = ShoppingAssistant()

# Sample product data for training
product_descriptions = [
    "TON Crystal Wallet with secure storage and easy transactions",
    "TON NFT Collection featuring unique digital art",
    "TON Mining Kit for professional crypto mining"
]

# Train the recommender system
recommender.train(product_descriptions)

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    try:
        data = request.json
        product_id = data.get('product_id')
        recommendations = recommender.get_recommendations(product_id)
        return jsonify({
            "success": True,
            "recommendations": recommendations
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

@app.route('/api/assistant', methods=['POST'])
def chat_with_assistant():
    try:
        data = request.json
        query = data.get('query')
        context = data.get('context', '')
        response = assistant.process_query(query, context)
        return jsonify({
            "success": True,
            "response": response
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)