import {lerp} from './Utils'

export type Operant = Vector2 | number

function isNumber(value: any): value is number | boolean {
  return Number.isFinite(value)
}

export const VMath = {
  add(vec: Vector2, op: Operant) {
    if (isNumber(op)) {
      return Vector2.create(vec.x + op, vec.y + op)
    }
    return Vector2.create(vec.x + op.x, vec.y + op.y)
  },
  sub(vec: Vector2, op: Operant) {
    if (isNumber(op)) {
      return Vector2.create(vec.x - op, vec.y - op)
    }
    return Vector2.create(vec.x - op.x, vec.y - op.y)
  },
  mul(vec: Vector2, op: Operant) {
    if (isNumber(op)) {
      return Vector2.create(vec.x * op, vec.y * op)
    }
    return Vector2.create(vec.x * op.x, vec.y * op.y)
  },
  div(vec: Vector2, op: Operant) {
    if (isNumber(op)) {
      return Vector2.create(vec.x / op, vec.y / op)
    }
    return Vector2.create(vec.x / op.x, vec.y / op.y)
  },
  lerp(start: Vector2, end: Vector2, speed: number): Vector2 {
    return Vector2.create(
      lerp(start.x, end.x, speed),
      lerp(start.y, end.y, speed)
    )
  }
}

export class Vector2 {
  private _x: number = 0
  private _y: number = 0

  static create(x: number = 0, y?: number) {
    const vec = new Vector2()
    vec._x = x
    vec._y = isNumber(y) ? y : x
    return vec
  }

  get x(): number {
    return this._x
  }

  set x(value: number) {
    this._x = value
  }

  get y(): number {
    return this._y
  }

  set y(value: number) {
    this._y = value
  }

  get tuple(): [number, number] {
    return [this._x, this._y]
  }

  fill(value: number) {
    this._x = value
    this._y = value
  }

  set(x: number | Vector2 = 0, y?: number) {
    if (typeof x === 'object') {
      this._x = x.x
      this._y = x.y
      return this
    }

    this._x = x || 0
    this._y = y || this._y

    return this
  }
}