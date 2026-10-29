import { SvgIconComponent } from "@mui/icons-material"

interface InlineMenuIconProps {
  Icon: SvgIconComponent
}

/**
 * Icon sized and aligned to sit inside a line of text, so a sentence can point at the button or menu
 * entry it talks about. It is decorative: the sentence around it must make sense without it.
 * @param props.Icon MUI icon to show.
 */
export default function InlineMenuIcon({ Icon }: InlineMenuIconProps) {
  return (
    <Icon
      aria-hidden
      fontSize="inherit"
      sx={{ color: "text.primary", fontSize: "1.25em", verticalAlign: "text-bottom" }}
    />
  )
}
