import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { useParams } from "react-router-dom";
import { FaPhone, FaPhoneSlash, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const VideoChat = forwardRef((props, ref) => {
  const [isMuted, setIsMuted] = useState(false); // Track mute state
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const stompClientRef = useRef(null);
  const iceCandidateQueue = useRef([]);
  const receivedStreamRef = useRef(false);
  const peerId = Math.random().toString(36).substring(7);
  const params = useParams();
  const roomUuid = params.id;

  const connectToWebRTC = () => {
    if (stompClientRef.current) return;

    const socket = new SockJS("http://localhost:8080/websocket");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/signal/${roomUuid}`, (message) => {
        handleSignalMessage(JSON.parse(message.body));
      });
      stompClientRef.current = stompClient;
    });
  };

  useImperativeHandle(ref, () => ({
    connect: connectToWebRTC,
    startCall: startCall,
    disconnect: disconnectCall,
  }));

  const handleSignalMessage = async (message) => {
    if (message.sender === peerId) return;

    const peerConnection = peerConnectionRef.current;

    try {
      if (message.type === "offer") {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(message.offer)
        );

        processIceCandidateQueue();

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        stompClientRef.current.send(
          `/app/signal/${roomUuid}`,
          {},
          JSON.stringify({ sender: peerId, type: "answer", answer })
        );
      } else if (message.type === "answer") {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(message.answer)
        );

        processIceCandidateQueue();
      } else if (message.type === "candidate") {
        if (!peerConnection.remoteDescription) {
          iceCandidateQueue.current.push(message.candidate);
        } else {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(message.candidate)
          );
        }
      }
    } catch (error) {
      console.error("Error handling signaling message:", error);
    }
  };

  const processIceCandidateQueue = async () => {
    const peerConnection = peerConnectionRef.current;

    while (iceCandidateQueue.current.length > 0) {
      const candidate = iceCandidateQueue.current.shift();
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Error adding queued ICE candidate:", error);
      }
    }
  };

  const startCall = async () => {
    if (peerConnectionRef.current) return;

    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          {
            urls: "turn:109.199.113.183:3478",
            username: "root",
            credential: "Priview1234",
          },
        ],
        iceTransportPolicy: "relay",
      });

      peerConnectionRef.current = peerConnection;

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          stompClientRef.current.send(
            `/app/signal/${roomUuid}`,
            {},
            JSON.stringify({ sender: peerId, type: "candidate", candidate: event.candidate })
          );
        }
      };

      peerConnection.ontrack = (event) => {
        if (
          remoteVideoRef.current &&
          remoteVideoRef.current.srcObject !== event.streams[0]
        ) {
          remoteVideoRef.current.srcObject = event.streams[0];
          receivedStreamRef.current = true;
        }
      };

      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStream.getTracks().forEach((track) =>
        peerConnection.addTrack(track, localStream)
      );

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      stompClientRef.current.send(
        `/app/signal/${roomUuid}`,
        {},
        JSON.stringify({ sender: peerId, type: "offer", offer })
      );
    } catch (error) {
      console.error("Error starting video call:", error);
    }
  };

  const disconnectCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
      stompClientRef.current = null;
    }

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }

    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
  };

  const toggleMute = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev); // Toggle mute state
    }
  };

  useEffect(() => {
    if (!stompClientRef.current) {
      
    }

    return () => {
      disconnectCall();
    };
    // eslint-disable-next-line
  }, [roomUuid]);

  return (
    <div
      className="
        relative
        w-full h-full
        rounded-md border border-gray-700
        overflow-hidden
        bg-gradient-to-b from-[#232529] to-[#2E2F33]
        font-sans
        flex flex-col
      "
    >
      {/* Remote video: dynamically fills the parent container */}
      <div
        className="
          relative
          flex-1
          w-full
          aspect-video
          bg-black
        "
      >
        <video
          ref={remoteVideoRef}
          className="
            absolute inset-0
            w-full h-full
            object-contain
          "
          autoPlay
          playsInline
        />
      </div>
  
      {/* Local video pinned top-right, dynamically sized */}
      <div
        className="
          absolute
          top-4 right-4
          w-[30%] max-w-[320px] min-w-[120px]
          aspect-video
          bg-[#3A3C40]
          rounded shadow-lg
          border border-gray-600
        "
      >
        <video
          ref={localVideoRef}
          className="w-full h-full object-contain rounded"
          autoPlay
          playsInline
          muted
        />
      </div>
  
      {/* Controls: Stays at the bottom */}
      <div className="relative z-10 flex justify-center space-x-4 mt-auto py-4">
        <button
          onClick={toggleMute}
          className={`w-12 h-12 ${
            isMuted ? "bg-gray-500" : "bg-gray-400"
          } hover:bg-gray-500 text-white rounded-full flex items-center justify-center shadow-lg transition`}
        >
          {isMuted ? <FaMicrophoneSlash size={16} /> : <FaMicrophone size={16} />}
        </button>
      </div>
    </div>
  );
});

export default VideoChat;
