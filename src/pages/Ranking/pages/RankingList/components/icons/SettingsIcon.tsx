import MuiSettingsIcon from "@mui/icons-material/Settings"

interface SettingsIconProps {
  className?: string
}

// Wrapper around the host's MUI icon; the ranking icon set is still to be defined.
export default function SettingsIcon({ className }: SettingsIconProps) {
  return (
    <MuiSettingsIcon
      fontSize="small"
      aria-hidden="true"
      className={["rk-settings-icon", className].filter(Boolean).join(" ")}
    />
  )
}
