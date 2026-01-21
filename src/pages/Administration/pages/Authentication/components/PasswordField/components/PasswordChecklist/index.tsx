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
    <Stack spacing={0.5} mt={1} width={"100%"} ml={3}>
      {checks.map((check) => (
        <Stack key={check.label} direction="row" alignItems="center" spacing={1} width={"100%"}>
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
