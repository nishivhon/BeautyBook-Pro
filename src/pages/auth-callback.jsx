import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const full_name = searchParams.get("full_name");
    const phone = searchParams.get("phone");

    if (!token) {
      setError("Invalid verification link");
      setLoading(false);
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    // Verify token on backend
    fetch(`${import.meta.env.VITE_API_URL}/auth/auth-callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, full_name, phone })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          // Store verified user in sessionStorage
          sessionStorage.setItem("verifiedUser", JSON.stringify(data.user));
          navigate("/register");
        } else {
          setError(data.error || "Verification failed");
          setTimeout(() => navigate("/"), 2000);
        }
      })
      .catch(err => {
        setError("Error verifying email");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white font-sans">
      <div className="text-center">
        {loading ? (
          <>
            <h2>Verifying your email...</h2>
            <p>Please wait while we confirm your registration.</p>
          </>
        ) : error ? (
          <>
            <h2 className="text-amber">Verification Error</h2>
            <p>{error}</p>
            <p className="text-xs text-gray-400">Redirecting to home page...</p>
          </>
        ) : (
          <>
            <h2 className="text-amber">Email Verified!</h2>
            <p>Redirecting to appointment booking...</p>
          </>
        )}
      </div>
    </div>
  );
};
