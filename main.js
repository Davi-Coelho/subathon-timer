const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const Store = require('electron-store')
const path = require('path')
const env = process.env.NODE_ENV || 'development';

const store = new Store()

if (env === 'development') {
    try {
        require('electron-reloader')(module, {
            debug: true,
            watchRenderer: true
        });
    } catch (_) { console.log('Error'); }
}
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 450,
        height: 650,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.setMenu(new Menu())

    ipcMain.handle('store-save-config', (event, subathonConfig) => {

        store.set('subathonConfig', subathonConfig)
    })

    ipcMain.handle('store-save-language', (event, language) => {

        store.set('language', language)
    })

    ipcMain.handle('store-load-config', async (event) => {

        return store.get('subathonConfig')
    })

    ipcMain.handle('store-load-language', async (event) => {
        return store.get('language')
    })

    mainWindow.loadFile('index.html')
    mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {

    if (process.platform !== 'darwin') {
        app.quit()
    }
})
