"use client";

import { useEffect } from "react";
import { connectSocket } from "@/utils/socket";
import useAuthStore from "@/store/authStore";

export default function ClientSocketProvider({ children }) {
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.token) {
      const socket = connectSocket(user.token);
      socket.on("connect", () => console.log("socket connected"));
    }
  }, [user?.token]);

  return children;
}
