import { useState } from "react";
import { IconButton, Snackbar } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";

/**
 * Props of CopyToClipBoardButton
 * value: value to be copied
 */
export interface CopyToClipBoardButtonParams {
  value: string;
}

/**
 * Button to copy content to the clipboard with snackbar
 * @prop value: Value to be copied
 */
export function CopyToClipBoardButton(props: CopyToClipBoardButtonParams) {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleClick = () => {
    const response = navigator.clipboard.writeText(props.value);
    response.then(() => setOpen(true));
  };

  return (
    <>
      <Tooltip title={t("Copy")}>
        <IconButton onClick={handleClick}>
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
      <Snackbar
        message={t("Copied to the clipboard")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  );
}
