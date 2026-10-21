import createHorizontalScrollGroup from "./createHorizontalScrollGroup.ts"

export default function syncHorizontalScroll(first: HTMLElement, second: HTMLElement) {
  const group = createHorizontalScrollGroup()
  const leaveFirst = group.join(first)
  const leaveSecond = group.join(second)

  return () => {
    leaveFirst()
    leaveSecond()
  }
}
