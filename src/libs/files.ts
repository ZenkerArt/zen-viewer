import {lstat} from 'node:fs/promises'
console.log(lstat, 'afwefawef')
// require()
interface ExternalFile {
  loadImage(): Promise<string>
}

class BlobFile implements ExternalFile{
  private readonly _file: File

  constructor(file: File) {
    this._file = file
  }

  async loadImage() {
    console.log(lstat)
    const file = this._file

    const buffer = await file.arrayBuffer()
    const image = new Blob([buffer], {
      type: file.type
    })

    return URL.createObjectURL(image)
  }
}

class SystemFile implements ExternalFile{
  private readonly _path: string

  constructor(path: string) {
    this._path = path
  }

  async loadImage() {
    // const file = fs.promises.this._path

    // const buffer = await file.arrayBuffer()
    // const image = new Blob([buffer], {
    //   type: file.type
    // })

    return ''
  }
}

export {BlobFile}