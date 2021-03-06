'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import {
    createProtocol,
} from 'vue-cli-plugin-electron-builder/lib'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true //注入node模块
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }

    win.on('closed', () => {
        win = null
    })

    win.on('maximize', function () {
        win.webContents.send('window-maxed')
    })
    win.on('unmaximize', function () {
        win.webContents.send('window-unmaxed')
    })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        let installExtension = require('electron-devtools-installer')
        installExtension.default(installExtension.VUEJS_DEVTOOLS).then(() => {
            console.log('vue-devtools ok')
        }).catch(err => {
            console.log('Unable to install `vue-devtools`: \n', err)
        })
    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

// 接收最大化、最小化、关闭信号
let ipcMain = require('electron').ipcMain
ipcMain.on('window-min', function () {
    win.minimize()
})
ipcMain.on('window-max', function () {
    if (win.isMaximized()) {
        win.restore()
    } else {
        win.maximize()
    }
})
ipcMain.on('window-close', function () {
    win.close()
})
ipcMain.on('window-focus', function () {
    if(!win.isFocused()) {
        win.minimize()
        win.restore()
        win.focus()
    }
})

// 接收执行脚本指令
import { runScript, stopScript, sendMsg } from '@/plugins/scriptRunner'
ipcMain.on('script-run', function (event, id, script, {config={}, exports={}}={}) {
    runScript(id, script, {
        config: config,
        exports: exports,
        msgHandler (data) {
            win.webContents.send('script-data', data)
        }
    }).then(res => {
        win.webContents.send('script-data', res)
    }).catch(res => {
        win.webContents.send('script-data', res)
    })
    setTimeout(()=>{sendMsg(id, 'yeh~')}, 1000)
})
// 接收停止脚本指令
ipcMain.on('script-stop', function (e, id) {
    stopScript(id)
})
