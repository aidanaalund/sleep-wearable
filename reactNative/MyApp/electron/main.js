const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

// Must be called before app is ready
app.whenReady().then(() => {
  // Register protocol handler to fix absolute paths
  protocol.interceptFileProtocol('file', (request, callback) => {
    let requestedUrl = request.url.substr(7); // Remove 'file://'
    
    // Decode URL encoding (e.g., %20 -> space)
    requestedUrl = decodeURIComponent(requestedUrl);
    
    // Remove any query strings or fragments
    requestedUrl = requestedUrl.split('?')[0].split('#')[0];
    
    let filePath;
    
    // Check if this is a request for _expo resources
    if (requestedUrl.includes('/_expo/')) {
      // Extract the part after /_expo/
      const expoPath = requestedUrl.split('/_expo/')[1];
      // Build the correct path from our dist folder
      filePath = path.join(__dirname, '..', 'dist', '_expo', expoPath);
    } else {
      // For other files, normalize the path
      filePath = path.normalize(requestedUrl);
    }
    
    // Log for debugging (you can remove this later)
    console.log('Request:', request.url);
    console.log('Resolved to:', filePath);
    console.log('File exists:', fs.existsSync(filePath));
    
    callback({ path: filePath });
  });

  createWindow();
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Allow file access for local files
      webSecurity: false,
    }
  });

  // Load the index.html file
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  console.log('Loading:', indexPath);
  
  win.loadFile(indexPath);
  
  // Open DevTools to see console logs
  win.webContents.openDevTools();
  
  // Log any console messages from the renderer
  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Renderer] ${message}`);
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