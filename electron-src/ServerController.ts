import {exec} from 'child_process'
import path from 'path'
import type {DataProtocol} from './DataProtocol'

const bins = __dirname.includes('app.asar') ?
  path.join(__dirname, '../../app.asar.unpacked/bins/image_backend/ImageHandler.exe')
  : path.join(__dirname, '../bins/image_backend/ImageHandler.exe')

console.log(bins)

export class ServerController {
  private _dataProto: DataProtocol

  constructor(dataProto: DataProtocol) {
    this._dataProto = dataProto
  }

  startServer = async (path: string = bins) => {
    try {
      await this._dataProto.ping()
      return
    }
    catch (e) {
    }
    const process = exec(path, console.log)

    process.stdout.on('data', (data) => {
      console.log(data)
    })
  }

  stopServer = () => {
    return this._dataProto.shutdownServer()
  }
}