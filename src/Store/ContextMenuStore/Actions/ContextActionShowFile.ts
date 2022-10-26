import {ExternalFile} from '@Libs/Files/Files'
import {MatIconCode} from '@Components/MatIcon/MatIconCode'
import {ContextMenuAction} from '@Store/ContextMenuStore/ContextMenuAction'
import {electronAPI} from '@Libs/ElectronAPI'

export class ContextActionShowFile extends ContextMenuAction {
  icon: MatIconCode = MatIconCode.folderOpen
  label: string = 'Открыть файл'
  file: ExternalFile

  constructor(file: ExternalFile) {
    super()
    this.file = file
  }

  execute() {
    electronAPI.fileSys.showFile(this.file.path)
    this.hideMenu()
  }

}