"use client";

import { createContext, useContext, useMemo } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  // console.log(socket);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
