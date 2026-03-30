import { useState } from "react";
import API from "../../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/auth/forgot", { email });
    alert("Reset link sent");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>
      <input
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button>Send</button>
    </form>
  );
};

export default ForgotPassword;