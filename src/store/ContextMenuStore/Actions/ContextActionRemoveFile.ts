import {ContextMenuAction} from '../ContextMenuStore'
import {MatIconCode} from '../../../components/MatIcon/MatIconCode'
import {ExternalFile} from '../../../libs/Files/files'
import {contextMenuStore} from '../index'

export class ContextActionRemoveFile extends ContextMenuAction {
  label = 'Remove'
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
    contextMenuStore.setActive(false)
    this.callback()
  }

}