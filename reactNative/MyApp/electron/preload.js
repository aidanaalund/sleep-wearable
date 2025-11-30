const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  console.log('Preload: DOMContentLoaded');
  console.log('Preload: Current hash:', window.location.hash);
  console.log('Preload: Current href:', window.location.href);
});

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (args) => ipcRenderer.invoke('save-file', args)
});

console.log('Preload script loaded - electronAPI available');