const { app, BrowserWindow, protocol, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let bluetoothPinCallback;
let selectBluetoothCallback;

// Must be called before app is ready
app.whenReady().then(() => {
  // Register a custom protocol to serve files as if from a web server
  protocol.registerFileProtocol('app', (request, callback) => {
    let requestedUrl = request.url.substr(6); // Remove 'app://'
    
    // Decode URL encoding
    requestedUrl = decodeURIComponent(requestedUrl);
    
    // Remove query strings or fragments
    requestedUrl = requestedUrl.split('?')[0].split('#')[0];
    
    let filePath;
    
    // Handle root path
    if (requestedUrl === '/' || requestedUrl === '') {
      filePath = path.join(__dirname, '..', 'dist', 'index.html');
    }
    // Handle _expo resources
    else if (requestedUrl.includes('/_expo/')) {
      const expoPath = requestedUrl.split('/_expo/')[1];
      filePath = path.join(__dirname, '..', 'dist', '_expo', expoPath);
    }
    // Handle any other route - serve index.html for client-side routing
    else if (!path.extname(requestedUrl)) {
      filePath = path.join(__dirname, '..', 'dist', 'index.html');
    }
    // Handle asset files
    else {
      filePath = path.join(__dirname, '..', 'dist', requestedUrl);
    }
    
    callback({ path: filePath });
  });

  createWindow();
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      experimentalFeatures: true,
      preload: path.join(__dirname, 'preload.js'),
      // Add these for Web Bluetooth
      sandbox: false,
      enableBluetoothAPI: true
    }
  });

  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission) => {
    if (permission === 'bluetooth' || permission === 'bluetooth-scan') {
      return true;
    }
    return false;
  });

  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'bluetooth' || permission === 'bluetooth-scan') {
      callback(true);
    } else {
      callback(false);
    }
  });

  mainWindow.loadURL('app://./home');
  
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();
  });
  
  setTimeout(() => {
    if (!mainWindow.isVisible()) {
      console.log('Fallback: showing window after timeout');
      mainWindow.show();
    }
  }, 3000);
  
  // Open DevTools for debugging
  // mainWindow.webContents.openDevTools();
  
  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log(`[Renderer] ${message}`);
  });
  
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorDescription, validatedURL);
    if (validatedURL.includes('/home')) {
      console.log('Retrying with root URL...');
      mainWindow.loadURL('app://./');
    }
  });

  // Handle Bluetooth device selection
  mainWindow.webContents.session.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault();
    
    console.log('Bluetooth device selection requested');
    console.log('Available devices:', deviceList.length);
    
    if (deviceList && deviceList.length > 0) {
      // Log device info
      deviceList.forEach((device, i) => {
        console.log(`Device ${i}: ${device.deviceName} (${device.deviceId})`);
      });
      
      // Automatically select the first device
      // In production, you might want to show a dialog to let user choose
      const selectedDevice = deviceList[0];
      console.log('Auto-selecting device:', selectedDevice.deviceName);
      callback(selectedDevice.deviceId);
    } else {
      console.log('No Bluetooth devices found');
      callback('');
    }
  });
}

// IPC Handler for saving files
ipcMain.handle('save-file', async (event, { data, defaultPath }) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: defaultPath || 'sleepData.txt',
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'CSV Files', extensions: ['csv'] },
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (result.canceled) {
      return { success: false, canceled: true };
    }

    if (result.filePath) {
      fs.writeFileSync(result.filePath, data, 'utf8');
      return { 
        success: true, 
        path: result.filePath,
        canceled: false 
      };
    }

    return { success: false, canceled: false };
  } catch (error) {
    console.error('Error saving file:', error);
    return { 
      success: false, 
      error: error.message,
      canceled: false 
    };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});