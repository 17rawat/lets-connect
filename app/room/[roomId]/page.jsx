"use client";

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

function Room() {
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });
        setStream(localStream);
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };

    getMedia();
  }, []);

  return (
    <div className="flex m-4 p-4 bg-gray-800 text-white">
      <ReactPlayer
        url={stream}
        playing
        muted
        className="bg-white w-1/2 h-auto"
      />

      <ReactPlayer
        url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        className="bg-white w-1/2 h-auto"
        controls
      />
    </div>
  );
}

export default Room;
