import {action, makeObservable, observable} from 'mobx'
import {MatIconCode} from '@Components/MatIcon/MatIconCode'


export abstract class AlertBase {
  time: number = 0
  onDestroy: Record<string, () => void> = {}

  constructor() {
    makeObservable(this)
  }

  @action
  destroy = () => {
    Object.entries(this.onDestroy).forEach(([name, func]) => {
      func()
    })
    return this
  }
}

export class AlertNotify extends AlertBase {
  @observable isShow = false
  @observable text: string = ''
  @observable state?: boolean
  @observable icon?: MatIconCode
}

export class AlertLoading extends AlertBase {
  @observable max: number = 1
  @observable value: number = 0

  onValue(value: number) {

  }

  @action
  setValue(value: number) {
    this.onValue(value)
    this.value = value
    return this
  }

  @action
  setMax(max: number) {
    this.max = max
    return this
  }
}

class AlertStore {
  @observable alerts: AlertBase[] = []

  constructor() {
    makeObservable(this)
  }

  @action
  private addAlert(alert: AlertBase) {
    this.alerts.push(alert)

    alert.onDestroy.delete = () => {
      this.alerts.forEach((item, index) => {
        if (item === alert) {
          delete this.alerts[index]
        }
      })
    }
  }

  alert({text, state, icon}: { text: string, state?: boolean, icon?: MatIconCode }, time = 1000) {
    const a = new AlertNotify()
    a.text = text
    a.state = state
    a.icon = icon
    a.time = time
    this.addAlert(a)
    return a
  }

  alertLoading(max: number) {
    const alert = new AlertLoading()
    alert.setMax(max)

    this.addAlert(alert)

    return alert
  }
}

export const alertStore = new AlertStore()