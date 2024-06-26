const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("electron", {
  dbQuery: async (query, params) => {
    return ipcRenderer.invoke("db-query", query, params);
  },
  sendDatabaseFile: () => {
    ipcRenderer.send("send-database-file");
  },
});
