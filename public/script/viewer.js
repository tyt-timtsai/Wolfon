const { io, ace, axios } = window;
const remoteVideo = document.querySelector('video#remoteVideo');
const startBtn = document.getElementById('startBtn');

const field = document.getElementById('editor');
const language = document.getElementById('language');
const search = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const runBtn = document.getElementById('run-btn');
const terminal = document.getElementById('terminal');

const tag = document.getElementById('tag');
const version = document.getElementById('version');

let peerConn;
let socket;

const room = 'room1';

// ===================== 連線相關 =====================
/**
 * 連線 socket.io
 */
function connectIO() {
  // socket
  socket = io('ws://localhost:3000');
  // socket = io('wss://timtsai.website');

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

// ============== ace 編輯器 ===============
const editor = ace.edit(field);
editor.setOptions({
  autoScrollEditorIntoView: true,
  copyWithEmptySelection: true,
});
editor.setTheme('ace/theme/twilight');
editor.session.setMode(`ace/mode/${language.value}`);
language.addEventListener('change', () => {
  console.log(editor.getValue());
  editor.session.setMode(`ace/mode/${language.value}`);
  switch (language.value) {
    case 'javascript':
      editor.session.setValue(`// ${language.value}\nconsole.log('Hello Javascript!')`);
      break;
    case 'python':
      editor.session.setValue(`# ${language.value}\nprint('Hello Python!')`);
      break;
    case 'golang':
      editor.session.setValue(`// ${language.value}\npackage main\nimport "fmt"\n\nfunc main(){\n    fmt.Println("Hello Golang!") \n}`);
      break;

    default:
      editor.session.setValue(`// ${language.value}`);
      break;
  }
});

// ============== 程式編譯 ==============
// 測試用直播地址
const address = 'a001';

axios.get(`/api/v1/code/${address}`)
  .then((res) => {
    console.log(res);
    res.data.forEach((data) => {
      const option = document.createElement('option');
      option.value = data.tag;
      option.innerText = data.tag;
      version.appendChild(option);
    });
  })
  .catch(((err) => console.log(err)));

// =============== 監聽事件 ================
searchBtn.addEventListener('click', () => {
  editor.find(search.value);
});

runBtn.addEventListener('click', () => {
  const data = {
    language: language.value,
    code: editor.getValue(),
  };
  console.log(data);
  axios.post('/api/v1/code', data)
    .then((res) => {
      console.log(res.data);
      terminal.innerHTML = res.data;
    })
    .catch((err) => console.log(err));
});

// Use Tag
version.addEventListener('change', () => {
  const versionTag = version.value;
  console.log(tag);
  // code 在 string 還保有 \n
  axios.get(`/api/v1/code/${address}?tag=${versionTag}`)
    .then((res) => {
      console.log(res);
      editor.setValue(JSON.parse(res.data.code));
    })
    .catch((err) => console.log(err));
});
