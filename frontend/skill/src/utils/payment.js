import api from "../services/api";

export const processPayment = async ({
  amount,
  credits,
  userName,
  userEmail
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Create order on backend (Required for secure Razorpay integration)
      const { data: orderData } = await api.post("/payments/create-order", {
        amount: amount,
        credits: credits,
      });

      if (!orderData.success) {
        return reject(new Error("Failed to create order on server"));
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TAwmU8DgG4NUPu",
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Skill Swap",
        description: `Purchase ${credits} Credits`,
        order_id: orderData.order.id,

        handler: async function (response) {
          try {
            // 2. Verify payment on backend
            const { data: verifyData } = await api.post("/payments/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              credits: credits,
            });

            if (verifyData.success) {
              resolve({
                success: true,
                paymentId: response.razorpay_payment_id,
                user: verifyData.user
              });
            } else {
              reject(new Error("Payment verification failed."));
            }
          } catch (error) {
            reject(error);
          }
        },

        prefill: {
          name: userName,
          email: userEmail,
        },

        theme: {
          color: "#4f46e5" // Indigo-600
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on("payment.failed", function (response) {
        reject(new Error("Payment failed. Please try again."));
      });

      paymentObject.open();

    } catch (error) {
      reject(error);
    }
  });
};
