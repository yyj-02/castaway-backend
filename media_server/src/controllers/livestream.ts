import { Request, Response } from "express";
const webrtc = require("wrtc");

let senderStream: any;

function handleTrackEvent(e: { streams: any[] }, peer: any) {
  senderStream = e.streams[0];
  console.log(senderStream);
}

const consume = async (req: Request, res: Response) => {
  const {
    body: { sdp },
  } = req;
  const peer = new webrtc.RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org",
      },
    ],
  });
  const desc = new webrtc.RTCSessionDescription(sdp);
  await peer.setRemoteDescription(desc);
  console.log(senderStream);
  senderStream
    .getTracks()
    .forEach((track: any) => peer.addTrack(track, senderStream));
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  const payload = {
    sdp: peer.localDescription,
  };

  res.json(payload);
};

const broadcast = async (req: Request, res: Response) => {
  const {
    body: { sdp },
  } = req;
  const peer = new webrtc.RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org",
      },
    ],
  });
  peer.ontrack = (e: any) => handleTrackEvent(e, peer);
  console.log({ sdp });
  const desc = new webrtc.RTCSessionDescription(sdp);
  console.log({ desc });
  await peer.setRemoteDescription(desc);
  const answer = await peer.createAnswer();
  console.log({ answer });
  await peer.setLocalDescription(answer);
  const payload = {
    sdp: peer.localDescription,
  };

  res.json(payload);
};

export default { consume, broadcast };
