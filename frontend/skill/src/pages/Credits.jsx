import { useState } from "react";
import { toast } from "react-hot-toast";
import { Coins, Zap, Star, ShieldCheck } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const CREDIT_PACKAGES = [
  { id: "pkg_1", credits: 50, priceRs: 50, icon: Coins, color: "text-blue-500", bg: "bg-blue-100" },
  { id: "pkg_2", credits: 100, priceRs: 100, icon: Zap, color: "text-yellow-500", bg: "bg-yellow-100" },
  { id: "pkg_3", credits: 200, priceRs: 180, icon: Star, color: "text-purple-500", bg: "bg-purple-100", popular: true },
  { id: "pkg_4", credits: 500, priceRs: 450, icon: ShieldCheck, color: "text-green-500", bg: "bg-green-100" },
];

function Credits() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (pkg) => {
    try {
      setLoading(true);
      // 1. Create order on backend
      const { data: orderData } = await api.post("/payments/create-order", {
        amount: pkg.priceRs,
        credits: pkg.credits,
      });

      if (!orderData.success) throw new Error("Failed to create order");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Skill Swap",
        description: `Purchase ${pkg.credits} Credits`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // 2. Verify payment on backend
            const { data: verifyData } = await api.post("/payments/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              credits: pkg.credits,
            });

            if (verifyData.success) {
              toast.success(`Success! Added ${pkg.credits} credits to your account.`);
              // Update user state
              setUser(verifyData.user);
              localStorage.setItem("user", JSON.stringify(verifyData.user));
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (error) {
            toast.error("Error verifying payment.");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#4f46e5", // Indigo-600
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error("Payment failed. Please try again.");
      });
      rzp.open();

    } catch (error) {
      toast.error(error.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 p-8">
          
          <div className="bg-white rounded-3xl shadow p-8 mb-8">
            <h1 className="text-3xl font-bold mb-2">Buy Credits</h1>
            <p className="text-gray-600 mb-6">
              Credits are used to send swap requests (5 credits) and attend live video sessions (5 credits).
            </p>
            
            <div className="inline-flex items-center gap-3 bg-indigo-50 border border-indigo-100 px-6 py-3 rounded-2xl">
              <div className="bg-indigo-600 text-white p-2 rounded-full">
                <Coins size={20} />
              </div>
              <div>
                <p className="text-sm text-indigo-900 font-medium opacity-80">Current Balance</p>
                <p className="text-2xl font-bold text-indigo-900">{user?.credits || 0}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CREDIT_PACKAGES.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`bg-white rounded-3xl shadow-sm border-2 transition-all relative overflow-hidden flex flex-col ${
                  pkg.popular ? "border-purple-500 shadow-md transform -translate-y-1" : "border-transparent hover:border-gray-200"
                }`}
              >
                {pkg.popular && (
                  <div className="bg-purple-500 text-white text-xs font-bold uppercase tracking-wider text-center py-1 absolute top-0 w-full">
                    Most Popular
                  </div>
                )}
                
                <div className={`p-6 flex flex-col items-center text-center flex-1 ${pkg.popular ? "pt-10" : ""}`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${pkg.bg} ${pkg.color}`}>
                    <pkg.icon size={32} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-1">{pkg.credits}</h3>
                  <p className="text-gray-500 font-medium mb-6">Credits</p>
                  
                  <div className="mt-auto w-full">
                    <button
                      onClick={() => handlePayment(pkg)}
                      disabled={loading}
                      className={`w-full py-3 rounded-xl font-semibold transition ${
                        pkg.popular 
                          ? "bg-purple-600 hover:bg-purple-700 text-white" 
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      Buy for ₹{pkg.priceRs}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </>
  );
}

export default Credits;
