import React, { useEffect, useRef, useState } from "react"
import { Box, Button, Typography, CircularProgress } from "@mui/material"
import DownloadIcon from "@mui/icons-material/Download" // ✅ fixed import
import QRCodeStyling from "qr-code-styling"
import { useTranslation } from "react-i18next"
import { useNotifications } from "@toolpad/core/useNotifications"
import GeneralErrorFallback from "./GeneralErrorFallback.tsx"
// @ts-expect-error no type definitions for this asset
import QRFrame from "../assets/QR-Frame.svg?raw"

const WEBSITE_DOMAIN = import.meta.env.VITE_WEBSITE_DOMAIN

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
  const qrContainerRef = useRef<HTMLDivElement>(null)

  const eventUrl = `${WEBSITE_DOMAIN}competitions/${eventId}`
  const notifications = useNotifications()

  const QRCodeWidth = 210
  const QRCodeHeight = 266

  useEffect(() => {
    const createQRCode = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Create QR code as SVG
        const qr = new QRCodeStyling({
          width: 302.91998, // match your placeholder width
          height: 301.94159, // match your placeholder height
          type: "svg",
          data: eventUrl,
          dotsOptions: { color: "#000000", type: "rounded" },
          backgroundOptions: { color: "transparent" },
          cornersSquareOptions: { color: "#000000", type: "extra-rounded" },
          cornersDotOptions: { color: "#000000", type: "dot" },
          qrOptions: { errorCorrectionLevel: "M" },
        })

        // Optional: add logo
        try {
          const logoResponse = await fetch("/logo.svg")
          if (logoResponse.ok) {
            const logoSvg = await logoResponse.text()
            const logoBlob = new Blob([logoSvg], { type: "image/svg+xml" })
            const logoUrl = URL.createObjectURL(logoBlob)

            qr.update({
              image: logoUrl,
              imageOptions: { crossOrigin: "anonymous", margin: 3, imageSize: 0.6 },
            })

            setTimeout(() => URL.revokeObjectURL(logoUrl), 5000)
          }
        } catch {
          console.warn("Logo could not be loaded, generating QR code without logo")
        }

        // Generate SVG string of QR code
        const qrBlob = await qr.getRawData("svg")
        const qrSvgText = await qrBlob?.text()
        const qrInner = qrSvgText?.replace(/^<svg[^>]*>|<\/svg>$/g, "")

        // Merge into frame SVG by replacing placeholder rect
        // Assume qrFrameSvgText is your raw frame SVG string containing <rect id="qr-placeholder" ... />
        const mergedSvgText = (QRFrame as string).replace(
          /<rect[^>]*id="qr-placeholder"[^>]*\/>/,
          `<g transform="translate(44.590008,44.209202)">${qrInner}</g>`,
        )

        // Inject merged SVG into DOM
        if (qrRef.current) {
          qrRef.current.innerHTML = mergedSvgText
        }

        setQrCode(qr)
        setIsLoading(false)
      } catch (err) {
        console.error("Error creating QR code:", err)
        setError(t("EventAdmin.QRCode.Generating"))
        setIsLoading(false)
      }
    }

    if (eventId) {
      void createQRCode()
    }
  }, [eventId, eventUrl, t])

  const handleDownload = async () => {
    if (!qrCode || !qrContainerRef.current) {
      setError(t("EventAdmin.QRCode.Download"))
      return
    }

    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(qrContainerRef.current, {
        backgroundColor: null,
        scale: 4,
        useCORS: true,
        allowTaint: true,
        width: QRCodeWidth,
        height: QRCodeHeight,
      })

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `oreplay_event_${eventId}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }
        },
        "image/png",
        1.0,
      )
    } catch (err) {
      console.error("Error downloading QR code:", err)
      setError(t("EventAdmin.QRCode.Download"))
    }
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl)
      notifications.show(t("Copied to the clipboard"), {
        severity: "info",
        autoHideDuration: 3000,
      })
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  return (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
        {t("EventAdmin.QRCode.Description")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-start" },
          gap: 3,
        }}
      >
        <Box sx={{ position: "relative" }}>
          {isLoading && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                {t("EventAdmin.QRCode.Generating")}
              </Typography>
            </Box>
          )}

          {error && <GeneralErrorFallback />}

          <Box
            ref={qrContainerRef}
            sx={{
              position: "relative",
              width: QRCodeWidth,
              height: QRCodeHeight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div ref={qrRef} style={{ width: "100%", height: "100%" }} />
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 250 }}>
          {eventName && (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                {t("EventAdmin.QRCode.EventName")}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 2 }}>
                {eventName}
              </Typography>
            </>
          )}

          <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            {t("EventAdmin.QRCode.EventUrl")}
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

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => void handleDownload()}
              disabled={!qrCode || isLoading}
              fullWidth
            >
              {t("EventAdmin.QRCode.Download")}
            </Button>
            <Button
              variant="outlined"
              onClick={() => void copyUrl()}
              disabled={isLoading}
              fullWidth
            >
              {t("EventAdmin.QRCode.CopyUrl")}
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ marginTop: 2, display: "block" }}
          >
            {t("EventAdmin.QRCode.Instructions")}
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default QRCodeSection
