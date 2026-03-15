import { useState } from "react";
import api from "../api/api";
import Button from "../components/Button";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError]=useState("");
  const register = async () => {
    try{
    await api.post("/auth/register", { name, email, password });
    window.location.href = "/";
    }
   catch (error) {
    let message = "Something went wrong";

    const detail = error?.response?.data?.detail;

    if (typeof detail === "string") {
      message = detail;
    } else if (Array.isArray(detail)) {
      // FastAPI 422 case
      message = detail.map(err => err.msg).join(", ");
    } else if (error?.message) {
      message = error.message;
    }

    setError(message);
  }


  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Name"
          onChange={e => setName(e.target.value)}
        />

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

        <Button onClick={register} >
          Create Account
        </Button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
