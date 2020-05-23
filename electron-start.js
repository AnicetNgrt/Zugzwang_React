const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const url = require('url');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1800, 
        height: 810,
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

    mainWindow.setMenuBarVisibility(false);

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/build/index.html`);
    mainWindow.setTitle("Patherns private Dev build");

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    const allScreens = electron.screen.getAllDisplays();

    var maxHeight = 0;
    for(var screen of allScreens) {
        if(screen.size.height > maxHeight) maxHeight = screen.size.height;
    }

    electron.ipcMain.on("resizeSmall", args => {
        mainWindow.setSize(334, 610, true);
    });

    electron.ipcMain.on("resize2160", args => {
        if(maxHeight < 1400) return;
        mainWindow.setContentSize(3840, 2160);
    });

    electron.ipcMain.on("resize1440", args => {
        if(maxHeight < 1000) return;
        mainWindow.setContentSize(2560, 1440);
    });

    electron.ipcMain.on("resize1080", args => {
        if(maxHeight < 750) return;
        mainWindow.setContentSize(1920, 1080);
    });

    electron.ipcMain.on("resize900", args => {
        mainWindow.setContentSize(1600, 900);
    });

    electron.ipcMain.on("resize768", args => {
        mainWindow.setContentSize(1366, 768);
    });

    electron.ipcMain.on("resize720", args => {
        mainWindow.setContentSize(1280, 720);
    });

    electron.ipcMain.on("resize648", args => {
        mainWindow.setContentSize(1152, 648);
    });

    electron.ipcMain.on("resize576", args => {
        mainWindow.setContentSize(1024, 576);
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

