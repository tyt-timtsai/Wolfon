import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import Editor from '../components/code_editor/editor';
import Streamer from '../components/stream_video/streamer';
import constants from '../global/constants';

function LiveStreamer({ socket }) {
  const room = 'room1';
  const [mode, setMode] = useState('javascript');
  const [version, setVersion] = useState([]);
  const [code, setCode] = useState("//Javascript\nconsole.log('Hello Javascript!');");
  const [tag, setTag] = useState('');
  const [viewers, setViewers] = useState([]);
  const editor = useRef();

  const editTag = (e) => {
    setTag(e.target.value);
  };

  const addTag = () => {
    const content = editor.current.editor.getValue();
    if (tag && content) {
      axios.post(`${constants.SERVER_URL}/api/v1/code/${room}`, {
        language: mode,
        tag,
        code: content,
      })
        .then((res) => {
          socket.emit('addTag', tag);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // Get viewer's code
  const getViewerCode = (e) => {
    console.log(e.target.value);
    socket.emit('getCode', e.target.value, socket.id);
  };

  useEffect(() => {
    socket.on('viewer', (id) => {
      console.log(id);
      setViewers((prev) => [...prev, id]);
    });

    socket.on('passCode', (viewerCode) => {
      console.log(viewerCode);
      setCode(viewerCode);
    });
  }, [socket]);

  useEffect(() => {
    console.log('start');
  }, []);
  return (
    <div>
      <Header />
      <header className="App-header">
        Live Streaming
      </header>
      <main>
        <button type="button" id="screenshot-button"> 直播畫面截圖 </button>
        <Streamer
          socket={socket}
          room={room}
        />
        <div id="viewers">
          {viewers.map((viewer) => (<button type="button" value={viewer} onClick={getViewerCode}>{viewers.indexOf(viewer)}</button>))}
        </div>
        <label htmlFor="tag" aria-controls="tag">
          Tag :
          <input type="text" name="tag" id="tag" value={tag} onChange={editTag} />
        </label>
        <button type="button" className="editor-btn" id="tagBtn" onClick={addTag}>Add tag</button>
        <Editor
          socket={socket}
          room={room}
          mode={mode}
          setMode={setMode}
          version={version}
          setVersion={setVersion}
          code={code}
          setCode={setCode}
          editor={editor}
        />
      </main>
      <img id="screenshot-img" src="" alt="screenshot" />
      <Footer />
    </div>
  );
}

export default LiveStreamer;
