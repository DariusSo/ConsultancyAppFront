import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { apiURL } from "./globals";

//Function to subscribe to signaling server
export const connectToWebRTC = (stompClientRef, roomUuid, peerConnectionRef, iceCandidateQueue, peerId) => {
  if (stompClientRef.current) return;

    const socketFactory = () => new SockJS(apiURL + "websocket");
    const stompClient = Stomp.over(socketFactory);

  stompClient.connect({}, () => {
    stompClient.subscribe(`/topic/signal/${roomUuid}`, (message) => {
      handleSignalMessage(JSON.parse(message.body), peerConnectionRef, iceCandidateQueue, peerId, stompClientRef, roomUuid);
    });
    stompClientRef.current = stompClient;
  });
};

//Logic for exchanging offers/answers/candidates
export const handleSignalMessage = async (message, peerConnectionRef, iceCandidateQueue, peerId, stompClientRef, roomUuid) => {

  //Ignore your own messages
  if (message.sender === peerId) return;

  const peerConnection = peerConnectionRef.current;

  try {
    if (message.type === "offer") {

      //Register offer to connect
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(message.offer)
      );

      processIceCandidateQueue(peerConnectionRef, iceCandidateQueue);
      
      //Create answer
      const answer = await peerConnection.createAnswer();

      //Register your answer
      await peerConnection.setLocalDescription(answer);
      
      //Send answer
      stompClientRef.current.send(
        `/app/signal/${roomUuid}`,
        {},
        JSON.stringify({ sender: peerId, type: "answer", answer })
      );
    } else if (message.type === "answer") {

      //Register answer from other user
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(message.answer)
      );

      processIceCandidateQueue(peerConnectionRef, iceCandidateQueue);

    } else if (message.type === "candidate") {
      if (!peerConnection.remoteDescription) {
        //If remote description is not set for some reason, add candidate to queue
        iceCandidateQueue.current.push(message.candidate);
      } else {

        //Add new ICE candidate
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
  //If there are available ICE candidates, add them to peer connection
  while (iceCandidateQueue.current.length > 0) {
    const candidate = iceCandidateQueue.current.shift();
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Error adding queued ICE candidate:", error);
    }
  }
};

//Video call logic
export const startCall = async (peerConnectionRef, stompClientRef, receivedStreamRef, peerId, localVideoRef, roomUuid, remoteVideoRef) => {
  if (peerConnectionRef.current) return;

  try {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "turns:api.advisorflow.dariussongaila.dev:5349",
          username: "consultation",
          credential: "BatBatBat3.",
        },
      ],
      iceTransportPolicy: "relay",
    });

    peerConnectionRef.current = peerConnection;

    //This is triggered when ICE candidate is recieved, then send his own
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        stompClientRef.current.send(
          `/app/signal/${roomUuid}`,
          {},
          JSON.stringify({ sender: peerId, type: "candidate", candidate: event.candidate })
        );
      }
    };

    //This is triggered when media stream is recieved and updates src
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

    //Send an offer
    stompClientRef.current.send(
      `/app/signal/${roomUuid}`,
      {},
      JSON.stringify({ sender: peerId, type: "offer", offer })
    );
  } catch (error) {
    console.error("Error starting video call:", error);
  }
};

//Close all connections
export const disconnectCall = (peerConnectionRef, stompClientRef, localVideoRef, remoteVideoRef, setIsMuted) => {
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
  setIsMuted(false);
};

//Mute video
export const toggleMute = (localVideoRef, setIsMuted) => {
  if (localVideoRef.current && localVideoRef.current.srcObject) {
    localVideoRef.current.srcObject.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMuted((prev) => !prev);
  }
};
export default connectToWebRTC;