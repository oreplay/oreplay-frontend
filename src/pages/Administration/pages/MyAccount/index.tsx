import { Box, Container, Divider, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../../../shared/hooks.ts"
import UserPersonalInformationForm from "./components/UserDetailsGrid"

export default function UserAdministrationPage() {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <Box sx={{ height: "100%", backgroundColor: "#f6f6f6", py: 6 }}>
      <Container maxWidth="md">
        <Typography component="h1" variant="h5" fontWeight={600} gutterBottom>
          {t("MyAccount.title")}
        </Typography>
        <Typography component="p" variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {t("MyAccount.description")}
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <Typography component="h2" variant="h6" fontWeight={500} sx={{ mb: 2 }}>
          {t("MyAccount.personalInformation.title")}
        </Typography>
        <UserPersonalInformationForm user={user!} />
      </Container>
    </Box>
  )
}
