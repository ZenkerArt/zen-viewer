import {action, computed, makeObservable, observable} from 'mobx'

export enum AppState {
  idle,
  windowMove
}

class AppStore {
  private _prevState: AppState = AppState.idle
  @observable state: AppState = AppState.idle

  constructor() {
    makeObservable(this)
  }

  @computed
  get isPaused() {
    return this.state === AppState.windowMove
  }

  @action
  setState = (state: AppState) => {
    this._prevState = this.state
    this.state = state
  }

  @action
  rollbackState() {
    this.state = this._prevState
  }

}

export const appStore = new AppStore()