const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  console.log('Preload: DOMContentLoaded');
  console.log('Preload: Current hash:', window.location.hash);
  console.log('Preload: Current href:', window.location.href);
});

// Try to load webbluetooth polyfill
try {
  const { Bluetooth } = require('webbluetooth');
  
  // Inject Web Bluetooth API into the window
  contextBridge.exposeInMainWorld('bluetooth', new Bluetooth({
    deviceFound: (device, selectFn) => {
      console.log('Device found via polyfill:', device);
      selectFn(true); // Auto-select devices
    }
  }));
  
  console.log('Web Bluetooth polyfill loaded');
} catch (error) {
  console.log('Web Bluetooth polyfill not available:', error.message);
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Your existing saveFile API
  saveFile: (data, defaultPath) => ipcRenderer.invoke('save-file', { data, defaultPath }),
  
  // Add appendToFile API
  appendToFile: (data, filePath) => ipcRenderer.invoke('append-to-file', { data, filePath }),
  
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),

  // Add Bluetooth APIs
  bluetooth: {
    available: () => ipcRenderer.invoke('bluetooth-available'),
    scan: () => ipcRenderer.invoke('bluetooth-scan'),
    connect: (deviceId) => ipcRenderer.invoke('bluetooth-connect', deviceId),
    subscribe: (serviceUuid, characteristicUuid) => 
      ipcRenderer.invoke('bluetooth-subscribe', serviceUuid, characteristicUuid),
    disconnect: () => ipcRenderer.invoke('bluetooth-disconnect'),
    
    // Listen for data from device
    onData: (callback) => {
      ipcRenderer.on('bluetooth-data', (event, data) => callback(data));
    },
    
    // Listen for disconnect events
    onDisconnect: (callback) => {
      ipcRenderer.on('bluetooth-disconnected', () => callback());
    }
  }
});

console.log('Preload script loaded - electronAPI available');