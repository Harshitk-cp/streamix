"use client";
const ReactPlayerNoSSR = dynamic(() => import("react-player"), { ssr: false });
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Hls from "hls.js";
import { LiveKitRoom } from "@livekit/components-react";
// import { Video } from "./video_player/video";

const VideoPlayer = () => {
  let liveVideoSrc = "http://localhost:8080/hls/.m3u8";
  let defaultVideoSrc =
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4";

  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls(config);
      hls.loadSource(liveVideoSrc);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = liveVideoSrc;
    }
  }, []);

  return (
    <div className="w-full h-full">
      {/* <video ref={videoRef} className="w-full h-full"></video> */}
      {/* <LiveKitRoom
        token="65c54c159764be7f63255530"
        serverUrl="ws://localhost:8000"
        connect={true}
      >
        <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-auto">
          <Video host />
        </div>
      </LiveKitRoom> */}
      {/* <ReactPlayerNoSSR
        ref={videoRef}
        url={liveVideoSrc}
        playbackRate={1}
        controls={true}
        muted={true}
        light={false}
        playing={true}
        pip={true}
        width="100%"
        height="100%"
        config={{
          file: {
            forceHLS: true,
            forceSafariHLS: true,
            hlsOptions: { config },
          },
        }}
      /> */}
    </div>
  );
};

var config = {
  autoStartLoad: true,
  startPosition: -1,
  debug: false,
  capLevelOnFPSDrop: false,
  capLevelToPlayerSize: false,
  defaultAudioCodec: undefined,
  initialLiveManifestSize: 1,
  maxBufferLength: 30,
  maxMaxBufferLength: 600,
  backBufferLength: Infinity,
  frontBufferFlushThreshold: Infinity,
  maxBufferSize: 60 * 1000 * 1000,
  maxBufferHole: 0.5,
  highBufferWatchdogPeriod: 2,
  nudgeOffset: 0.1,
  nudgeMaxRetry: 3,
  maxFragLookUpTolerance: 0.25,
  liveSyncDurationCount: 3,
  liveMaxLatencyDurationCount: Infinity,
  liveDurationInfinity: false,
  preferManagedMediaSource: false,
  enableWorker: true,
  enableSoftwareAES: true,
  fragLoadPolicy: {
    default: {
      maxTimeToFirstByteMs: 9000,
      maxLoadTimeMs: 100000,
      timeoutRetry: {
        maxNumRetry: 2,
        retryDelayMs: 0,
        maxRetryDelayMs: 0,
      },
      errorRetry: {
        maxNumRetry: 5,
        retryDelayMs: 3000,
        maxRetryDelayMs: 15000,
        backoff: "linear",
      },
    },
  },
  startLevel: undefined,
  audioPreference: {
    characteristics: "public.accessibility.describes-video",
  },
  subtitlePreference: {
    lang: "en-US",
  },
  startFragPrefetch: false,
  testBandwidth: true,
  progressive: false,
  lowLatencyMode: true,
  fpsDroppedMonitoringPeriod: 5000,
  fpsDroppedMonitoringThreshold: 0.2,
  appendErrorMaxRetry: 3,
  // loader: customLoader,
  // fLoader: customFragmentLoader,
  // pLoader: customPlaylistLoader,
  // xhrSetup: XMLHttpRequestSetupCallback,
  // fetchSetup: FetchSetupCallback,
  // abrController: AbrController,
  // bufferController: BufferController,
  // capLevelController: CapLevelController,
  // fpsController: FPSController,
  // timelineController: TimelineController,
  enableDateRangeMetadataCues: true,
  enableEmsgMetadataCues: true,
  enableID3MetadataCues: true,
  enableWebVTT: true,
  enableIMSC1: true,
  enableCEA708Captions: true,
  stretchShortVideoTrack: false,
  maxAudioFramesDrift: 1,
  forceKeyFrameOnDiscontinuity: true,
  abrEwmaFastLive: 3.0,
  abrEwmaSlowLive: 9.0,
  abrEwmaFastVoD: 3.0,
  abrEwmaSlowVoD: 9.0,
  abrEwmaDefaultEstimate: 500000,
  abrEwmaDefaultEstimateMax: 5000000,
  abrBandWidthFactor: 0.95,
  abrBandWidthUpFactor: 0.7,
  abrMaxWithRealBitrate: false,
  maxStarvationDelay: 4,
  maxLoadingDelay: 4,
  minAutoBitrate: 0,
  emeEnabled: false,
  licenseXhrSetup: undefined,
  drmSystems: {},
  drmSystemOptions: {},
  // requestMediaKeySystemAccessFunc: requestMediaKeySystemAccess,
};

// var hls = new Hls(config);

export default VideoPlayer;
