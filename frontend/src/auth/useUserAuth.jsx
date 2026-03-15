import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function useUserAuth() {
  return useContext(AuthContext);
}
