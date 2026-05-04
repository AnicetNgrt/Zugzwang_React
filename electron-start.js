const electron = require('electron');
const path = require('path');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// Toggle dev mode by setting ELECTRON_START_URL=http://localhost:3000 (Vite dev server).
const startUrl = process.env.ELECTRON_START_URL;

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1800,
        height: 810,
        fullscreen: false,
        titleBarStyle: 'hidden',
        show: true,
        autoHideMenuBar: true,
        resizable: false,
        webPreferences: {
            // The renderer code uses window.require('electron') and direct ipcRenderer access,
            // so we keep the same trust model as the original app: nodeIntegration on,
            // contextIsolation off, sandbox off. The app loads only local files / its own dev server.
            nodeIntegration: true,
            contextIsolation: false,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.setMenuBarVisibility(false);

    if (startUrl) {
        mainWindow.loadURL(startUrl);
    } else {
        mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
    }
    mainWindow.setTitle('Patherns private Dev build');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    const allScreens = electron.screen.getAllDisplays();
    var maxHeight = 0;
    for (var screen of allScreens) {
        if (screen.size.height > maxHeight) maxHeight = screen.size.height;
    }

    electron.ipcMain.on('resizeSmall', () => mainWindow.setSize(334, 610, true));
    electron.ipcMain.on('resize2160', () => { if (maxHeight >= 1400) mainWindow.setContentSize(3840, 2160); });
    electron.ipcMain.on('resize1440', () => { if (maxHeight >= 1000) mainWindow.setContentSize(2560, 1440); });
    electron.ipcMain.on('resize1080', () => { if (maxHeight >= 750)  mainWindow.setContentSize(1920, 1080); });
    electron.ipcMain.on('resize900',  () => mainWindow.setContentSize(1600, 900));
    electron.ipcMain.on('resize768',  () => mainWindow.setContentSize(1366, 768));
    electron.ipcMain.on('resize720',  () => mainWindow.setContentSize(1280, 720));
    electron.ipcMain.on('resize648',  () => mainWindow.setContentSize(1152, 648));
    electron.ipcMain.on('resize576',  () => mainWindow.setContentSize(1024, 576));
    electron.ipcMain.on('fullscreenOn',  () => mainWindow.setFullScreen(true));
    electron.ipcMain.on('fullscreenOff', () => mainWindow.setFullScreen(false));
    electron.ipcMain.on('center', () => mainWindow.center());

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
}

app.commandLine.appendSwitch('high-dpi-support', '1');
app.commandLine.appendSwitch('force-device-scale-factor', '1');

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
