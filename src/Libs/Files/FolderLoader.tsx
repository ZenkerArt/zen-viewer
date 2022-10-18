import {ExternalFile, SystemFile} from './Files'
// import {readdir} from 'node:fs/promises'
// import {join} from 'path'

async function folderLoader(path: string): Promise<ExternalFile[]> {
  const files: SystemFile[] = []

  // @ts-ignore
  for (const file of await window.electronAPI.scanDir(path)) {

    // @ts-ignore
    const ext = window.electronAPI.contentType(file)
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

export {folderLoader}
