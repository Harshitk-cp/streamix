import { useCallback, useEffect, useRef, useState } from "react";

const CLIENT_ID = `key${Math.random()}`;

export const useWebRTC = (hostName, hostId, selfId, selfName) => {
  const videoRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const socketRef = useRef(null);
  const peerConnectionsRef = useRef(new Map());
  const iceCandidatesBufferRef = useRef(new Map());

  const SERVER_URL = `ws://localhost:8081/v1/ws?clientID=${
    selfId || CLIENT_ID
  }&roomID=${hostId}&clientName=${selfName}`;

  const initializeWebRTC = useCallback(() => {
    console.log("initialise");
    if (!videoRef.current) {
      console.error("Video element is not ready yet.");
      return;
    }

    const socket = new WebSocket(SERVER_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Successfully connected to the signaling server!");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "getOffer":
          handleOffer(message.data, message.fromClientID);
          break;
        case "getCandidate":
          handleCandidate(message.data, message.fromClientID);
          break;
        case "isPublishing":
          handlePlay(message.data === "true");
          break;
        case "getChat":
          const msg = {
            content: message.data,
            senderID: message.fromClientID,
            timestamp: new Date().getTime(),
          };
          handleChatMessage(msg);
        default:
          console.warn("Unknown message type:", message.type);
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from server");
      cleanup();
    };

    setIsConnected(true);
    return () => {
      socket.close();
      cleanup();
    };
  }, [videoRef]);

  const handleChatMessage = (chatMessage) => {
    setChatMessages((prevMessages) => [...prevMessages, chatMessage]);
  };

  const sendChatMessage = (content) => {
    sendMessage("chat", content, selfId || CLIENT_ID);
  };

  const createPeerConnection = (clientID) => {
    const pc_config = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const peerConnection = new RTCPeerConnection(pc_config);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage("candidate", event.candidate.candidate, clientID);
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log(
        "WebRTC peer connection state:",
        peerConnection.connectionState
      );
      if (
        peerConnection.connectionState === "disconnected" ||
        peerConnection.connectionState === "failed"
      ) {
        peerConnectionsRef.current.delete(clientID);
        iceCandidatesBufferRef.current.delete(clientID);
      }
    };

    peerConnection.ontrack = (event) => {
      console.log(videoRef.current);
      if (videoRef.current && event.streams && event.streams[0]) {
        videoRef.current.srcObject = event.streams[0];
      } else {
        console.error(
          "No video element reference or stream found in the event."
        );
      }
    };

    peerConnection.addTransceiver("video");
    peerConnection.addTransceiver("audio");

    return peerConnection;
  };

  const handleOffer = (offerData, fromClientID) => {
    let peerConnection = peerConnectionsRef.current.get(fromClientID);
    if (!peerConnection) {
      peerConnection = createPeerConnection(fromClientID);
      peerConnectionsRef.current.set(fromClientID, peerConnection);
    }

    const offerSDP = new RTCSessionDescription({
      type: "offer",
      sdp: offerData,
    });

    peerConnection
      .setRemoteDescription(offerSDP)
      .then(() => {
        console.log("Set remote description successfully");
        createAnswer(peerConnection, fromClientID);
      })
      .catch((error) => {
        console.error("Error setting remote description:", error);
      });
  };

  const handleCandidate = (candidateData, fromClientID) => {
    const candidateObject = JSON.parse(candidateData);
    const candidateString = candidateObject.candidate;

    const candidateInit = {
      candidate: candidateString,
      sdpMid: candidateObject.sdpMid || "0",
      sdpMLineIndex: candidateObject.sdpMLineIndex || 0,
    };
    const candidate = new RTCIceCandidate(candidateInit);

    const peerConnection = peerConnectionsRef.current.get(fromClientID);
    if (peerConnection) {
      if (peerConnection.remoteDescription) {
        console.log("candidate to add : ", candidateString);
        peerConnection.addIceCandidate(candidate).catch((error) => {
          console.error("Error adding ICE candidate:", error);
        });
      } else {
        if (!iceCandidatesBufferRef.current.has(fromClientID)) {
          iceCandidatesBufferRef.current.set(fromClientID, []);
        }
        iceCandidatesBufferRef.current.get(fromClientID)?.push(candidate);
      }
    }
  };

  const createAnswer = (peerConnection, clientIdWithOffer) => {
    peerConnection
      .createAnswer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      })
      .then((answer) => {
        console.log("Created answer");
        return peerConnection.setLocalDescription(answer);
      })
      .then(() => {
        sendMessage(
          "answer",
          peerConnection.localDescription.sdp,
          clientIdWithOffer
        );
      })
      .catch((error) => {
        console.error(
          "Error creating or setting local answer description:",
          error
        );
      });
  };

  const sendMessage = (type, data, fromClientId) => {
    const message = {
      type: type,
      data: data,
      clientID: selfId || CLIENT_ID,
      fromClientID: fromClientId,
    };
    console.log(message);
    socketRef.current?.send(JSON.stringify(message));
  };

  const cleanup = () => {
    peerConnectionsRef.current.forEach((pc) => pc.close());
    peerConnectionsRef.current.clear();
    iceCandidatesBufferRef.current.clear();
  };

  const handlePlay = (isPublishing) => {
    setIsPublishing(isPublishing);
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);

      const stream = videoRef.current.srcObject;
      if (stream) {
        stream.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
      }

      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  };

  const startStream = () => {
    const message = {
      type: "startStream",
      data: null,
      clientID: selfId || CLIENT_ID,
      fromClientID: selfId || CLIENT_ID,
      roomID: "key",
    };
    socketRef.current?.send(JSON.stringify(message));
  };

  return {
    videoRef,
    isMuted,
    handlePlay,
    startStream,
    isConnected,
    isPublishing,
    initializeWebRTC,
    identity: CLIENT_ID,
    chatMessages,
    sendChatMessage,
  };
};
