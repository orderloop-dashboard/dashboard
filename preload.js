const contextBridge = require("electron").contextBridge;
const ipcRenderer = require("electron").ipcRenderer;

contextBridge.exposeInMainWorld("bridge", {
  wsUrl: (message) => {
    ipcRenderer.on("wsUrl", message);
  },
});
