import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  IconButton,
} from "@mui/material"
import { Launch, Close } from "@mui/icons-material"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface EditeDetailURLButtonProps {
  url: string | undefined
  marginLeft?: string
  marginRight?: string
}

export default function EditeDetailURLButton({
  url,
  marginLeft,
  marginRight,
}: EditeDetailURLButtonProps) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  if (!url) {
    return <></>
  }

  try {
    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url
    }

    // Validate URL
    const urlObject = new URL(url)
    const fullUrl = urlObject.toString()

    return (
      <>
        <Button
          style={{
            marginLeft,
            marginRight,
          }}
          sx={{
            width: "min-content",
            marginTop: "16px",
            textTransform: "lowercase",
            paddingX: 1,
            paddingY: 0.5,
            borderRadius: "6px",
            color: "text.secondary",
            fontSize: 13,
            gap: 0.5,
            transition: "background-color 0.15s ease, color 0.15s ease",
            "&:hover": {
              backgroundColor: "action.hover",
              color: "text.primary",
            },
            "& .MuiButton-endIcon": {
              marginLeft: 0.25,
              "& svg": { fontSize: 15 },
            },
          }}
          variant="text"
          onClick={() => setOpen(true)}
          endIcon={<Launch />}
        >
          {urlObject.hostname}
        </Button>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="external-link-dialog-title"
          slotProps={{
            paper: {
              sx: {
                minWidth: 360,
              },
            },
          }}
        >
          <DialogTitle
            id="external-link-dialog-title"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pb: 1,
            }}
          >
            {t("URLButtonDialog.title")}
            <IconButton
              onClick={() => setOpen(false)}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Typography sx={{ mb: 1.5 }}>{t("URLButtonDialog.body")}</Typography>
            <Box
              sx={{
                backgroundColor: "action.hover",
                borderRadius: "8px",
                padding: "10px 12px",
              }}
            >
              <Typography
                sx={{
                  wordBreak: "break-all",
                  fontSize: 13,
                  fontFamily: "monospace",
                  color: "text.primary",
                }}
              >
                {fullUrl}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
            <Button
              onClick={() => setOpen(false)}
              sx={{ color: "text.secondary", textTransform: "none" }}
            >
              {t("common:close")}
            </Button>
            <Button
              variant="outlined"
              disableElevation
              endIcon={<Launch />}
              onClick={() => {
                setOpen(false)
                window.open(fullUrl, "_blank", "noopener,noreferrer")
              }}
              sx={{
                textTransform: "none",
                paddingX: 2,
              }}
            >
              {t("URLButtonDialog.openLink")}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  } catch {
    return <></>
  }
}
