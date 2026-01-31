const { app, BrowserWindow, protocol, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let noble;
let connectedPeripheral = null;
let discoveredPeripherals = new Map(); // Store peripherals by ID

// Try to load noble
try {
  noble = require('@abandonware/noble');
} catch (err) {
  console.log('Noble not available:', err.message);
}

// Existing handlers
ipcMain.handle('bluetooth-available', async () => {
  return !!noble;
});

ipcMain.handle('bluetooth-scan', async () => {
  return new Promise((resolve, reject) => {
    if (!noble) {
      reject(new Error('Bluetooth not available'));
      return;
    }

    discoveredPeripherals.clear(); // Clear previous scan
    const devices = [];
    
    const timeout = setTimeout(() => {
      noble.stopScanning();
      resolve(devices);
    }, 10000);

    noble.on('stateChange', (state) => {
      console.log('Bluetooth state:', state);
      if (state === 'poweredOn') {
        noble.startScanning([], true);
      }
    });

    noble.on('discover', (peripheral) => {
      console.log('Found device:', peripheral.advertisement.localName || 'Unknown');
      
      // Store peripheral reference
      discoveredPeripherals.set(peripheral.id, peripheral);
      
      // Only send serializable data through IPC
      devices.push({
        id: peripheral.id,
        name: peripheral.advertisement.localName || 'Unknown Device',
        rssi: peripheral.rssi
      });
    });
  });
});

// Connect to a specific device
ipcMain.handle('bluetooth-connect', async (event, deviceId) => {
  return new Promise((resolve, reject) => {
    if (!noble) {
      reject(new Error('Bluetooth not available'));
      return;
    }

    console.log('Attempting to connect to device:', deviceId);
    
    // Check if we already found this peripheral during scan
    let peripheral = discoveredPeripherals.get(deviceId);
    
    if (peripheral) {
      // We already have the peripheral from the scan
      connectToPeripheral(peripheral, resolve, reject);
    } else {
      // Need to scan for it
      noble.stopScanning();

      const onDiscover = (foundPeripheral) => {
        if (foundPeripheral.id === deviceId) {
          console.log('Found target device, connecting...');
          discoveredPeripherals.set(foundPeripheral.id, foundPeripheral);
          connectToPeripheral(foundPeripheral, resolve, reject);
          noble.removeListener('discover', onDiscover);
          noble.stopScanning();
        }
      };

      noble.on('discover', onDiscover);
      
      noble.on('stateChange', (state) => {
        if (state === 'poweredOn') {
          noble.startScanning([], false);
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        noble.removeListener('discover', onDiscover);
        noble.stopScanning();
        reject(new Error('Connection timeout'));
      }, 30000);
    }
  });
});

// Helper function to connect to peripheral
function connectToPeripheral(peripheral, resolve, reject) {
  peripheral.connect((error) => {
    if (error) {
      console.error('Connection error:', error);
      reject(error);
      return;
    }

    console.log('Connected to', peripheral.advertisement.localName);
    connectedPeripheral = peripheral;

    // Handle disconnect
    peripheral.once('disconnect', () => {
      console.log('Device disconnected');
      connectedPeripheral = null;
      if (mainWindow) {
        mainWindow.webContents.send('bluetooth-disconnected');
      }
    });

    resolve({
      success: true,
      name: peripheral.advertisement.localName,
      id: peripheral.id
    });
  });
}

// Subscribe to a characteristic
ipcMain.handle('bluetooth-subscribe', async (event, serviceUuid, characteristicUuid) => {
  return new Promise((resolve, reject) => {
    if (!connectedPeripheral) {
      reject(new Error('No device connected'));
      return;
    }

    console.log('Discovering services and characteristics...');

    connectedPeripheral.discoverSomeServicesAndCharacteristics(
      [serviceUuid],
      [characteristicUuid],
      (error, services, characteristics) => {
        if (error) {
          console.error('Discovery error:', error);
          reject(error);
          return;
        }

        if (characteristics.length === 0) {
          reject(new Error('Characteristic not found'));
          return;
        }

        const characteristic = characteristics[0];
        console.log('Found characteristic, subscribing...');

        characteristic.subscribe((error) => {
          if (error) {
            console.error('Subscribe error:', error);
            reject(error);
            return;
          }

          console.log('Subscribed to notifications');

          // Listen for data
          characteristic.on('data', (data) => {
            const value = data.toString('utf8');
            //console.log('Received data:', value);
            
            // Send data to renderer
            if (mainWindow) {
              mainWindow.webContents.send('bluetooth-data', value);
            }
          });

          resolve({ success: true });
        });
      }
    );
  });
});

// Disconnect
ipcMain.handle('bluetooth-disconnect', async () => {
  return new Promise((resolve) => {
    if (connectedPeripheral) {
      connectedPeripheral.disconnect(() => {
        console.log('Disconnected');
        connectedPeripheral = null;
        resolve({ success: true });
      });
    } else {
      resolve({ success: false, message: 'No device connected' });
    }
  });
});

// IPC Handler for saving files
ipcMain.handle('save-file', async (event, { data, defaultPath }) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: defaultPath || 'sleepData.csv',
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
      // Convert data to string if it's not already
      let dataToWrite;
      if (typeof data === 'string') {
        dataToWrite = data;
      } else if (Buffer.isBuffer(data)) {
        dataToWrite = data;
      } else {
        // If it's an object, stringify it
        dataToWrite = JSON.stringify(data, null, 2);
      }
      
      fs.writeFileSync(result.filePath, dataToWrite, 'utf8');
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

// IPC Handler for appending data to file
ipcMain.handle('append-to-file', async (event, { data, filePath }) => {
  try {
    const path = require('path');
    const fs = require('fs');
    
    let targetPath;
    
    if (filePath) {
      // Use provided path
      targetPath = filePath;
    } else {
      // Default to the directory where main.js is located
      targetPath = path.join(__dirname, '../app/(tabs)/sleepData/sleepData.csv');
    }
    
    let dataToWrite = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    
    fs.appendFileSync(targetPath, dataToWrite, 'utf8');
    
    return { 
      success: true, 
      path: targetPath
    };
  } catch (error) {
    console.error('Error appending to file:', error);
    return { 
      success: false, 
      error: error.message
    };
  }
});

// Handle file reading
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    throw error;
  }
});

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
  mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
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