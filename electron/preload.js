const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    playSineWave: () => ipcRenderer.send('play-sine-wave'),
    stopSineWave: () => ipcRenderer.send('stop-sine-wave'),
});
