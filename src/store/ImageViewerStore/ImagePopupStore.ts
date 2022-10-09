import {action, makeObservable, observable} from 'mobx'
import {Vector2} from '../../libs/Math/Vector2'

export interface ImagePopupSpawnPoint {
  pos: Vector2
  size: Vector2
}

class ImagePopupStore {
  @observable url: string = ''
  @observable isShow: boolean = false
  @observable spawnPoint: ImagePopupSpawnPoint = {
    pos: Vector2.create(),
    size: Vector2.create()
  }
  _urls: string[] = []

  constructor() {
    makeObservable(this)
  }

  @action
  show(url: string, options?: ImagePopupSpawnPoint) {
    this.url = url
    this.isShow = true

    if (options) {
      this.spawnPoint = options
    }
  }

  @action
  hide() {
    this._urls.push(this.url)
    this.isShow = false
  }

  removeAllImages() {
    this._urls.forEach(url => URL.revokeObjectURL(url))
    // @ts-ignore
    global.gc()
  }
}

export const imagePopupStore = new ImagePopupStore()