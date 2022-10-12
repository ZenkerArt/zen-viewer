import {ContextMenuAction} from '../ContextMenuStore'
import {MatIconCode} from '../../../Components/MatIcon/MatIconCode'
import {ExternalFile} from '@Libs/Files/Files'

export class ContextActionRemoveFile extends ContextMenuAction {
  label = 'Удалить'
  icon = MatIconCode.delete
  file: ExternalFile
  callback() {}

  constructor(file: ExternalFile, callback?: () => void) {
    super()
    this.file = file
    this.callback = callback || this.callback
  }

  execute() {
    console.log('Remove', this.file.path)
    this.hideMenu()
    this.callback()
  }

}