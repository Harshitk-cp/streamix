"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useWebRTC } from "@/hooks/use-room-conn";
import { useEventListener } from "usehooks-ts";
import { FullscreenControl } from "./fullscreen-control";
import { OfflineVideo } from "./offline-video";

export const Video = ({
  hostName,
  initializeWebRTC,
  videoRef,
  isPublishing,
  isConnected,
  handlePlay,
}) => {
  const wrapperRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  return (
    <div className="aspect-video border-b group relative">
      <div ref={wrapperRef} className="relative h-full flex">
        <video
          ref={videoRef}
          width="100%"
          style={{ display: isPublishing ? "block" : "none" }}
        />

        {!isPublishing && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 bg-opacity-75 text-white z-10">
            <OfflineVideo username={hostName} />
          </div>
        )}
        <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100 hover:transition-all">
          <div className="absolute bottom-0 flex h-14 w-full items-center justify-between bg-gradient-to-r from-neutral-900 px-4">
            <FullscreenControl
              isFullscreen={isFullscreen}
              onToggle={toggleFullscreen}
            />
            <button
              onClick={handlePlay}
              style={{
                color: "black",
                marginTop: "10px",
                backgroundColor: "white",
              }}
            >
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VideoSkeleton = () => {
  return (
    <div className="aspect-video border-x border-background">
      <Skeleton className="h-full w-full rounded-none" />
    </div>
  );
};
