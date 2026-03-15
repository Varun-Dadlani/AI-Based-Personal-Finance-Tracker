import { useNavigate } from "react-router-dom";
import useUserAuth  from "../auth/useUserAuth";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useUserAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return <button onClick={handleLogout}>Logout</button>;
}
