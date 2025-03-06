import { Box, Grid, DialogTitle, IconButton, DialogContent, Dialog } from "@mui/material"
import React from "react"
import CloseIcon from "@mui/icons-material/Close"
import { ProcessedRunnerModel } from "./shared/EntityTypes.ts"
import ExperimentalFeatureAlert from "../../../../components/ExperimentalFeatureAlert.tsx"

export type VirtualTicketProps = {
  isTicketOpen: boolean
  runner: ProcessedRunnerModel | null
  handleCloseTicket: () => void
}

type VirtualTicketContainerProps = {
  isTicketOpen: boolean
  runner: ProcessedRunnerModel | null
  handleCloseTicket: () => void
  children?: React.ReactNode
}

export const VirtualTicketContainer: React.FC<VirtualTicketContainerProps> = ({
  isTicketOpen,
  runner,
  handleCloseTicket,
  children,
}) => {

  if (runner) {
    return (
      <Dialog
        open={isTicketOpen}
        onClose={handleCloseTicket}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            height: "calc(100% - 5%)",
            maxWidth: "430px",
            maxHeight: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            marginBottom: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseTicket}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ExperimentalFeatureAlert />
          {runner ? (
            <Box>
              <Grid container spacing={1}>
                {children}
              </Grid>
            </Box>
          ) : (
            ""
          )}
        </DialogContent>
      </Dialog>
    )
  } else {
    return <></>
  }
}
