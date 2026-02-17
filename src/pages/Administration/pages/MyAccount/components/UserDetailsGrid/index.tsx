import { UserModel } from "../../../../../../shared/EntityTypes.ts"
import { Container, FormLabel, Grid2 as Grid, TextField } from "@mui/material"
import { useTranslation } from "react-i18next"

interface UserDetailsGridProps {
  user: UserModel
}

export default function UserPersonalInformationForm({ user }: UserDetailsGridProps) {
  const { t } = useTranslation()

  return (
    <Container sx={{ p: 4, borderRadius: 3, backgroundColor: "white" }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor={"first-name"}>{t("firstName")}</FormLabel>
          <TextField id="firstName" fullWidth value={user.first_name} disabled />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor={"last-name"}>{t("lastName")}</FormLabel>
          <TextField id="lastName" fullWidth value={user.last_name} disabled />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormLabel htmlFor={"email"}>{t("EmailAddress")}</FormLabel>
          <TextField id="email" fullWidth value={user.email} disabled />
        </Grid>
      </Grid>
    </Container>
  )
}
