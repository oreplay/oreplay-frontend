import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Download as DownloadIcon, QrCode as QrCodeIcon } from "@mui/icons-material";
import QRCodeStyling from "qr-code-styling";
import { useTranslation } from "react-i18next";
import { API_DOMAIN } from "../services/ApiConfig.ts";
import { HorizontalLogo } from "../assets/HorizontalLogo.tsx";

interface QRCodeSectionProps {
  eventId: string;
  eventName?: string;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ eventId, eventName }) => {
  const { t } = useTranslation();
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const qrRef = useRef<HTMLDivElement>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const eventUrl = `${API_DOMAIN}competitions/${eventId}`;

  useEffect(() => {
    const createQRCode = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const qr = new QRCodeStyling({
          width: 200,
          height: 200,
          type: "canvas",
          data: eventUrl,
          dotsOptions: { color: "#000000", type: "rounded" },
          backgroundOptions: { color: "#ffffff" },
          cornersSquareOptions: { color: "#000000", type: "extra-rounded" },
          cornersDotOptions: { color: "#000000", type: "dot" },
          qrOptions: { errorCorrectionLevel: "M" },
        });

        try {
          const logoResponse = await fetch("/logo.svg");
          if (logoResponse.ok) {
            const logoSvg = await logoResponse.text();
            const logoBlob = new Blob([logoSvg], { type: "image/svg+xml" });
            const logoUrl = URL.createObjectURL(logoBlob);

            qr.update({
              image: logoUrl,
              imageOptions: { crossOrigin: "anonymous", margin: 3, imageSize: 0.3 },
            });

            setTimeout(() => URL.revokeObjectURL(logoUrl), 5000);
          }
        } catch {
          console.warn("Logo could not be loaded, generating QR code without logo");
        }

        setQrCode(qr);

        if (qrRef.current) {
          qrRef.current.innerHTML = "";
          qr.append(qrRef.current);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error creating QR code:", err);
        setError(t("EventAdmin.QRCode.Generating"));
        setIsLoading(false);
      }
    };

    if (eventId) {
      void createQRCode();
    }
  }, [eventId, eventUrl, t]);

  const handleDownload = async () => {
    if (!qrCode || !qrContainerRef.current) {
      setError(t("EventAdmin.QRCode.Download"));
      return;
    }

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(qrContainerRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 400,
        height: 600,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `oreplay-event-${eventId}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, "image/png", 1.0);
    } catch (err) {
      console.error("Error downloading QR code:", err);
      setError(t("EventAdmin.QRCode.Download"));
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <Card variant="outlined" sx={{ marginY: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <QrCodeIcon sx={{ marginRight: 1, color: "primary.main" }} />
          <Typography variant="h6" component="h3">
            {t("EventAdmin.QRCode.Title")}
          </Typography>
        </Box>

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
          {/* QR Code Container with Orange Gradient */}
          <Box
            ref={qrContainerRef}
            sx={{
              background: "linear-gradient(180deg, #FF9454 0%, #FB6D26 100%)",
              borderRadius: 4,
              padding: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 250,
              boxShadow: 2,
            }}
          >
            {/* White Inner Container for QR Code */}
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                padding: 0.5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 220,
                minWidth: 220,
                marginBottom: 1,
              }}
            >
              {isLoading && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary">
                    {t("EventAdmin.QRCode.Generating")}
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

            {/* White Horizontal Logo at Bottom */}
            <HorizontalLogo
              sx={{
                fontSize: 120,
                width: 200,
                height: "auto",
                marginTop: 1,
                filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.2))",
                "& path": { fill: "white !important" },
              }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 250 }}>
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
              <Button variant="outlined" onClick={() => void copyUrl()} disabled={isLoading} fullWidth>
                {t("EventAdmin.QRCode.CopyUrl")}
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ marginTop: 2, display: "block" }}>
              {t("EventAdmin.QRCode.Instructions")}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QRCodeSection;
