const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  readFile: (filePath) => ipcRenderer.invoke("read-file", filePath),
  writeFile: (filePath, contents) =>
    ipcRenderer.invoke("write-file", { filePath, contents })
});