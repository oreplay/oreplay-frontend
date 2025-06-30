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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material"

function CookiesPolicy() {
  const { t } = useTranslation("CookiesPolicy")

  const cookieManagementLinks = [
    "http://support.google.com/chrome/bin/answer.py?hl=es&answer=95647",
    "https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies",
    "https://support.mozilla.org/es/kb/Deshabilitar%20cookies%20de%20terceros",
    "http://support.apple.com/kb/ph5042",
  ]

  const CookiesPolicyTheme = (theme: Theme) =>
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
    <ThemeProvider theme={CookiesPolicyTheme}>
      <Container sx={{ marginBottom: "20px", "& p": { textAlign: "justify" } }}>
        <Typography variant="h1">{t("header")}</Typography>
        <Typography variant={"subtitle1"}>{t("subtitle")}</Typography>
        <Typography>{t("p1")}</Typography>
        <Typography variant="h2">{t("whatAreCookies.title")}</Typography>
        <Typography>{t("whatAreCookies.p1")}</Typography>
        <Typography>{t("whatAreCookies.p2")}</Typography>
        <Typography variant="h2">{t("cookiesUsed.title")}</Typography>
        <Typography>{t("cookiesUsed.p1")}</Typography>
        <Typography>{t("cookiesUsed.p2")}</Typography>
        <Typography>{t("cookiesUsed.p3")}</Typography>
        <Typography>{t("cookiesUsed.p4")}</Typography>
        <Typography>{t("cookiesUsed.p5")}</Typography>
        <List>
          {Array.from({ length: 5 }).map((_, i) => (
            <ListItem key={i}>
              <Typography component="span">● {t(`cookiesUsed.list1.item${i + 1}`)}</Typography>
            </ListItem>
          ))}
        </List>
        <Typography>{t("cookiesUsed.p6")}</Typography>
        <List>
          {Array.from({ length: 3 }).map((_, i) => (
            <ListItem key={i}>
              <Typography component="span">● {t(`cookiesUsed.list2.item${i + 1}`)}</Typography>
            </ListItem>
          ))}
        </List>
        <Typography variant="h2">{t("thirdPartyCookies.title")}</Typography>
        <Typography>{t("thirdPartyCookies.p1")}</Typography>
        <Typography>{t("thirdPartyCookies.p2")}</Typography>
        <Typography>{t("thirdPartyCookies.p3")}</Typography>
        <Typography>{t("thirdPartyCookies.p4")}</Typography>
        <TableContainer component={Paper} sx={{ marginTop: 2, marginBottom: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ minHeight: 50 }}>
                <TableCell
                  sx={{
                    width: 150,
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    textAlign: "justify",
                  }}
                >
                  <strong>{t("thirdPartyCookies.tableHeaders.name")}</strong>
                </TableCell>
                <TableCell
                  sx={{
                    width: 150,
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    textAlign: "justify",
                  }}
                >
                  <strong>{t("thirdPartyCookies.tableHeaders.duration")}</strong>
                </TableCell>
                <TableCell
                  sx={{
                    width: 300,
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    textAlign: "justify",
                  }}
                >
                  <strong>{t("thirdPartyCookies.tableHeaders.purpose")}</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ minHeight: 50 }}>
                <TableCell>{t("thirdPartyCookies.cookieTable.0.name")}</TableCell>
                <TableCell>{t("thirdPartyCookies.cookieTable.0.duration")}</TableCell>
                <TableCell>{t("thirdPartyCookies.cookieTable.0.purpose")}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h2">{t("cookieManagement.title")}</Typography>
        <Typography>{t("cookieManagement.p1")}</Typography>
        <Typography>{t("cookieManagement.p2")}</Typography>
        <Typography>{t("cookieManagement.p3")}</Typography>
        <Typography variant="h3" sx={{ marginTop: 5 }}>
          {t("cookieManagement.p4")}
        </Typography>
        <List sx={{ paddingLeft: 2 }}>
          {cookieManagementLinks.map((href, i) => (
            <ListItem key={i} sx={{ display: "list-item", paddingLeft: 0 }}>
              <Typography component="span" sx={{ verticalAlign: "middle", mr: 0.5 }}>
                ●
              </Typography>
              <Typography component="span">
                <Trans
                  i18nKey={`cookieManagement.list1.item${i + 1}`}
                  t={t}
                  components={{
                    2: (
                      <Link
                        href={href}
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
        <Typography>{t("cookieManagement.p5")}</Typography>
        <List>
          {Array.from({ length: 5 }).map((_, i) => (
            <ListItem key={i}>
              <Typography component="span">● {t(`cookieManagement.list2.item${i + 1}`)}</Typography>
            </ListItem>
          ))}
        </List>
        <Typography>{t("cookieManagement.p6")}</Typography>
        <Typography>
          <Trans
            t={t}
            i18nKey="cookieManagement.p7"
            components={{
              2: (
                <Link
                  href="http://windows.microsoft.com/es-es/windows-vista/block-or-allow-cookies"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
            }}
          />
        </Typography>
        <Typography variant="h2">{t("changes.title")}</Typography>
        <Typography>{t("changes.p1")}</Typography>
        <Typography variant="h2">{t("privacyLink.title")}</Typography>
        <Typography>
          <Trans
            t={t}
            i18nKey="privacyLink.p1"
            components={{
              2: (
                <Link
                  href="https://www.oreplay.es/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
            }}
          />
        </Typography>
        <Typography variant="h2">{t("contact.title")}</Typography>
        <Typography>
          <Trans
            t={t}
            i18nKey="contact.p1"
            components={{ 2: <Link href="mailto:support@oreplay.es" /> }}
          />
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5, marginBottom: 5 }}>
          <Typography variant="body2">{t("Rights.footer")}</Typography>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default CookiesPolicy
