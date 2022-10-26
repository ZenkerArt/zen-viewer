export class ZenSignal<S, T> {
  private _handlers: Array<(source: S, data: T) => void> = [];

  public on(handler: (source: S, data: T) => void): void {
    const find = this._handlers.find(h => h === handler)
    if (find) {
      return
    }

    this._handlers.push(handler)
  }

  public off(handler: (source: S, data: T) => void): void {
    this._handlers = this._handlers.filter(h => h !== handler)
  }

  public emit(source: S, data: T): void {
    this._handlers.slice(0).forEach(h => h(source, data))
  }
}