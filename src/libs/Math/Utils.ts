export function lerp(start: number, end: number, speed: number) {
  return (1 - speed) * start + speed * end
}