import { useState } from "react";
import api from "../api/api";
import Button from "../components/Button";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      window.location.href = "/dashboard";
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border rounded px-3 py-2 mb-6"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <Button onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
