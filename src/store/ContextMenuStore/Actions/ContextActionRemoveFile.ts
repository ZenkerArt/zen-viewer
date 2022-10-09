import {ContextMenuAction} from '../ContextMenuStore'

export class ContextActionRemoveFile extends ContextMenuAction{
  label = 'Remove'

  execute() {
    console.log('Remove')
  }
}