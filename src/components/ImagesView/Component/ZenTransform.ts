import {Vector2, VMath} from '../../../libs/Math/Vector2'

export class ZenTransform {
  private readonly _size: Vector2 = Vector2.create()
  private readonly _position: Vector2 = Vector2.create()
  private readonly _offset: Vector2 = Vector2.create()

  get position() {
    return this._position
  }

  get posOffset() {
    return VMath.add(this._position, this._offset)
  }

  get size() {
    return this._size
  }

  get offset() {
    return this._offset
  }

  get rect() {
    return {
      left: this.position.x,
      top: this.position.y,
      right: this.position.x + this.size.x,
      bottom: this.position.y + this.size.y
    }
  }

  isCollide(point: Vector2) {
    const {size, posOffset} = this

    const collideY = posOffset.x < point.x && point.x < posOffset.x + size.x
    const collideX = posOffset.y < point.y && point.y < posOffset.y + size.y

    return collideX && collideY
  }
}