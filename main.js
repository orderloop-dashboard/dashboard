const {app, BrowserWindow, ipcMain} = require("electron");
const path = require("path");
const fs = require("fs");
const WebSocket = require("ws");
const bonjour = require("bonjour")();
const db = require("./initializeDB");

let mainWindow;
let ws;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  mainWindow.loadURL("http://localhost:3000");

  mainWindow.webContents.openDevTools();

  console.log("bonjour ==>", bonjour);

  bonjour.find({type: "ws"}, function (service) {
    if (service) {
      console.log("service ==>", service);

      const wsUrl = `ws://${service.referer.address}:${service.port}`;

      mainWindow.webContents.send("wsUrl", wsUrl);

      ws = new WebSocket(wsUrl);

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

  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  ipcMain.handle("db-query", async (event, query, params) => {
    return new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });

  ipcMain.on("send-database-file", () => {
    const dbPath = path.join(__dirname, "mydatabase.db");

    fs.readFile(dbPath, (err, data) => {
      if (err) {
        console.error("Error reading database file:", err);
      } else {
        const timestamp = new Date().toISOString(); // Get current timestamp
        const message = {timestamp, data}; // Combine timestamp and file data

        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message)); // Send data as JSON string
          console.log("JSON.stringify(message) ==>", JSON.stringify(message));
          console.log("Database file and timestamp sent:", timestamp);
        } else {
          console.log("WebSocket is not connected");
        }
      }
    });
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("quit", function () {
  console.log("App is quitting, cleaning up Bonjour...");
  bonjour.destroy();
});
