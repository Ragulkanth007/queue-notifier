// import { useEffect } from "react";
// import { getSocket } from "@/utils/socket";
// import useAuthStore from "@/store/authStore";

// export default function QueueSocketListener({ roomId, onQueueUpdate }) {
//   const { user } = useAuthStore();

//   useEffect(() => {
//     const socket = getSocket() || io(process.env.NEXT_PUBLIC_BACKEND_URL, {
//       auth: { token: user.token }
//     });

//     socket.emit("joinRoom", roomId);

//     const handleUpdate = (data) => {
//       console.log("Queue updated via socket", data);
//       onQueueUpdate(data.queue);
//     };

//     socket.on("queue:update", handleUpdate);

//     return () => {
//       socket.off("queue:update", handleUpdate);
//       socket.emit("leaveRoom", roomId);
//     };
//   }, [roomId, user.token, onQueueUpdate]);

//   return null;
// }
