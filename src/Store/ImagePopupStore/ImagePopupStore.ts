import {action, makeObservable, observable, runInAction} from 'mobx'
import {Vector2} from '@Libs/Math'
import {ExternalFile} from '@Libs/Files'

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
  _files: ExternalFile[] = []
  _urls: string[] = []
  _index: number = 0

  constructor() {
    makeObservable(this)
  }

  onNext(value: string, direction: boolean) {

  }

  @action
  setPos(pos: Vector2) {
    this.spawnPoint = {
      ...this.spawnPoint,
      pos
    }
  }

  setImages(files: ExternalFile[], index: number = 0) {
    this._files = files
    this._index = index
  }

  async setIndex(index: number) {
    if (index < 0 || index > this._files.length - 1) return;
    const dir = this._index - index > 0
    this._index = index
    const url = await this._files[this._index].loadUrl()
    this.onNext(url, dir)
  }

  next() {
    this.setIndex(this._index + 1)
  }

  prev() {
    this.setIndex(this._index - 1)
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
    this.spawnPoint = {pos: Vector2.create(), size: Vector2.create()}
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