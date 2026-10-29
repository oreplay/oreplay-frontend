import WifiTetheringOffIcon from "@mui/icons-material/WifiTetheringOff"

/**
 * Decorative, greyed-out crossed broadcasting icon, shown once the stage stopped receiving results.
 */
export default function LiveStatusOfflineIcon() {
  return <WifiTetheringOffIcon aria-hidden fontSize="small" sx={{ color: "text.disabled" }} />
}
