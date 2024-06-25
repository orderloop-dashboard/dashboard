const {app, BrowserWindow, ipcMain} = require("electron");
const path = require("path");
const WebSocket = require("ws");
const bonjour = require("bonjour")();

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL("http://localhost:3001/");

  mainWindow.webContents.openDevTools();

  try {
    bonjour.find({type: "ws"}, function (service) {
      if (service) {
        console.log("service ==>", service);

        const wsUrl = `ws://${service.referer.address}:${service.port}`;

        mainWindow.webContents.send("wsUrl", wsUrl);

        const ws = new WebSocket(wsUrl);

        ws.on("open", function open() {
          console.log("Connected to WebSocket server");
        });

        ws.on("message", function incoming(data) {
          console.log("Received:", data);
        });

        ws.on("close", function close() {
          console.log("WebSocket connection closed");
        });

        ws.on("error", function error(err) {
          console.error("WebSocket error:", err);
        });
      } else {
        console.log("No WebSocket service found");
      }
    });
  } catch (error) {
    console.log("error on bonjour : ", error);
  }

  // Clean up Bonjour and WebSocket instances on window close
  mainWindow.on("closed", function () {
    console.log("Main window closed, cleaning up Bonjour and WebSocket...");
    bonjour.destroy();
    console.log("bonjour destroyed successfully");
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("quit", function () {
  console.log("App is quitting, cleaning up Bonjour...");
  bonjour.destroy();
});
