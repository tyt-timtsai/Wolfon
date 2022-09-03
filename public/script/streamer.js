const { io, ace, axios } = window;
const localVideo = document.querySelector('video#localVideo');
const startBtn = document.getElementById('startBtn');
const screenshotButton = document.querySelector('#screenshot-button');
const img = document.querySelector('#screenshot-img');
const canvas = document.querySelector('canvas');

const field = document.getElementById('editor');
const language = document.getElementById('language');
const search = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const runBtn = document.getElementById('run-btn');
const terminal = document.getElementById('terminal');

const tag = document.getElementById('tag');
const tagBtn = document.getElementById('tagBtn');
const version = document.getElementById('version');

const viewers = document.getElementById('viewers');

let localStream;
const PCs = {};
// let socket;
const socket = io('ws://localhost:3000');
const room = 'room1';

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
 * 連線 socket.io
 * */
function connectIO() {
  // socket
  // socket = io('ws://localhost:3000');
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
axios.get(`/api/v1/code/${room}`)
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

// Add Tag
tagBtn.addEventListener('click', () => {
  const code = editor.getValue();
  if (tag.value && code) {
    axios.post(`/api/v1/code/${room}`, {
      tag: tag.value,
      code: JSON.stringify(code),
    })
      .then((res) => {
        socket.emit('addTag', tag.value);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    alert('Please add tag name and code.');
  }
});

// function getViewerCode() {
//   console.log('get');
//   socket.to().emit('message', 'for your eyes only');
// }

socket.on('viewer', (id) => {
  console.log(id);
  const viewerBtn = document.createElement('button');
  viewerBtn.innerText = id;
  viewerBtn.value = id;
  viewerBtn.onclick = function getViewerCode() {
    console.log(id);
    socket.emit('getCode', id, socket.id);
  };
  viewers.appendChild(viewerBtn);
});

socket.on('passCode', (code) => {
  console.log('getlassasasasa');
  console.log(code);
  editor.setValue(code);
});

socket.on('addTag', (versionTag) => {
  const option = document.createElement('option');
  option.value = versionTag;
  option.innerText = versionTag;
  version.appendChild(option);
});

// Use Tag
version.addEventListener('change', () => {
  const versionTag = version.value;
  console.log(tag);
  // code 在 string 還保有 \n
  axios.get(`/api/v1/code/${room}?tag=${versionTag}`)
    .then((res) => {
      console.log(res);
      editor.setValue(JSON.parse(res.data.code));
    })
    .catch((err) => console.log(err));
});
