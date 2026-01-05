import './App.css'
import axios from 'axios'
import { useState } from 'react'

function App() {
  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    const backurl = import.meta.env.VITE_BACKEND_URL
    const razorpaykey = import.meta.env.VITE_RAZORPAY_KEY_ID
    const data = await axios.post(`${backurl}/create-order`, {amount});
  
    const options = {
      key: razorpaykey,
      amount: data.data.amount,
      currency: "INR",
      name: "Payment Gateway Demo",
      description: "UPI Payment Integration Demo",
      order_id: data.data.id,
      method: {
        upi: true
      },
      handler: async(response) => {
        try {
          await axios.post(`${backurl}/validate-payment`, response);
          setFlag(true);
          setTextColor("green");
          setText("Payment successful");
          setTimeout(() => {
            setFlag(false);
          }, 3000);
        } catch(err) {
          setFlag(true);
          console.error(err);
          setTextColor("red");
          setText("Payment verification failed");
          setTimeout(() => {
            setFlag(false);
          }, 3000);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", () => {
      alert("Payment failed");
    });
  }
  const [amount, setAmount] = useState(0);
  const [flag, setFlag] = useState(false);
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("");
  
  return (
    <div className="app-container">
      <header className="header">
        <h1 className="project-title">Payment Gateway Demo</h1>
        <p className="project-description">
          Demo website for UPI payment integration using Razorpay
        </p>
      </header>

      <main className="main-content">
        <section className="info-section">
          <h2>About This Project</h2>
          <p>
            This is a demonstration website showcasing UPI payment integration 
            using Razorpay payment gateway. The platform enables secure and 
            seamless payment processing through UPI (Unified Payments Interface) 
            methods, providing a smooth transaction experience.
          </p>
          
          <div className="features">
            <h3>Features</h3>
            <ul>
              <li>Secure UPI payment processing</li>
              <li>Real-time payment verification</li>
              <li>Razorpay integration</li>
              <li>User-friendly interface</li>
            </ul>
          </div>
        </section>

        <section className="payment-section">
          {flag && (
            <div className={`payment-message ${textColor}`}>
              <h2>{text}</h2>
            </div>
          )}

          {!flag && (
            <div className="payment-form">
              <h2>Make a Payment</h2>
              <p className="payment-instructions">
                Enter the amount you wish to pay and proceed with the secure payment process.
              </p>
              <div className="input-group">
                <label htmlFor="amount">Amount (₹)</label>
                <input 
                  type='number' 
                  id="amount"
                  placeholder='Enter amount' 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                />
              </div>
              <button className="pay-button" onClick={handlePayment}>
                Proceed to Payment
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <div className="contact-info">
          <h3>Contact</h3>
          <p>Email: <a href="mailto:forads684@gmail.com">forads684@gmail.com</a></p>
          <p>For support and inquiries, please reach out to us via email.</p>
        </div>
        <div className="footer-note">
          <p>This is a demonstration website for educational and testing purposes.</p>
          <p>Powered by <strong>Razorpay</strong> - Secure Payment Gateway</p>
        </div>
      </footer>
    </div>
  );
}

export default App
