export function createPeerConnection() {
  const config = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
      },
    ],
  };

  const peerConnection = new RTCPeerConnection(config);

  return peerConnection;
}

export async function createOffer(peerConnection) {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  return offer;
}

export async function createAnswer(peerConnection, offer) {
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  return answer;
}

export async function addIceCandidate(peerConnection, candidate) {
  if (candidate) {
    await peerConnection.addIceCandidate(candidate);
  }
}
