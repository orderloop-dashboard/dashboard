import React, {useState} from "react";

function App() {
  const [socketUrl, setSocketUrl] = useState("");

  window.bridge.wsUrl((event, settings) => {
    console.log(settings);
    setSocketUrl(settings);
  });

  const handleClick = () => {
    console.log("socketUrl ==>", socketUrl);

    console.log("window ==>", window);

    const ws = new WebSocket(socketUrl);

    ws.onopen = function () {
      console.log("Connected to WebSocket server");

      const dummyData = [{name: "o90ij"}, {name: "Dummy2"}, {name: "Dummy3"}];

      ws.send(JSON.stringify(dummyData));
    };

    ws.onerror = function (error) {
      console.error("WebSocket error: ", error);
    };
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>WebSocket URL: {socketUrl}</p>
      </header>

      <div>
        <button onClick={handleClick}>Send data</button>
      </div>
    </div>
  );
}

export default App;
