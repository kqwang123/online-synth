const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

function createWindow() {
  // Create a browser window
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // enable Node.js integration
      contextIsolation: false
    }
  });

  // Load the Angular app (dist output)
  win.loadFile(path.join(__dirname, '../dist/online-synth/index.html'));

  // Open dev tools if needed
  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
