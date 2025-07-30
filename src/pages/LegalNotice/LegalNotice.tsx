import { Trans, useTranslation } from "react-i18next"
import {
  Container,
  createTheme,
  Link,
  List,
  ListItem,
  Theme,
  ThemeProvider,
  Typography,
  Box,
} from "@mui/material"

function LegalNotice() {
  const { t } = useTranslation("LegalNotice")

  const communicationData = [
    {
      key: "item1",
      href: "mailto:support@oreplay.es",
    },
  ]

  const LegalNoticeTheme = (theme: Theme) =>
    createTheme({
      ...theme,
      typography: {
        h1: {
          fontSize: 36,
          fontWeight: 500,
          marginBottom: "1rem",
        },
        h2: {
          marginTop: "40px",
          fontWeight: 500,
          marginBottom: "16px",
          fontSize: 26,
        },
        h3: {
          fontWeight: 500,
          marginBottom: "12px",
          fontSize: 20,
        },
        body1: {
          marginTop: "8px",
          marginBottom: "8px",
        },
        subtitle1: {
          fontWeight: "bold",
          color: "secondary.main",
        },
      },
    })

  return (
    <ThemeProvider theme={LegalNoticeTheme}>
      <Container sx={{ marginBottom: "20px", "& p": { textAlign: "justify" } }}>
        <Typography variant="h1">{t("header")}</Typography>
        <Typography variant="subtitle1">{t("subtitle")}</Typography>
        <Typography variant="h2">{t("LegalNotice.title")}</Typography>
        <Typography>{t("LegalNotice.p1")}</Typography>
        <Typography>{t("LegalNotice.p2")}</Typography>
        <Typography variant="h2">{t("Identification.title")}</Typography>
        <Typography>{t("Identification.p1")}</Typography>
        <List>
          {Array.from({ length: 2 }).map((_, i) => (
            <ListItem key={i}>
              {/* eslint-disable-next-line i18next/no-literal-string */}
              <Typography component="span">● {t(`Identification.list.item${i + 1}`)}</Typography>
            </ListItem>
          ))}
        </List>
        <Typography variant="h2">{t("Communication.title")}</Typography>
        <Typography>{t("Communication.p1")}</Typography>
        <List sx={{ paddingLeft: 2 }}>
          {communicationData.map((item, i) => (
            <ListItem key={i} sx={{ display: "list-item", paddingLeft: 0 }}>
              {/* eslint-disable-next-line i18next/no-literal-string */}
              <Typography component="span" sx={{ verticalAlign: "middle", mr: 0.5 }}>
                ●
              </Typography>
              <Typography component="span">
                <Trans
                  i18nKey={`Communication.list.${item.key}`}
                  t={t}
                  components={{
                    0: <strong />,
                    2: (
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        underline="hover"
                      />
                    ),
                  }}
                />
              </Typography>
            </ListItem>
          ))}
        </List>
        <Typography>{t("Communication.p2")}</Typography>
        <Typography>{t("Communication.p3")}</Typography>
        <Typography variant="h2">{t("Navigation.title")}</Typography>
        <Typography>{t("Navigation.p1")}</Typography>
        <Typography>{t("Navigation.p2")}</Typography>
        <Typography>{t("Navigation.p3")}</Typography>
        <Typography>{t("Navigation.p4")}</Typography>
        <Typography>{t("Navigation.p5")}</Typography>
        <Typography>{t("Navigation.p6")}</Typography>
        <Typography variant="h2">{t("IntellectualProperty.title")}</Typography>
        <Typography>{t("IntellectualProperty.p1")}</Typography>
        <Typography variant="h2">{t("CommercialCommunications.title")}</Typography>
        <Typography>
          <Trans
            t={t}
            i18nKey="CommercialCommunications.p1"
            components={{ 2: <Link href="mailto:support@oreplay.es" /> }}
          />
        </Typography>
        <Typography>{t("CommercialCommunications.p2")}</Typography>
        <Typography variant="h2">{t("Cookies.title")}</Typography>
        <Typography>
          <Trans
            t={t}
            i18nKey="Cookies.p1"
            components={{
              2: <Link href={"cookies-policy"} target="_blank" rel="noopener noreferrer" />,
            }}
          />
        </Typography>
        <Typography variant="h2">{t("PersonalProtection.title")}</Typography>
        <Typography>
          <Trans
            t={t}
            i18nKey="PersonalProtection.p1"
            components={{
              2: <Link href={"privacy-policy"} target="_blank" rel="noopener noreferrer" />,
            }}
          />
        </Typography>
        <Typography variant="h2">{t("LiabilityExclusion.title")}</Typography>
        <Typography>{t("LiabilityExclusion.p1")}</Typography>
        <Typography>{t("LiabilityExclusion.p2")}</Typography>
        <Typography>{t("LiabilityExclusion.p3")}</Typography>
        <Typography variant="h2">{t("Legal.title")}</Typography>
        <Typography>{t("Legal.p1")}</Typography>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5, marginBottom: 5 }}>
          <Typography variant="body2">{t("Rights.footer")}</Typography>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default LegalNotice
