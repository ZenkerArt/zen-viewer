import {ExternalFile, SystemFile} from './files'
import {readdir} from 'node:fs/promises'
import {contentType} from 'mime-types'
import {join} from 'path'

async function folderLoader(path: string): Promise<ExternalFile[]> {
  const files = []

  for (const file of await readdir(path)) {
    const ext = contentType(file)
    if (!ext) {
      continue
    }

    if (!ext.includes('image')) {
      continue
    }
    files.push(new SystemFile(join(path, file), ext))
  }

  return files
}

export {folderLoader}
