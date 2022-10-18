const {WindowDrag} = require('./electron-src/electron-context/index')
const path = require('path');

const {app, BrowserWindow, ipcMain} = require('electron');
const isDev = require('electron-is-dev');

let interval
const dragWindow = new WindowDrag()

function createWindow() {
    // session.defaultSession.loadExtension('./src/vpn').then(console.log)
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        zoomToPageWidth: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, './electron-src/preload.js')
        },
    });
    dragWindow.setWindow(win)
    win.once('ready-to-show', () => {
        win.webContents.setZoomFactor(1)
    })

    ipcMain.on('start-drag-window', () => {
        dragWindow.start()
        interval = setInterval(dragWindow.update, 10)
    })

    ipcMain.on('stop-drag-window', () => {
        dragWindow.stop(interval)
    })

    app.commandLine.appendSwitch('js-flags', '--expose_gc --max-old-space-size=128')

    // and load the index.html of the app.
    // win.loadFile("index.html");
    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );
    // Open the DevTools.
    if (isDev) {
        win.webContents.openDevTools();
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
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
