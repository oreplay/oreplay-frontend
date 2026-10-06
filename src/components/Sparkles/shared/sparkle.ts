export interface Sparkle {
  delaySeconds: number
  radius: number
  x: number
  y: number
}

export const ICON_SPARKLES: Sparkle[] = [
  { delaySeconds: 0, radius: 4.5, x: 21, y: 3 },
  { delaySeconds: 0.8, radius: 3, x: 2, y: 8 },
  { delaySeconds: 1.6, radius: 3, x: 22, y: 20 },
]

export const SPARKLE_PERIOD_SECONDS = 2.4

export function sparklePathOf(radius: number): string {
  return [
    `M0,${-radius}`,
    `Q0,0 ${radius},0`,
    `Q0,0 0,${radius}`,
    `Q0,0 ${-radius},0`,
    `Q0,0 0,${-radius}`,
    "Z",
  ].join(" ")
}

export function sparkleTranslationOf(sparkle: Sparkle): string {
  return `translate(${sparkle.x} ${sparkle.y})`
}
