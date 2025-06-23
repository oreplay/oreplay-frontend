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
} from "@mui/material"

function PrivacyPolicy() {
  const { t } = useTranslation("PrivacyPolicy")

  const PrivacyPolicyTheme = (theme: Theme) =>
    createTheme({
      ...theme,
      typography: {
        h1: {
          fontSize: 36,
          fontWeight: 500,
          marginBottom: "1rem",
        },
        h2: {
          marginTop: "48px",
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
    <ThemeProvider theme={PrivacyPolicyTheme}>
      <Container sx={{ marginBottom: "20px" }}>
        <Typography variant="h1">{t("header")}</Typography>
        <Typography variant={"subtitle1"}>{t("subtitle")}</Typography>
        <Typography align="justify">{t("p1")}</Typography>
        <Typography variant="h2">{t("Identification.title")}</Typography>
        <Typography align="justify">{t("Identification.p1")}</Typography>
        <Typography variant="h2">{t("Responsibleprocessor.title")}</Typography>
        <Typography>{t("Responsibleprocessor.p1")}</Typography>
        <Typography variant="h2">{t("Comercialname.title")}</Typography>
        <Typography>{t("Comercialname.p1")}</Typography>
        <Typography variant="h2">{t("Communication.title")}</Typography>
        <Typography align="justify">{t("Communication.p1")}</Typography>
        <Typography>
          ●{" "}
          <Trans
            t={t}
            i18nKey="Communication.contact.email"
            components={{ 2: <Link href="mailto:support@oreplay.es" /> }}
          />
        </Typography>
        <Typography align="justify">{t("Communication.p2")}</Typography>
        <Typography variant="h2">{t("Registrationregulation.title")}</Typography>
        <Typography align="justify">{t("Registrationregulation.p1")}</Typography>
        <Typography variant="h2">{t("Applicability.title")}</Typography>
        <Typography align="justify">{t("Applicability.p1")}</Typography>
        <Typography variant="h2">{t("Changesforuser.title")}</Typography>
        <Typography align="justify">{t("Changesforuser.p1")}</Typography>
        <Typography variant="h2">{t("Securitymeasures.title")}</Typography>
        <Typography>{t("Securitymeasures.p1")}</Typography>
        <List>
          {Array.from({ length: 6 }).map((_, i) => (
            <ListItem key={i}>
              <Typography align="justify" component="span">
                ● {t(`Securitymeasures.list.item${i + 1}`)}
              </Typography>
            </ListItem>
          ))}
        </List>
        <Typography variant="h2">{t("Treatmentprinciples.title")}</Typography>
        <Typography align="justify">{t("Treatmentprinciples.p1")}</Typography>
        <List>
          {Array.from({ length: 4 }).map((_, i) => (
            <ListItem key={i}>
              <Typography align="justify" component="span">
                ● {t(`Treatmentprinciples.list.item${i + 1}`)}
              </Typography>
            </ListItem>
          ))}
        </List>
        <Typography variant="h2">{t("Legalbases.title")}</Typography>
        <Typography align="justify">{t("Legalbases.p1")}</Typography>
        <Typography variant="h2">{t("Treatments.title")}</Typography>
        <Typography align="justify">{t("Treatments.p1")}</Typography>
        <Typography align="justify">{t("Treatments.p2")}</Typography>
        <Typography align="justify">{t("Treatments.p3")}</Typography>
        <Typography align="justify">
          <Trans
            t={t}
            i18nKey="Treatments.p4"
            components={{ 2: <Link href="mailto:support@oreplay.es" /> }}
          />
        </Typography>
        <Typography variant="h2">{t("Howweuseyourdata.title")}</Typography>
        <Typography align="justify">{t("Howweuseyourdata.p1")}</Typography>
        <Typography align="justify">{t("Howweuseyourdata.p2")}</Typography>
        <Typography align="justify">{t("Howweuseyourdata.p3")}</Typography>
        <Typography align="justify">
          <Trans
            t={t}
            i18nKey="Howweuseyourdata.p4"
            components={{ 2: <Link href="mailto:support@oreplay.es" /> }}
          />
        </Typography>
        <Typography align="justify">{t("Howweuseyourdata.p5")}</Typography>
        <Typography align="justify">{t("Howweuseyourdata.p6")}</Typography>
        <TableContainer component={Paper} sx={{ marginTop: 2, marginBottom: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ minHeight: 50 }}>
                <TableCell
                  sx={{ width: 100, maxWidth: 100, whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  <strong>{t("Howweuseyourdata.tableHeaders.category")}</strong>
                </TableCell>
                <TableCell
                  sx={{ width: 400, maxWidth: 400, whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  <strong>{t("Howweuseyourdata.tableHeaders.purpose")}</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[0, 1, 2].map((i) => (
                <TableRow key={i} sx={{ minHeight: 50 }}>
                  <TableCell
                    sx={{ width: 100, maxWidth: 100, whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    {t(`Howweuseyourdata.data_categories.${i}.Category`)}
                  </TableCell>
                  <TableCell
                    sx={{ width: 400, maxWidth: 400, whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    {t(`Howweuseyourdata.data_categories.${i}.Purpose`)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography>{t("Howweuseyourdata.p7")}</Typography>
        <TableContainer component={Paper} sx={{ marginTop: 2, marginBottom: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ minHeight: 50 }}>
                <TableCell
                  sx={{ width: 100, maxWidth: 100, whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  <strong>{t("Howweuseyourdata.tableHeaders.category")}</strong>
                </TableCell>
                <TableCell
                  sx={{ width: 400, maxWidth: 400, whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  <strong>{t("Howweuseyourdata.tableHeaders.baselegitimator")}</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[0, 1, 2].map((i) => (
                <TableRow key={i} sx={{ minHeight: 50 }}>
                  <TableCell
                    sx={{ width: 100, maxWidth: 100, whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    {t(`Howweuseyourdata.legal_bases.${i}.Category`)}
                  </TableCell>
                  <TableCell
                    sx={{ width: 400, maxWidth: 400, whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    {t(`Howweuseyourdata.legal_bases.${i}.baselegitimator`)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography>{t("Howweuseyourdata.p8")}</Typography>
        <TableContainer component={Paper} sx={{ marginTop: 2, marginBottom: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ minHeight: 50 }}>
                <TableCell
                  sx={{ width: 100, maxWidth: 100, whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  <strong>{t("Howweuseyourdata.tableHeaders.category")}</strong>
                </TableCell>
                <TableCell
                  sx={{ width: 400, maxWidth: 400, whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  <strong>{t("Howweuseyourdata.tableHeaders.datacollect")}</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[0, 1, 2].map((i) => (
                <TableRow key={i} sx={{ minHeight: 50 }}>
                  <TableCell
                    sx={{ width: 100, maxWidth: 100, whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    {t(`Howweuseyourdata.data_collected.${i}.Category`)}
                  </TableCell>
                  <TableCell
                    sx={{ width: 400, maxWidth: 400, whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    {t(`Howweuseyourdata.data_collected.${i}.Datacollect`)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography>{t("Howweuseyourdata.p9")}</Typography>
        <TableContainer component={Paper} sx={{ marginTop: 2, marginBottom: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ minHeight: 50 }}>
                <TableCell
                  sx={{ width: 100, maxWidth: 100, whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  <strong>{t("Howweuseyourdata.tableHeaders.category")}</strong>
                </TableCell>
                <TableCell
                  sx={{ width: 400, maxWidth: 400, whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  <strong>{t("Howweuseyourdata.tableHeaders.consequences_header")}</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[0, 1, 2].map((i) => (
                <TableRow key={i} sx={{ minHeight: 50 }}>
                  <TableCell
                    sx={{ width: 100, maxWidth: 100, whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    {t(`Howweuseyourdata.consequences.${i}.Category`)}
                  </TableCell>
                  <TableCell
                    sx={{ width: 400, maxWidth: 400, whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    {t(`Howweuseyourdata.consequences.${i}.Consequences`)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography>{t("Howweuseyourdata.p10")}</Typography>
        <TableContainer component={Paper} sx={{ marginTop: 2, marginBottom: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ minHeight: 50 }}>
                <TableCell
                  sx={{ width: 100, maxWidth: 100, whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  <strong>{t("Howweuseyourdata.tableHeaders.category")}</strong>
                </TableCell>
                <TableCell
                  sx={{ width: 400, maxWidth: 400, whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  <strong>{t("Howweuseyourdata.tableHeaders.possibletransfers")}</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[0, 1, 2].map((i) => (
                <TableRow key={i} sx={{ minHeight: 50 }}>
                  <TableCell
                    sx={{ width: 100, maxWidth: 100, whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    {t(`Howweuseyourdata.data_sharing.${i}.Category`)}
                  </TableCell>
                  <TableCell
                    sx={{ width: 400, maxWidth: 400, whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    {t(`Howweuseyourdata.data_sharing.${i}.possibletransfers`)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography>{t("Howweuseyourdata.p11")}</Typography>
        <TableContainer component={Paper} sx={{ marginTop: 2, marginBottom: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ minHeight: 50 }}>
                <TableCell
                  sx={{ width: 100, maxWidth: 100, whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  <strong>{t("Howweuseyourdata.tableHeaders.category")}</strong>
                </TableCell>
                <TableCell
                  sx={{ width: 400, maxWidth: 400, whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  <strong>{t("Howweuseyourdata.tableHeaders.internationaltransfer")}</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[0, 1, 2].map((i) => (
                <TableRow key={i} sx={{ minHeight: 50 }}>
                  <TableCell
                    sx={{ width: 100, maxWidth: 100, whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    {t(`Howweuseyourdata.international_transfers.${i}.Category`)}
                  </TableCell>
                  <TableCell
                    sx={{ width: 400, maxWidth: 400, whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    {t(`Howweuseyourdata.international_transfers.${i}.internationaltransfer`)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography>{t("Howweuseyourdata.p12")}</Typography>
        <TableContainer component={Paper} sx={{ marginTop: 2, marginBottom: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ minHeight: 50 }}>
                <TableCell
                  sx={{ width: 100, maxWidth: 100, whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  <strong>{t("Howweuseyourdata.tableHeaders.category")}</strong>
                </TableCell>
                <TableCell
                  sx={{ width: 400, maxWidth: 400, whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  <strong>{t("Howweuseyourdata.tableHeaders.deadlinesConservation")}</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[0, 1, 2].map((i) => (
                <TableRow key={i} sx={{ minHeight: 50 }}>
                  <TableCell
                    sx={{ width: 100, maxWidth: 100, whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    {t(`Howweuseyourdata.data_retention.${i}.Category`)}
                  </TableCell>
                  <TableCell
                    sx={{ width: 400, maxWidth: 400, whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    {t(`Howweuseyourdata.data_retention.${i}.deadlinesConservation`)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h2">{t("Otheraspectsdataaccession.title")}</Typography>
        <Typography align="justify">{t("Otheraspectsdataaccession.p1")}</Typography>
        <Typography variant="h2">{t("Storage.title")}</Typography>
        <Typography align="justify">{t("Storage.p1")}</Typography>
        <Typography align="justify">{t("Storage.p2")}</Typography>
        <Typography variant="h2">{t("Consents.title")}</Typography>
        <Typography align="justify">{t("Consents.p1")}</Typography>
        <Typography variant="h2">{t("Maymodifyorwithdrawconsents.title")}</Typography>
        <Typography align="justify">{t("Maymodifyorwithdrawconsents.p1")}</Typography>
        <Typography align="justify">
          <Trans
            t={t}
            i18nKey="Maymodifyorwithdrawconsents.p2"
            components={{ 2: <Link href="mailto:support@oreplay.es" /> }}
          />
        </Typography>
        <Typography variant="h2">{t("Automateddecisions.title")}</Typography>
        <Typography align="justify">{t("Automateddecisions.p1")}</Typography>
        <Typography variant="h2">{t("Statisticalstudies.title")}</Typography>
        <Typography align="justify">{t("Statisticalstudies.p1")}</Typography>
        <Typography variant="h2">{t("Personaldataviolationnotice.title")}</Typography>
        <Typography align="justify">{t("Personaldataviolationnotice.p1")}</Typography>
        <Typography align="justify">{t("Personaldataviolationnotice.p2")}</Typography>
        <Typography variant="h2">{t("Dataprotectionrights.title")}</Typography>
        <Typography align="justify">{t("Dataprotectionrights.p1")}</Typography>
        <List>
          {Array.from({ length: 5 }).map((_, i) => (
            <ListItem key={i}>
              <Typography align="justify" component="span">
                ● {t(`Dataprotectionrights.list.item${i + 1}`)}
              </Typography>
            </ListItem>
          ))}
        </List>
        <Typography align="justify">{t("Dataprotectionrights.p2")}</Typography>
        <Typography variant="h2">{t("Childrendatacollection.title")}</Typography>
        <Typography align="justify">
          <Trans
            t={t}
            i18nKey="Childrendatacollection.p1"
            components={{ 2: <Link href="mailto:support@oreplay.es" /> }}
          />
        </Typography>
        <Typography variant="h2">{t("Specialdataandconvictions.title")}</Typography>
        <Typography align="justify">{t("Specialdataandconvictions.p1")}</Typography>
        <Typography variant="h2">{t("Imageswebsiteimages.title")}</Typography>
        <Typography align="justify">
          <Trans
            t={t}
            i18nKey="Imageswebsiteimages.p1"
            components={{ 2: <Link href="mailto:support@oreplay.es" /> }}
          />
        </Typography>
        <Typography variant="h2">{t("Complaintenforcementauthority.title")}</Typography>
        <Typography align="justify">
          <Trans
            t={t}
            i18nKey="Complaintenforcementauthority.p1"
            components={{
              2: <Link href="https://www.agpd.es" target="_blank" rel="noopener noreferrer" />,
            }}
          />
        </Typography>
        <Typography align="justify">{t("Complaintenforcementauthority.p2")}</Typography>
        <Typography align="center" variant="body2" sx={{ marginTop: 5, marginBottom: 5 }}>
          {t("Rights.footer")}
        </Typography>
      </Container>
    </ThemeProvider>
  )
}

export default PrivacyPolicy
