import {ContextMenuAction} from '../ContextMenuStore'
import {ExternalFile} from '@Libs/Files/Files'
import {MatIconCode} from '../../../Components/MatIcon/MatIconCode'

const electron = window.require('electron')

export class ContextActionShowFile extends ContextMenuAction {
  icon: MatIconCode = MatIconCode.folderOpen
  label: string = 'Открыть файл'
  file: ExternalFile

  constructor(file: ExternalFile) {
    super()
    this.file = file
  }

  execute() {
    electron.shell.showItemInFolder(this.file.path)
    this.hideMenu()
  }

}