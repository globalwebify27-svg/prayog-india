"use client";

import { useState } from "react";
import Script from "next/script";

export default function PayButton({ amount, enrollmentId, installmentId }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create order
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, enrollmentId, installmentId }),
      });
      const data = await res.json();

      if (!data.success) {
        alert("Failed to create order: " + data.message);
        setLoading(false);
        return;
      }

      // 2. Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Prayog India",
        description: "Installment Payment",
        order_id: data.orderId,
        handler: async function (response) {
          // 3. Verify Payment
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              enrollmentId,
              amount,
              installmentId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment successful!");
            window.location.reload(); // Refresh to update status
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "Student",
          email: "student@prayogindia.in",
        },
        theme: {
          color: "#0f172a", // Navy
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        alert("Payment failed: " + response.error.description);
      });
      paymentObject.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong during payment initialization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button 
        onClick={handlePayment}
        disabled={loading}
        className="px-4 py-2 bg-navy text-white hover:bg-black rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm min-w-[100px] text-center disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </>
  );
}
