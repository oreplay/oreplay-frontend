import React, { useEffect, useRef, useState } from "react"
import { Box, Button, Card, CardContent, Typography, Alert, CircularProgress } from "@mui/material"
import { Download as DownloadIcon, QrCode as QrCodeIcon } from "@mui/icons-material"
import QRCodeStyling from "qr-code-styling"
import { useTranslation } from "react-i18next"

interface QRCodeSectionProps {
  eventId: string
  eventName?: string
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ eventId, eventName }) => {
  const { t } = useTranslation()
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const qrRef = useRef<HTMLDivElement>(null)

  const eventUrl = `https://www.oreplay.es/competitions/${eventId}`

  useEffect(() => {
    const createQRCode = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const qr = new QRCodeStyling({
          width: 300,
          height: 300,
          type: "svg",
          data: eventUrl,
          dotsOptions: { color: "#ff710a", type: "rounded" },
          backgroundOptions: { color: "#ffffff" },
          cornersSquareOptions: { color: "#5e2572", type: "extra-rounded" },
          cornersDotOptions: { color: "#5e2572", type: "dot" },
          qrOptions: { errorCorrectionLevel: "M" },
        })

        try {
          const logoResponse = await fetch("/logo.svg")
          if (logoResponse.ok) {
            const logoSvg = await logoResponse.text()
            const logoBlob = new Blob([logoSvg], { type: "image/svg+xml" })
            const logoUrl = URL.createObjectURL(logoBlob)

            qr.update({
              image: logoUrl,
              imageOptions: { crossOrigin: "anonymous", margin: 5, imageSize: 0.3 },
            })

            setTimeout(() => URL.revokeObjectURL(logoUrl), 5000)
          }
        } catch {
          console.warn("Logo could not be loaded, generating QR code without logo")
        }

        setQrCode(qr)

        if (qrRef.current) {
          qrRef.current.innerHTML = ""
          qr.append(qrRef.current)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Error creating QR code:", err)
        setError(t("QRCode.Generating"))
        setIsLoading(false)
      }
    }

    if (eventId) {
      void createQRCode()
    }
  }, [eventId, eventUrl, t])

  const handleDownload = async () => {
    if (!qrCode) {
      setError(t("QRCode.Download"))
      return
    }

    try {
      const rawData = await qrCode.getRawData("png")

      if (rawData) {
        const url = URL.createObjectURL(rawData)
        const link = document.createElement("a")
        link.href = url
        link.download = `oreplay-event-${eventId}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        await qrCode.download({
          name: `oreplay-event-${eventId}`,
          extension: "png",
          width: 800,
          height: 800,
        })
      }
    } catch (err) {
      console.error("Error downloading QR code:", err)
      setError(t("QRCode.Download"))
    }
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl)
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  return (
    <Card variant="outlined" sx={{ marginY: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <QrCodeIcon sx={{ marginRight: 1, color: "primary.main" }} />
          <Typography variant="h6" component="h3">
            {t("QRCode.Title")}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
          {t("QRCode.Description")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "flex-start" },
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
              minWidth: 300,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              backgroundColor: "background.paper",
            }}
          >
            {isLoading && (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                  {t("QRCode.Generating")}
                </Typography>
              </Box>
            )}
            {error && (
              <Alert severity="error" sx={{ margin: 2 }}>
                {error}
              </Alert>
            )}
            <div ref={qrRef} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 250 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
              {t("QRCode.EventUrl")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                marginBottom: 2,
                padding: 1,
                backgroundColor: "grey.100",
                borderRadius: 1,
                wordBreak: "break-all",
                fontFamily: "monospace",
                fontSize: "0.875rem",
              }}
            >
              {eventUrl}
            </Typography>

            {eventName && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                  {t("QRCode.EventName")}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                  {eventName}
                </Typography>
              </>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => void handleDownload}
                disabled={!qrCode || isLoading}
                fullWidth
              >
                {t("QRCode.Download")}
              </Button>

              <Button
                variant="outlined"
                onClick={() => void copyUrl}
                disabled={isLoading}
                fullWidth
              >
                {t("QRCode.CopyUrl")}
              </Button>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ marginTop: 2, display: "block" }}
            >
              {t("QRCode.Instructions")}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default QRCodeSection
