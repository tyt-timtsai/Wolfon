const { io } = window;
const remoteVideo = document.querySelector('video#remoteVideo');
const startBtn = document.getElementById('startBtn');

let peerConn;
let socket;

const room = 'room1';

// ===================== 連線相關 =====================
/**
 * 連線 socket.io
 */
function connectIO() {
  // socket
  // socket = io('ws://localhost:3000');
  socket = io('wss://timtsai.website');

  socket.on('ice_candidate', async (data) => {
    console.log('收到 ice_candidate');
    const candidate = new RTCIceCandidate({
      sdpMLineIndex: data.label,
      candidate: data.candidate,
    });
    await peerConn.addIceCandidate(candidate);
  });

  socket.on('answer', async (desc) => {
    console.log('收到 answer');

    // 設定對方的配置
    await peerConn.setRemoteDescription(desc);
  });

  socket.emit('join', room);
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
      remoteVideo.srcObject = null;
    }
  };

  // // 監聽是否有流傳入，如果有的話就顯示影像
  peerConn.onaddstream = ({ stream }) => {
    // 接收流並顯示遠端視訊
    remoteVideo.srcObject = stream;
  };
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
  const e = isOffer ? 'offer' : 'answer';
  socket.emit(e, room, peerConn.localDescription);
}

/**
 * 初始化
 */
async function init() {
  initPeerConnection();
  connectIO();
  sendSDP(true);
}

// ===================== 監聽事件 =====================
/**
 * 監聽按鈕點擊
 */
startBtn.onclick = init;
