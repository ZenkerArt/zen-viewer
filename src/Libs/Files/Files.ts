import {electronAPI} from '@Libs/ElectronAPI'

export async function filesLoader(items: FileList): Promise<ExternalFile[]> {
  let files: ExternalFile[] = []

  if (items === undefined) {
    return []
  }

  for (const item of Array.from(items)) {
    // @ts-ignore
    const path: string = item.path

    if (path.trim() !== '') {
      if (await electronAPI.fileSys.isDir(path)) {
        files = [...files, ...(await folderLoader(path))]
        continue
      }
    }

    files.push(new BlobFile(item))
  }
  return files
}

export async function folderLoader(path: string): Promise<ExternalFile[]> {
  const files: SystemFile[] = []

  for (const file of await electronAPI.fileSys.scanDir(path)) {

    const ext = electronAPI.fileSys.contentType(file)
    if (!ext) {
      continue
    }

    if (!ext.includes('image')) {
      continue
    }
    files.push(new SystemFile(file, ext))
  }

  return files
}

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
    return await electronAPI.fileSys.readFile(this._path)
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