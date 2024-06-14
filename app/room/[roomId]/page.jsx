"use client";

import React, { useEffect, useRef } from "react";

import {
  createPeerConnection,
  createOffer,
  createAnswer,
  addIceCandidate,
  addStream,
} from "@/utils/webrtc";

import { useSocket } from "@/context/socket";

function Room() {
  // const localVideoRef = useRef(null);
  // const remoteVideoRef = useRef(null);
  const socket = useSocket();

  console.log(socket);

  // useEffect(() => {
  //   const initLocalStream = async () => {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     });
  //     localVideoRef.current.srcObject = stream;
  //   };

  //   initLocalStream();
  // }, []);

  const handleNewUserJoined = async ({ username }) => {
    console.log("New user joined", username);

    const peerConnection = createPeerConnection();

    const offer = await createOffer(peerConnection);

    console.log("offer in client", offer);

    socket.emit("offer-call-user", { offer, username });
  };

  const handleIncomingCall = async ({ offer, callFrom }) => {
    console.log(`Incoming call from ${callFrom}}`);
    console.log(offer);

    const peerConnection = createPeerConnection();
    const answer = await createAnswer(peerConnection, offer);

    console.log(answer);

    socket.emit("answer", { username: callFrom, answer });
  };

  const handleAnswer = ({ answer }) => {
    console.log(answer);
  };

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("offer-incoming-call", handleIncomingCall);
    socket.on("answer", handleAnswer);

    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("offer-incoming-call", handleIncomingCall);
      socket.off("answer", handleAnswer);
    };
  }, [handleNewUserJoined, socket, handleIncomingCall]);

  return (
    <div>
      Room
      {/* <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay /> */}
    </div>
  );
}

export default Room;
