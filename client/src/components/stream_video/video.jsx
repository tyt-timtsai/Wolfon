import React, {
  // useState,
  useEffect, useRef,
} from 'react';

// let socket;
function Video({ socket, room }) {
  let peerConn;
  const localVideo = useRef();

  // ===================== 連線相關 =====================
  /**
 * 連線 socket.io
 */
  function connectIO() {
    socket.emit('join', room);

    socket.on('answer', async (desc) => {
      console.log('收到 answer');
      // 設定對方的配置
      await peerConn.setRemoteDescription(desc);
    });

    socket.on('ice_candidate', async (data) => {
      console.log('收到 ice_candidate');
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: data.label,
        candidate: data.candidate,
      });
      await peerConn.addIceCandidate(candidate);
    });
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
    peerConn = new RTCPeerConnection(configuration);

    peerConn.addTransceiver('video', { direction: 'recvonly' });
    peerConn.addTransceiver('audio', { direction: 'recvonly' });

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
        localVideo.current.srcObject = null;
      }
    };

    // 監聽是否有流傳入，如果有的話就顯示影像
    peerConn.ontrack = (data) => {
      // 接收流並顯示遠端視訊
      localVideo.current.srcObject = data.streams[0];
    };

    // 舊版，有些瀏覽器還沒換用新版的，要用這個
    // peerConn.onaddstream = (data) => {
    //   console.log('get');
    //   console.log(data.stream);
    //   localVideo.current.srcObject = data.stream;
    // };
  }

  /**
 * 處理信令
 * @param {Boolean} isOffer 是 offer 還是 answer
 */
  async function sendSDP(isOffer) {
    if (!peerConn) {
      initPeerConnection();
    }
    // 創建SDP信令
    const localSDP = await peerConn.createOffer();

    // 設定本地SDP信令
    await peerConn.setLocalDescription(localSDP);

    // 寄出SDP信令
    const event = isOffer ? 'offer' : 'answer';
    socket.emit(event, room, peerConn.localDescription);
  }

  /**
 * 初始化
 */
  async function init() {
    initPeerConnection();
    connectIO();
    sendSDP(true);
  }

  useEffect(() => {
    console.log('start');
    // socket = io('ws://localhost:3000');
    // socket = io('wss://timtsai.website');
  }, [socket]);

  return (
    <section className="video-container">
      <button type="button" onClick={init}>連接直播</button>
      <video
        ref={localVideo}
        width="1080px"
        height="720px"
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

export default Video;
