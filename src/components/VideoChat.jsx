import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FaPhone, FaPhoneSlash, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";
import { connectToWebRTC, startCall, disconnectCall, toggleMute } from "../modules/VideoChat";

const VideoChat = forwardRef((props, ref) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const stompClientRef = useRef(null);
  const iceCandidateQueue = useRef([]);
  const receivedStreamRef = useRef(false);
  const peerId = Math.random().toString(36).substring(7);
  const params = useParams();
  const roomUuid = params.id;

  //Send functions to parent object
  useImperativeHandle(ref, () => ({
    connect: () =>
      connectToWebRTC(
        stompClientRef,
        roomUuid,
        peerConnectionRef,
        iceCandidateQueue,
        peerId,
        roomUuid
      ),
    startCall: () =>
      startCall(
        peerConnectionRef,
        stompClientRef,
        receivedStreamRef,
        peerId,
        localVideoRef,
        roomUuid,
        remoteVideoRef
      ),
    disconnect: () =>
      disconnectCall(peerConnectionRef, stompClientRef, localVideoRef, remoteVideoRef, setIsMuted),
  }));

  //Mute video
  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = localVideoRef.current.srcObject
        .getTracks()
        .find((track) => track.kind === "video");
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  return (
    <div
      className="relative w-full h-full rounded-md border border-gray-700 overflow-hidden
                bg-gradient-to-b from-[#232529] to-[#2E2F33] font-sans flex flex-col"
    >
      <div
        className="relative flex-1 w-full aspect-video bg-black"
      >
        <video
          ref={remoteVideoRef}
          className="absolute inset-0 w-full h-full object-contain"
          autoPlay
          playsInline
        />
      </div>
      <div
        className="absolute top-4 right-4 w-[30%] max-w-[320px] min-w-[120px] aspect-video
          bg-[#3A3C40] rounded shadow-lg border border-gray-600"
      >
        <video
          ref={localVideoRef}
          className="w-full h-full object-contain rounded"
          autoPlay
          playsInline
          muted
        />
      </div>

      {/* Controls */}
      <div className="relative z-10 flex justify-center space-x-4 mt-auto py-4">
        <button
          onClick={() => toggleMute(localVideoRef, setIsMuted)}
          className={`w-12 h-12 ${
            isMuted ? "bg-gray-500" : "bg-gray-400"
          } hover:bg-gray-500 text-white rounded-full flex items-center justify-center shadow-lg transition`}
        >
          {isMuted ? <FaMicrophoneSlash size={16} /> : <FaMicrophone size={16} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`w-12 h-12 ${
            isVideoOff ? "bg-gray-500" : "bg-gray-400"
          } hover:bg-gray-500 text-white rounded-full flex items-center justify-center shadow-lg transition`}
        >
          {isVideoOff ? <FaVideoSlash size={16} /> : <FaVideo size={16} />}
        </button>
      </div>
    </div>
  );
});

export default VideoChat;
