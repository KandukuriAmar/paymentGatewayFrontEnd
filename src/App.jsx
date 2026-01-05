import './App.css'
import axios from 'axios'
import { useState } from 'react'

function App() {
  const handlePayment = async () => {
    const backurl = import.meta.env.VITE_BACKEND_URL
    const razorpaykey = import.meta.env.RAZORPAY_KEY_ID
    const data = await axios.post("${backurl}/create-order", {amount});
  
    const options = {
      key: razorpaykey,
      amount: data.data.amount,
      currency: "INR",
      name: "Razorpay",
      description: "firstPayment",
      order_id: data.data.id,
      method: {
        upi: true
      },
      handler: async(response) => {
        try {
          await axios.post("${backurl}/validate-payment", response);
          alert("payment successful");
        } catch(err) {
          console.error(err);
          alert("Payment verification failed");
        }
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", (res) => {
      alert("payment failed");
    });
  }
  const [amount, setAmount] = useState(0);
  return (
    <>
      <h1>QR Code Payment</h1>
      <input type='text' placeholder='Enter amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handlePayment}>payOut</button>
    </>
  );
}

export default App
