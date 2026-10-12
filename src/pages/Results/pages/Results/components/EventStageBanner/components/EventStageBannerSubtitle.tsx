import { Link } from "react-router-dom"

interface EventStageBannerSubtitleProps {
  text: string
  to?: string
}

/**
 * Subtitle line of the stage banner. With a destination it becomes a link that looks exactly like
 * the plain text and only reveals itself on hover, by fading slightly.
 * @param props.text Text shown as the subtitle.
 * @param props.to Route the subtitle navigates to; when omitted the subtitle is plain text.
 */
export default function EventStageBannerSubtitle(props: EventStageBannerSubtitleProps) {
  return (
    <p className="event-stage-banner-subtitle m-0 whitespace-normal font-semibold break-words text-[normal] text-black/[0.87]">
      {props.to ? (
        <Link
          to={props.to}
          className="text-inherit no-underline transition-opacity hover:opacity-70"
        >
          {props.text}
        </Link>
      ) : (
        props.text
      )}
    </p>
  )
}
