const { io } = window;
const localVideo = document.querySelector('video#localVideo');
const startBtn = document.getElementById('startBtn');
const screenshotButton = document.querySelector('#screenshot-button');
const img = document.querySelector('#screenshot-img');
const canvas = document.querySelector('canvas');

let localStream;
const PCs = {};
let socket;

const room = 'room1';

// ===================== 連線相關 =====================
/**
 * 連線 socket.io
 * */
function connectIO() {
  // socket
  socket = io('ws://localhost:3000');
  // socket = io('wss://timtsai.website');

  socket.on('ice_candidate', async (data, id) => {
    console.log('收到 ice_candidate');
    const candidate = new RTCIceCandidate({
      sdpMLineIndex: data.label,
      candidate: data.candidate,
    });
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

  socket.emit('join', room);
}

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

  localVideo.srcObject = stream;
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
  const e = isOffer ? 'offer' : 'answer';
  socket.emit(e, room, pc.localDescription);
}

/**
 * 初始化
 */
async function init() {
  await createStream();
  connectIO();
}

// ===================== 截圖功能 ====================
function screenShot() {
  canvas.width = localVideo.videoWidth;
  canvas.height = localVideo.videoHeight;
  const height = (localVideo.width / localVideo.videoWidth) * localVideo.videoHeight;
  // 渲染
  canvas.getContext('2d').drawImage(localVideo, 0, 0, localVideo.width, height);
  img.src = canvas.toDataURL('image/png');
}

// ===================== 監聽事件 =====================
/**
 * 監聽按鈕點擊
 */
startBtn.onclick = init;
screenshotButton.onclick = screenShot;
