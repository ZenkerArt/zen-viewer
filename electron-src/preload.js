require('./index')
const {contentType} = require('mime-types')
const {Socket} = require('net')
const { contextBridge, ipcRenderer} = require('electron')
const path = require("path")
const {readdir, readFile, lstat} = require('node:fs/promises')

function loadImage(path, rescale) {
    const client = new Socket()

    client.connect(8080, '127.0.0.1', function () {
        client.write(JSON.stringify({
            path: path,
            rescale: rescale
        }))
    })

    return new Promise((resolve, reject) => {
        const chunks = []

        client.on('close', function () {
            resolve(chunks)
        })

        client.on('error', reject)

        client.on('data', function (data) {
          chunks.push(data)
        })
    })
}

async function scanDir(p) {
    return (await readdir(p)).map(item => path.join(p, item))
}

contextBridge.exposeInMainWorld('electronAPI', {
    startDrag: (fileName) => {
        ipcRenderer.send('ondragstart', path.join(process.cwd(), fileName))
    },
    startMove: () => {
        ipcRenderer.send('start-drag-window')
    },
    stopMove: () => {
        ipcRenderer.send('stop-drag-window')
    },
    contentType,
    loadImage,
    scanDir,
    readFile,
    isDir: async (path) => (await lstat(path)).isDirectory()
})