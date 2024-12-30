import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { useParams } from "react-router-dom";

const VideoChat = forwardRef((props, ref) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const stompClientRef = useRef(null);
  const iceCandidateQueue = useRef([]);
  const receivedStreamRef = useRef(false); // Track if a remote stream has already been set
  const peerId = Math.random().toString(36).substring(7); // Unique peer ID
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
                urls: "turn:109.199.113.183:3478", // Replace with your TURN server URL
                username: "root", // Replace with your TURN server username
                credential: "Priview1234", // Replace with your TURN server password
              },
            ],
            iceTransportPolicy: "relay", // Force TURN-only connections
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
          receivedStreamRef.current = true; // Mark stream as received
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
    }
  };

  useEffect(() => {
    if (!stompClientRef.current) {
      connectToWebRTC();
    }

    return () => {
      disconnectCall();
    };
  }, [roomUuid]);

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">WebRTC Video Call</h1>
      <video
        className="w-1/2 rounded-lg shadow-lg border"
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
      />
      <video
        className="w-1/2 rounded-lg shadow-lg border"
        ref={remoteVideoRef}
        autoPlay
        playsInline
      />
      <div className="flex space-x-4">
        <button
          onClick={startCall}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Start Call
        </button>
        <button
          onClick={disconnectCall}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
        >
          Disconnect
        </button>
        <button
          onClick={toggleMute}
          className="px-6 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition"
        >
          Mute/Unmute
        </button>
      </div>
    </div>
  );
});

export default VideoChat;
