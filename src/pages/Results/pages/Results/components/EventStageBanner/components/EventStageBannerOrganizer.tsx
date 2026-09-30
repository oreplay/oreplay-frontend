import CountryFlag from "../../../../../../../components/CountryFlag/CountryFlag.tsx"

interface EventStageBannerOrganizerProps {
  organizerName: string
  countryCode?: string | null
}

const FLAG_SLOT_PROPS = {
  picture: { display: "flex", alignItems: "center" },
  image: { width: "12px", display: "block" },
}

export default function EventStageBannerOrganizer(props: EventStageBannerOrganizerProps) {
  return (
    <div className="event-stage-banner-organizer flex items-center gap-1.5">
      {props.countryCode && (
        <CountryFlag code={props.countryCode.toLowerCase()} slotProps={FLAG_SLOT_PROPS} />
      )}
      <p className="m-0 whitespace-normal break-words text-[small] font-medium text-[#646464]">
        {props.organizerName}
      </p>
    </div>
  )
}
