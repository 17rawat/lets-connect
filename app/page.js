"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useSocket } from "@/context/socket";

const Home = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const socket = useSocket();

  // console.log(socket);

  const generateRoomId = () => {
    const id = uuidv4();
    setRoomId(id);
  };

  useEffect(() => {
    socket.on("joined-room", ({ roomId }) => {
      router.push(`/room/${roomId}`);
    });

    return () => {
      socket.on("joined-room", ({ roomId }) => {
        router.push(`/room/${roomId}`);
      });
    };
  }, [socket]);

  const joinMeeting = () => {
    socket.emit("join-room", { username, roomId });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      toast.success("Meeting ID copied to clipboard!");
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Welcome to WebRTC Meeting
        </h1>
        <button
          onClick={generateRoomId}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition mb-4"
        >
          Generate Meeting ID
        </button>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="flex-grow p-2 border rounded-lg text-black mr-2"
            placeholder="Your Meeting ID will appear here"
          />
          <button
            onClick={copyToClipboard}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
            disabled={!roomId}
          >
            Copy
          </button>
        </div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded-lg text-black mb-4"
          placeholder="Enter your name here"
        />
        <button
          onClick={joinMeeting}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
};

export default Home;
