from transformers import pipeline

class ShoppingAssistant:
    def __init__(self):
        self.qa_pipeline = pipeline("question-answering")
        self.classifier = pipeline("text-classification")
        
    def process_query(self, query, context):
        try:
            # Classify the intent of the query
            intent = self.classifier(query)[0]
            
            if intent['label'] in ['product_info', 'price', 'availability']:
                answer = self.qa_pipeline(
                    question=query,
                    context=context
                )
                return answer['answer']
            
            return "I can help you find products and answer questions about them!"
            
        except Exception as e:
            return "I'm sorry, I couldn't process your request. Please try again."