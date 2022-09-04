import React, {
  // useState,
  useEffect, useRef,
} from 'react';
// import axios from 'axios';

// let socket;
function Streamer({ socket, room }) {
  let localStream;
  const PCs = {};
  const localVideo = useRef();

  // ===================== 連線相關 =====================

  /**
 * 取得本地串流
 */
  async function createStream() {
    const constraints = {
      audio: false,
      video: true,
    };
    // const stream = await navigator.mediaDevices.getUserMedia(constraints)
    const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
    localStream = stream;
    localVideo.current.srcObject = stream;
  }

  /**
     * 初始化Peer連結
     */
  function initPeerConnection() {
    const configuration = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    };
    const peerConn = new RTCPeerConnection(configuration);

    // 增加本地串流
    localStream.getTracks().forEach((track) => {
      peerConn.addTrack(track, localStream);
    });

    // 找尋到 ICE 候選位置後，送去 Server 與另一位配對
    peerConn.onicecandidate = (e) => {
      if (e.candidate) {
        console.log('發送 ICE');
        // 發送 ICE
        socket.emit('ice_candidate', room, {
          label: e.candidate.sdpMLineIndex,
          id: e.candidate.sdpMid,
          candidate: e.candidate.candidate,
        });
      }
    };

    // 監聽 ICE 連接狀態
    peerConn.oniceconnectionstatechange = (e) => {
      if (e.target.iceConnectionState === 'disconnected') {
        console.log('remote disconnected');
      }
    };

    return peerConn;
  }

  /**
 * 處理信令
 * @param {Boolean} isOffer 是 offer 還是 answer
 */
  async function sendSDP(isOffer, pc) {
    if (!pc) {
      initPeerConnection();
    }

    // 創建SDP信令
    const localSDP = await pc[isOffer ? 'createOffer' : 'createAnswer']({
      offerToReceiveAudio: true, // 是否傳送聲音流給對方
      offerToReceiveVideo: true, // 是否傳送影像流給對方
    });

    // 設定本地SDP信令
    await pc.setLocalDescription(localSDP);

    // 寄出SDP信令
    const event = isOffer ? 'offer' : 'answer';
    socket.emit(event, room, pc.localDescription);
  }

  /**
   * 連線 socket.io
   */
  function connectIO() {
    socket.emit('join', room);

    socket.on('ice_candidate', async (data, id) => {
      console.log('收到 ice_candidate');
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: data.label,
        candidate: data.candidate,
      });
      console.log(id);
      console.log(candidate);
      await PCs[id].addIceCandidate(candidate);
    });

    socket.on('offer', async (desc, id) => {
      console.log('收到 offer');
      const pc = initPeerConnection();
      PCs[id] = pc;
      // 設定對方的配置
      await pc.setRemoteDescription(desc);

      // 發送 answer
      await sendSDP(false, pc);
    });

    socket.on('bye', async (id) => {
      console.log(id, '中斷連線');
      delete PCs[id];
    });
  }

  /**
 * 初始化
 */
  async function init() {
    await createStream();
    connectIO();
  }
  useEffect(() => {
    console.log('socket');
    // socket = io('ws://localhost:3000');
    // socket = io('wss://timtsai.website');
  }, [socket]);

  return (
    <section className="video-container">
      <button type="button" onClick={init}>開始直播</button>
      <video
        ref={localVideo}
        width="480px"
        height="auto"
        style={{
          backgroundColor: 'black',
        }}
        id="localVideo"
        muted
        autoPlay
        playsInline
        controls
      >
        Your browser does not support the video tag.
      </video>
    </section>
  );
}

export default Streamer;
