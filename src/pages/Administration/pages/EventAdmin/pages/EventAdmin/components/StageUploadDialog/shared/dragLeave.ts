export function isLeavingArea(area: Node, nextTarget: EventTarget | null): boolean {
  return !(nextTarget instanceof Node) || !area.contains(nextTarget)
}
