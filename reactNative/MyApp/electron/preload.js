const { contextBridge, ipcRenderer } = require('electron/renderer');

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
  saveFile: (args) => ipcRenderer.invoke('save-file', args),
  cancelBluetoothRequest: () => ipcRenderer.send('cancel-bluetooth-request'),
  bluetoothPairingRequest: (callback) => ipcRenderer.on('bluetooth-pairing-request', () => callback()),
  bluetoothPairingResponse: (response) => ipcRenderer.send('bluetooth-pairing-response', response)
});

console.log('Preload script loaded - electronAPI available');