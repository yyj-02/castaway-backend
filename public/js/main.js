// HTML elements
const webcamButton = document.getElementById("webcamButton");
const webcamVideo = document.getElementById("webcamVideo");
const callButton = document.getElementById("callButton");
const callInput = document.getElementById("callInput");
const answerButton = document.getElementById("answerButton");
const remoteVideo = document.getElementById("remoteVideo");
const hangupButton = document.getElementById("hangupButton");

const servers = {
  iceServers: [
    {
      urls: [
        "stun.l.google.com:19302",
        "stun1.l.google.com:19302",
        "stun2.l.google.com:19302",
        "stun3.l.google.com:19302",
        "stun4.l.google.com:19302",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

let pc = new RTCPeerConnection(servers);

let localStream = null;
let remoteStream = null; // from others

// set up media sources
webcamButton.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  remoteStream = new MediaStream();

  // push to connection
  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  // retrieve from connection
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  webcamVideo.srcObj = localStream;
  remoteVideo.srcObj = localStream;
};

// // Create an offer
// callButton.onclick = async () => {
//   // create firestore call doc
//   // get collection call/offercandidates
//   // get collection call/answercandidates

//   pc.onicecandidate = event => {
//     event.candidate && // send event candidates in json to offercandidates firestore
//   }

//   // get id from firestore
//   const offerDescription = await pc.createOffer();
//   await pc.setLocalDescription(offerDescription);
//   console.log(offerDescription);
//   // to be written in firestore
//   console.log({ sdp: offerDescription.sdp, type: offerDescription.type });
// };

