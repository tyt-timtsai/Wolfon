import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import LiveViewer from './page/liveViewer';
import LiveStreamer from './page/liveStreamer';
import constants from './global/constants';

function App() {
  const socket = io(constants.SOCKET_URL);

  return (
    <Routes>
      <Route
        element={(
          <div className="App">
            <LiveViewer
              socket={socket}
            />
          </div>
        )}
        path="/live/viewer"
      />
      <Route
        element={(
          <div className="App">
            <LiveStreamer
              socket={socket}
            />
          </div>
        )}
        path="/live/streamer"
      />
    </Routes>
  );
}

export default App;
