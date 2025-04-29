import React, { useState } from 'react';

function PaymentProcessor({ total, onSuccess, onCancel }) {
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSuccess();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-processor">
      <h2>Complete Your Purchase</h2>
      <div className="payment-details">
        <p>Total Amount: {total.toFixed(2)} TON</p>
        <button 
          onClick={handlePayment}
          disabled={processing}
          className="payment-button"
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
        <button 
          onClick={onCancel}
          disabled={processing}
          className="cancel-button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default PaymentProcessor;