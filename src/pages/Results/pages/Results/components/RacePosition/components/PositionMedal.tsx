import { Medal } from "../../../shared/medals.ts"

interface PositionMedalProps {
  medal: Medal
  position: number | bigint
}

interface MedalColorClasses {
  disc: string
  face: string
  ink: string
}

const MEDAL_COLOR_CLASSES: Record<Medal, MedalColorClasses> = {
  bronze: {
    disc: "fill-medal-bronze",
    face: "fill-medal-bronze-light",
    ink: "fill-medal-bronze-ink",
  },
  gold: {
    disc: "fill-medal-gold",
    face: "fill-medal-gold-light",
    ink: "fill-medal-gold-ink",
  },
  silver: {
    disc: "fill-medal-silver",
    face: "fill-medal-silver-light",
    ink: "fill-medal-silver-ink",
  },
}

export default function PositionMedal(props: PositionMedalProps) {
  const colors = MEDAL_COLOR_CLASSES[props.medal]
  const positionLabel = props.position.toString()

  return (
    <span className="position-medal tw-root inline-block align-top">
      <svg aria-hidden="true" viewBox="0 0 24 32" width="18" height="24" className="block">
        <path d="M4 0h6l5 14H9z" className="fill-primary" />
        <path d="M14 0h6l-5 14H9z" className="fill-secondary" />
        <circle cx="12" cy="22" r="9.5" className={colors.disc} />
        <circle cx="12" cy="22" r="7" className={colors.face} />
        <text
          x="12"
          y="22"
          dominantBaseline="central"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          className={`font-sans ${colors.ink}`}
        >
          {positionLabel}
        </text>
      </svg>
      <span className="sr-only">{`${positionLabel}.`}</span>
    </span>
  )
}
