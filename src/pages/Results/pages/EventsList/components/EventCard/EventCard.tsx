import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import PlaceIcon from "@mui/icons-material/Place"
import { Box, Typography } from "@mui/material"
import ButtonBase from "@mui/material/ButtonBase"
import { useNavigate } from "react-router-dom"
import { Event } from "../../../../../../domain/types/v1api"
import CountryFlag from "../../../../../../components/CountryFlag/CountryFlag.tsx"

export type EventCardVariant = "highlight" | "default"

interface EventCardProps {
  event: Event
  variant: EventCardVariant
  /** Only used when variant is "highlight" — alternates the accent color. */
  colorIndex?: number
  /** Formatted date string, only rendered when variant is "default". */
  formattedDate?: string
}

const HIGHLIGHT_COLORS = ["#3F51B5", "#00897B", "#D84315", "#6A1B9A"] as const

export default function EventCard({
  event,
  variant,
  colorIndex = 0,
  formattedDate,
}: EventCardProps) {
  const navigate = useNavigate()
  const isHighlight = variant === "highlight"

  const accentColor = HIGHLIGHT_COLORS[colorIndex % HIGHLIGHT_COLORS.length]

  return (
    <ButtonBase
      onClick={() => void navigate(`/competitions/${event.id}`)}
      sx={{
        borderRadius: "14px",
        textAlign: "left",
        alignItems: "stretch",
        width: isHighlight ? { xs: "160px", sm: "220px" } : "100%",
        minWidth: isHighlight ? { xs: "160px", sm: "220px" } : undefined,
        flexShrink: isHighlight ? 0 : undefined,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: isHighlight ? "1 / 1" : undefined,
          minHeight: isHighlight ? undefined : "132px",
          borderRadius: "14px",
          padding: isHighlight ? { xs: "14px", sm: "20px" } : "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: isHighlight ? "10px" : "8px",
          boxSizing: "border-box",
          backgroundColor: isHighlight ? accentColor : "background.paper",
          border: isHighlight ? "none" : "1px solid",
          borderColor: isHighlight ? "transparent" : "grey.300",
          boxShadow: isHighlight
            ? `0px 6px 16px ${accentColor}4D`
            : "0px 1px 4px rgba(0, 0, 0, 0.06)",
          transition:
            "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
          "&:hover": {
            transform: isHighlight ? "scale(1.04)" : "translateY(-3px)",
            backgroundColor: isHighlight ? accentColor : "background.paper",
            boxShadow: isHighlight
              ? "0px 10px 22px rgba(0, 0, 0, 0.24)"
              : "0px 8px 20px rgba(0, 0, 0, 0.12)",
            borderColor: isHighlight ? "transparent" : "primary.main",
          },
        }}
      >
        {/** Date row, list variant only **/}
        {!isHighlight && formattedDate ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "primary.main",
              lineHeight: 1,
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: "16px", display: "block" }} />
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, lineHeight: 1 }}>
              {formattedDate}
            </Typography>
          </Box>
        ) : null}

        {/** Date row, highlight variant only **/}
        {isHighlight && formattedDate ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1,
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: "16px", display: "block" }} />
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, lineHeight: 1 }}>
              {formattedDate}
            </Typography>
          </Box>
        ) : null}

        {/** Title **/}
        <Typography
          sx={{
            color: isHighlight ? "white" : "text.primary",
            fontWeight: isHighlight ? 700 : 500,
            fontSize: isHighlight ? { xs: "0.9rem", sm: "1.05rem" } : "0.95rem",
            lineHeight: 1.35,
            textAlign: "left",
            textTransform: "none",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {event.description}
        </Typography>

        {/** Location row, list variant only **/}
        {!isHighlight && event.location ? (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: "4px", width: "100%", lineHeight: 1 }}
          >
            <PlaceIcon
              sx={{ fontSize: "14px", color: "text.secondary", flexShrink: 0, display: "block" }}
            />
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "0.8rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              {event.location}
            </Typography>
          </Box>
        ) : null}

        {/** Organizer + flag **/}
        {event.organizer ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: "6px",
              alignItems: "center",
              justifyContent: "flex-start",
              overflow: "hidden",
              marginTop: "auto",
              paddingTop: "4px",
            }}
          >
            {event.country_code ? (
              <CountryFlag
                code={event.country_code.toLowerCase()}
                slotProps={{ image: { width: "14px" } }}
              />
            ) : null}
            <Typography
              sx={{
                color: isHighlight ? "rgba(255,255,255,0.9)" : "text.secondary",
                fontSize: "0.8rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
            >
              {event.organizer.name}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </ButtonBase>
  )
}
