import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';


import axios from '../../axios';

const stripePromise = loadStripe("pk_test_51OzmBEEFSRqLNLAtlD4WepoA7O4I9KT2CvMhFob4JUmy250d8JvvNKEsZwi5sci5w1k8i7EbvC74ag2gKqdpqKZV00DWNRp48X");

const CheckoutForm = ({data}) => {
  const [amount, setAmount] = useState(100);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  console.log('Data is here ', data.receiverId, data.senderId);


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      console.log('Stripe has not loaded.');
      return;
    }
  
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
  
    if (error) {
      console.log('[error]', error);
      let userFriendlyMessage = '';
      switch (error.code) {
        case 'incorrect_number':
          userFriendlyMessage = 'The card number is incorrect. Please check and try again.';
          break;
        default:
          userFriendlyMessage = `Payment failed: ${error.message}`;
      }
      setPaymentStatus(userFriendlyMessage);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      try {
        const response = await axios.post('/user/payment_with_card', {
          payment_method_id: paymentMethod.id,
          amount: amount,
          success_url: window.location.origin + '/user/chatbox',
          cancel_url: window.location.origin + '/user/Payment',
        });
        console.log(response.data);
  
        // Get senderId and receiverId from props or state
        const { senderId, receiverId } = data;
  
        // Check the chat box
        await axios.get("/user/check_chat_box", {
          params: {
            sender_id: senderId,
            id: receiverId,
          },
        });
  
        // Navigate to chat box
        navigate("/user/chatbox", { state: { UserID: receiverId } });
      } catch (err) {
        console.log(err.response ? err.response.data.error : 'An error occurred');
        setPaymentStatus(`Payment failed: ${err.response ? err.response.data.error : 'An error occurred'}`);
      }
    }
  }
  
  

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white">
        <div className="mb-6 text-center">
          <h2 className="text-lg font-medium mb-2">Enter Payment Details</h2>
          <div className="text-gray-700">
            <label htmlFor="amount" className="block text-start text-sm font-medium text-gray-700 mb-2">
              Amount ($):
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={amount}
              className="w-full py-3 px-4 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-6">
            <label
              htmlFor="card-details"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Card Details:
            </label>
            <div className="py-3 px-4 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500">
              <CardElement />
            </div>
          </div>
          <button
            type="submit"
            disabled={!stripe}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg focus:outline-none"
          >
            Submit Payment
          </button>
        </form>
        {paymentStatus && <div className="text-center font-medium mt-4">{paymentStatus}</div>}
      </div>
    </div>
  );
}
  

  const PaymentViaCard = ({data}) => (
    <Elements stripe={stripePromise}>
      <CheckoutForm data={data} />
    </Elements>
  );
  
  export default PaymentViaCard;