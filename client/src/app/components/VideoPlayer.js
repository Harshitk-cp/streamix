"use client";
import React from "react";
import ReactPlayer from "react-player";

const VideoPlayer = () => {
  let videosrc = "http://localhost:8080/hls/.m3u8";

  return (
    <div>
      <ReactPlayer
        width="1000px"
        height="800px"
        url={videosrc}
        controls={true}
        light={false}
        pip={true}
      />
      <source src={videosrc} type="video/mp4" />
    </div>
  );
};

export default VideoPlayer;
