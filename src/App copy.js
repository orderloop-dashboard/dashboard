import React, {useState, useEffect} from "react";

export default function App() {
  const [dynamicWS, setDynamicWS] = useState(null);

  useEffect(() => {
    window.electron.ipcRenderer.on("dynamic-ws", (event, url) => {
      console.log("url ==>", url);
      setDynamicWS(url);
    });
  }, []);

  const handleClick = () => {
    if (!dynamicWS) {
      console.error("WebSocket URL is not set");
      return;
    }

    const ws = new WebSocket(dynamicWS);

    ws.onopen = function () {
      console.log("Connected to WebSocket server");

      const dummyData = [{name: "teirj"}, {name: "seonf3"}, {name: "Thirds3"}];
      ws.send(JSON.stringify(dummyData));
    };

    ws.onerror = function (error) {
      console.error("WebSocket error: ", error);
    };
  };

  return (
    <div>
      <button onClick={handleClick}>Send data</button>
    </div>
  );
}
