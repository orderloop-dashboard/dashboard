import React from "react";
import ListModule from "./ListModule";
import OrderModule from "./OrderModule";
import SendModule from "./SendModule";

function App() {
  const handleSendFile = () => {
    window.electron.sendDatabaseFile();
  };

  return (
    <div className="App">
      <button onClick={handleSendFile}>Send Database File</button>

      <ListModule />

      <OrderModule />

      <SendModule />
    </div>
  );
}

export default App;
