"use client";

import { useRef, useState, useEffect } from "react";
import { useEventListener } from "usehooks-ts";
import { VolumeControl } from "./volume-control";
import { FullscreenControl } from "./fullscreen-control";
import { useWebRTC } from "@/hooks/use-room-conn";

export const LiveVideo = (hostName, hostIdentity) => {
  const wrapperRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const { videoRef, isConnected, initializeWebRTC } = useWebRTC(
    hostName,
    hostIdentity
  );

  const onVolumeChange = (value) => {
    setVolume(+value);
    if (videoRef?.current) {
      videoRef.current.muted = value === 0;
      videoRef.current.volume = +value * 0.01;
      setIsMuted(value === 0);
    }
  };

  useEffect(() => {
    if (videoRef.current && !isConnected) {
      initializeWebRTC();
    }
  }, [videoRef, isConnected, initializeWebRTC]);

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else if (wrapperRef?.current) {
      wrapperRef.current.requestFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen = document.fullscreenElement !== null;
    setIsFullscreen(isCurrentlyFullscreen);
  };

  useEventListener("fullscreenchange", handleFullscreenChange, wrapperRef);

  const toggleMute = () => {
    onVolumeChange(isMuted ? 50 : 0); // Toggle between muted (0) and 50% volume
  };

  return (
    <div ref={wrapperRef} className="relative h-full flex">
      <video ref={videoRef} width="100%" autoPlay playsInline muted={isMuted} />
      <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100 hover:transition-all">
        <div className="absolute bottom-0 flex h-14 w-full items-center justify-between bg-gradient-to-r from-neutral-900 px-4">
          {/* <VolumeControl
            onChange={onVolumeChange}
            value={volume}
            onToggle={toggleMute}
          /> */}
          <FullscreenControl
            isFullscreen={isFullscreen}
            onToggle={toggleFullscreen}
          />
        </div>
      </div>
    </div>
  );
};
