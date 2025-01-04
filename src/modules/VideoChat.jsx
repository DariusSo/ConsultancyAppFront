import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";

export const connectToWebRTC = (stompClientRef, roomUuid, peerConnectionRef, iceCandidateQueue, peerId) => {
    if (stompClientRef.current) return;

    const socket = new SockJS("http://localhost:8080/websocket");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/signal/${roomUuid}`, (message) => {
        handleSignalMessage(JSON.parse(message.body), peerConnectionRef, iceCandidateQueue, peerId, stompClientRef, roomUuid);
      });
      stompClientRef.current = stompClient;
    });
  };

export const handleSignalMessage = async (message, peerConnectionRef, iceCandidateQueue, peerId, stompClientRef, roomUuid) => {
    if (message.sender === peerId) return;

    const peerConnection = peerConnectionRef.current;

    try {
      if (message.type === "offer") {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(message.offer)
        );

        processIceCandidateQueue(peerConnectionRef, iceCandidateQueue);

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

        processIceCandidateQueue(peerConnectionRef, iceCandidateQueue);
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

export const processIceCandidateQueue = async (peerConnectionRef, iceCandidateQueue) => {
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

export const startCall = async (peerConnectionRef, stompClientRef, receivedStreamRef, peerId, localVideoRef, roomUuid, remoteVideoRef) => {
    if (peerConnectionRef.current) return;

    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          {
            urls: "turn:109.199.113.183:3478",
            username: "root",
            credential: "",
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

export const disconnectCall = (peerConnectionRef, stompClientRef, localVideoRef, remoteVideoRef) => {
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

export const toggleMute = (localVideoRef, setIsMuted) => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev); // Toggle mute state
    }
  };
export default connectToWebRTC;