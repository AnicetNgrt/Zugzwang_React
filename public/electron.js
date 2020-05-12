const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

//const path = require('path');
//const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 334, 
        height: 610,
        fullscreen:false,
        titleBarStyle:'hidden',
        shown:true,
        autoHideMenuBar: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            preload: __dirname + '/preload.js'
        }
    });

    // and load the index.html of the app.
    mainWindow.loadURL("http://localhost:3000/");

    mainWindow.setTitle("Zugwang project pre-alpha");

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    electron.ipcMain.on("resizeSmall", args => {
        mainWindow.setSize(334, 610, true);
    });

    electron.ipcMain.on("resize1080", args => {
        mainWindow.setContentSize(1920, 1080);
    });

    electron.ipcMain.on("resize768", args => {
        mainWindow.setSize(1366, 768, true);
    });

    electron.ipcMain.on("resize720", args => {
        mainWindow.setSize(1280, 720, true);
    });

    electron.ipcMain.on("fullscreenOn", args => {
        mainWindow.setFullScreen(true);
    });

    electron.ipcMain.on("fullscreenOff", args => {
        mainWindow.setFullScreen(false);
    });

    electron.ipcMain.on("center", args => {
        mainWindow.center();
    });

    

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
app.commandLine.appendSwitch('high-dpi-support', 1)
app.commandLine.appendSwitch('force-device-scale-factor', 1)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

