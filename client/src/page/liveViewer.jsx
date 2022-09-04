import React, { useState, useRef } from 'react';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import Editor from '../components/code_editor/editor';
import Video from '../components/stream_video/video';

function LiveViewer({ socket }) {
  const room = 'room1';
  const editor = useRef();
  const [mode, setMode] = useState('javascript');
  const [version, setVersion] = useState([]);
  const [code, setCode] = useState("//Javascript\nconsole.log('Hello Javascript!');");
  return (
    <div>
      <Header />
      <header className="App-header">
        Live Streaming
      </header>
      <main>
        <Video
          socket={socket}
          room={room}
        />
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
      <Footer />
    </div>
  );
}

export default LiveViewer;
