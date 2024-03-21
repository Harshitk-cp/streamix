"use client";
import React, { useEffect, useRef } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = () => {
  let videosrc = "http://localhost:8080/hls/.m3u8";

  const playerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (playerRef.current) {
        const playerElement = playerRef.current.getInternalPlayer();
        if (playerElement) {
          playerElement.setSize(window.innerWidth, window.innerHeight);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <ReactPlayer
        ref={playerRef}
        url={videosrc}
        controls={true}
        light={false}
        pip={true}
        width="100%"
        height="100%"
      />
      <source src={videosrc} type="video/mp4" />
    </div>
  );
};

export default VideoPlayer;
