/**
 * Oversized, faded O-Replay logo mark that decorates the right edge of the event stage banner. It
 * is purely ornamental: it sits behind the banner content, ignores pointer events and is hidden
 * from assistive technology. The banner has to clip it and isolate its stacking context.
 */
export default function EventStageBannerWatermark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 29 29"
      fill="currentColor"
      className="event-stage-banner-watermark pointer-events-none absolute -right-4 top-1/2 -z-10 h-[120%] w-auto sm:-right-2 sm:h-[225%] -translate-y-1/2 text-primary/10"
    >
      <path d="M13.618 22.456c-.704-.089-1.948-.494-2.563-.84-.248-.14-.7-.439-1.002-.667l-.548-.413 2.689-2.76a666 666 0 0 1 5.01-5.088l2.32-2.33.39.3c.498.384 1.26 1.35 1.583 2.009.738 1.506.771 3.413.088 5.202-.695 1.823-2.53 3.557-4.503 4.245-.988.346-2.354.48-3.464.346z" />
      <path d="M27.672 10.18c-1.21-2.903-3.54-5.257-6.849-6.147-2.794-.751-6.02-.16-8.055 2.004-.968 1.025-1.441 2.27-1.734 3.384L8.076 8.57l1.919 7.772 5.722-5.557-2.911-.848c.305-.836 1.076-1.912 2.572-2.608 1.759-.818 5.076-.198 7.225 2.671 1.663 1.954 2.061 4.414 1.571 6.903-.64 3.27-2.777 5.654-5.793 7-3.498 1.561-7.385.751-10.342-1.658-3.046-2.477-4.365-6.587-3.737-10.43.444-2.705 1.872-5.148 3.833-7.026C12.105.992 18.3.186 22.989 3.029c1.457.908-.582-.645-1.102-.907-.754-.384-1.45-.827-2.241-1.139a14 14 0 0 0-2.45-.713 14.7 14.7 0 0 0-5.09-.089C8.658.726 5.57 2.531 3.35 5.236 1.403 7.616.197 10.62.021 13.71c-.21 3.713 1.072 7.48 3.468 10.304 4.097 4.827 11.097 6.341 16.819 3.692 3.59-1.663 6.447-4.886 7.686-8.667.956-2.924.809-6.13-.326-8.857z" />
    </svg>
  )
}
