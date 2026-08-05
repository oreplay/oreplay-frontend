import { Stack, Typography } from "@mui/material"
import CancelIcon from "@mui/icons-material/Close"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
interface PasswordChecklistProps {
  checks: {
    label: string
    valid: boolean
  }[]
}

export default function PasswordChecklist({ checks }: PasswordChecklistProps) {
  return (
    <Stack sx={{ width: "100%", mt: 1, ml: 3 }} spacing={0.5}>
      {checks.map((check) => (
        <Stack
          key={check.label}
          direction="row"
          spacing={1}
          sx={{ width: "100%", alignItems: "center" }}
        >
          {check.valid ? (
            <CheckCircleIcon fontSize="small" color="success" />
          ) : (
            <CancelIcon fontSize="small" color="error" />
          )}
          <Typography variant="caption" color={check.valid ? "success.main" : "error.main"}>
            {check.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}
