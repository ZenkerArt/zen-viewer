import {lstat, readdir, readFile} from 'node:fs/promises'
import {contentType} from 'mime-types'
import path from 'path'
import * as electron from 'electron'
import {ipcRenderer} from 'electron'
import {DataProtocol} from './DataProtocol'
import {ServerController} from './ServerController'

class FileSys {
  readFile = readFile
  lstat = lstat
  readdir = readdir
  isDir = async (path: string) => (await lstat(path)).isDirectory()
  contentType = contentType
  scanDir = async (p: string) => (await readdir(p)).map(item => path.join(p, item))
  showFile = (path: string) => {
    electron.shell.showItemInFolder(path)
  }
}

class ThisWindow {
  startMove = () => {
    ipcRenderer.send('start-drag-window')
  }
  stopMove = () => {
    ipcRenderer.send('stop-drag-window')
  }

  alwaysOnTop = (value: boolean) => {
    ipcRenderer.send('always-on-top', value)
  }
}

const proto = new DataProtocol()
const server = new ServerController(proto)

ipcRenderer.on('quit', () => {
  server.stopServer()
})

server.startServer()

export const api = {
  fileSys: new FileSys(),
  thisWindow: new ThisWindow(),
  dataProtocol: proto,
  serverController: server
}