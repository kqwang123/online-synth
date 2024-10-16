const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const { spawn } = require('child_process');
const juceAppPath = path.join(__dirname, '../synth_lib/Builds/VisualStudio2019/x64/Release/ConsoleApp/synth_lib.exe');
const juceApp = spawn(juceAppPath);

juceApp.stdout.on('data', (data) => {
    console.log(`JUCE Output: ${data}`);
});

juceApp.stderr.on('data', (data) => {
    console.error(`JUCE Error: ${data}`);
});

juceApp.on('close', (code) => {
    console.log(`JUCE app exited with code ${code}`);
});

function createWindow() {
  win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
          nodeIntegration: false, // Disable Node.js integration for security
          contextIsolation: true, // Enable context isolation
          preload: path.join(__dirname, 'preload.js'),
      }
  });
  
  win.loadFile(path.join(__dirname, '../dist/online-synth/browser/index.html'));

  win.on('closed', () => {
      win = null;
  });
}

function playSineWave() {
  juceApp.stdin.write('play\n'); // Send command to JUCE app
}

function stopSineWave() {
  juceApp.stdin.write('stop\n'); // Send command to JUCE app
}

ipcMain.on('play-sine-wave', (event, arg) => {
    console.log('Playing sine wave');
    playSineWave();
});

ipcMain.on('stop-sine-wave', (event, arg) => {
    console.log('Stopping sine wave');
    stopSineWave();
});

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
