import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(
        data.message ||
          "If the email exists, a reset link has been sent."
      );
    } catch {
      setMessage("Server is waking up. Please retry in 10 seconds.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg w-96 text-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Email address"
          className="w-full p-2 mb-3 rounded bg-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <p className="text-green-400 text-sm mt-4 text-center">
            {message}
          </p>
        )}

        <p
          className="text-sm text-blue-400 mt-4 text-center cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
