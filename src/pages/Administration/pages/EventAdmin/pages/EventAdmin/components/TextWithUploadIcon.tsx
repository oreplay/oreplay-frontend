import { Trans, useTranslation } from "react-i18next"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import InlineMenuIcon from "./InlineMenuIcon.tsx"

interface TextWithUploadIconProps {
  i18nKey: string
}

/**
 * Translated text whose `<uploadIcon/>` tag is replaced by the upload button's icon, so the sentence
 * shows the button it refers to.
 * @param props.i18nKey Key of the text in the default namespace.
 */
export default function TextWithUploadIcon({ i18nKey }: TextWithUploadIconProps) {
  const { t } = useTranslation()

  return (
    <Trans
      t={t}
      i18nKey={i18nKey}
      components={{ uploadIcon: <InlineMenuIcon Icon={UploadFileIcon} /> }}
    />
  )
}
