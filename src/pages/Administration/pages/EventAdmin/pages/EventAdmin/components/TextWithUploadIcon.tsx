import { Trans, useTranslation } from "react-i18next"
import InlineUploadIcon from "./InlineUploadIcon.tsx"

interface TextWithUploadIconProps {
  i18nKey: string
}

export default function TextWithUploadIcon({ i18nKey }: TextWithUploadIconProps) {
  const { t } = useTranslation()

  return <Trans t={t} i18nKey={i18nKey} components={{ uploadIcon: <InlineUploadIcon /> }} />
}
