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
      webSecurity: false,
    }
  });

  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  
  // Load the file and accept that we'll see the Unmatched Route briefly
  win.loadFile(indexPath);
  
  // After a short delay, simulate clicking "Go back" by going to the home route
  win.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      // Navigate using JavaScript to the home route
      win.webContents.executeJavaScript(`
        // Check if we're on an unmatched route
        const currentPath = window.location.pathname;
        console.log('Current path:', currentPath);
        
        // If we see the file path, navigate to home
        if (currentPath.includes('index.html') || currentPath.includes('dist')) {
          console.log('Navigating to home...');
          window.history.pushState({}, '', '/home');
          window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
          
          // Force a re-render by dispatching a custom event
          window.dispatchEvent(new Event('pushstate'));
          window.dispatchEvent(new Event('replacestate'));
        }
      `);
    }, 500);
  });
  
  // Open DevTools
  win.webContents.openDevTools();
  
  // Log console messages
  win.webContents.on('console-message', (event, level, message) => {
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