import { useState, FocusEvent } from "react"
import TextField from "@mui/material/TextField"
import { useTranslation } from "react-i18next"

interface WebsiteFieldProps {
  eventDetail?: { website?: string }
  style_props?: Record<string, unknown>
}

interface ValidationError {
  url: boolean
  length: boolean
}

export default function WebsiteField({ eventDetail, style_props }: WebsiteFieldProps) {
  const MAX_LENGTH = 120
  const [error, setError] = useState<ValidationError>({ url: false, length: false })
  const { t } = useTranslation()

  const validateURL = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.trim()

    setError({
      url: !!value && !validateURL(value), // invalid URL only if not empty
      length: value.length > MAX_LENGTH, // too long
    })
  }

  const errorMessage =
    error.url && error.length
      ? `${t("EventAdmin.InvalidURLMsg")} ${t("EventAdmin.TooLongMsg", { count: MAX_LENGTH })}`
      : error.url
        ? t("EventAdmin.InvalidURLMsg")
        : error.length
          ? t("EventAdmin.TooLongMsg", { count: MAX_LENGTH })
          : ""

  return (
    <TextField
      fullWidth
      id="website"
      name="website"
      label={t("EventAdmin.Website")}
      {...style_props}
      autoComplete="url"
      defaultValue={eventDetail?.website ?? ""}
      error={error.url || error.length}
      helperText={errorMessage}
      onBlur={handleBlur}
    />
  )
}
