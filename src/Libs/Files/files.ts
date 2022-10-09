import {readFile} from 'node:fs/promises'

interface ExternalFile {
  id: string
  path: string

  loadUrl(): Promise<string>
  loadBuffer(): Promise<Buffer>
}

class BlobFile implements ExternalFile {
  id: string
  path: string
  private readonly _file: File
  // private _url?: string

  constructor(file: File) {
    this._file = file
    //@ts-ignore
    this.path = file.path
    //@ts-ignore
    this.id = file.path || new Date().getTime().toString()
  }

  async loadBuffer() {
    return await this._file.arrayBuffer() as Buffer
  }

  async loadUrl() {
    const buffer = await this.loadBuffer()

    const file = this._file
    const image = new Blob([buffer], {
      type: file.type
    })

    // this._url = URL.createObjectURL(image)
    return URL.createObjectURL(image)
  }
}

class SystemFile implements ExternalFile {
  private readonly _path: string
  private readonly _mimetype: string
  id: string
  path: string

  constructor(path: string, _mimetype: string) {
    this._path = path
    this._mimetype = _mimetype
    this.id = path
    //@ts-ignore
    this.path = path
  }

  async loadBuffer() {
    return await readFile(this._path)
  }

  async loadUrl() {
    const buffer = await this.loadBuffer()

    const image = new Blob([buffer], {
      type: this._mimetype
    })

    return URL.createObjectURL(image)
  }
}

export {BlobFile, SystemFile}
export type {ExternalFile}