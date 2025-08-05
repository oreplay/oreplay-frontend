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
} from "@mui/material"

export default function AboutUs() {
  const { t } = useTranslation("about-us")

  const aboutUsTheme = (theme: Theme) =>
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
        h4: {
          fontWeight: 500,
          marginBottom: "10px",
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

  const styles = {
    authorsNames: { fontWeight: "bold" },
  }

  return (
    <ThemeProvider theme={aboutUsTheme}>
      <Container sx={{ marginBottom: "20px" }}>
        <Typography variant={"h1"}>{t("Header")}</Typography>
        <Typography variant={"subtitle1"}>{t("subtitle")}</Typography>
        <Typography>{t("Introduction.p1")}</Typography>
        <Typography>{t("Introduction.p2")}</Typography>
        <Typography>{t("Introduction.p3")}</Typography>
        <Typography>
          <Trans t={t} i18nKey="Introduction.p4">
            We are open source, so all of our code is freely and publicly available on{" "}
            <Link href="https://github.com/oreplay/" target="_blank" rel="noopener noreferrer">
              GitHub
            </Link>
            string
            <Link
              href="https://hosted.weblate.org/projects/o-replay/"
              target="_blank"
              rel="noopener noreferrer"
            >
              weblate
            </Link>
          </Trans>
        </Typography>
        <Typography variant={"h2"}>{t("OngoingProject.title")}</Typography>
        <Typography>{t("OngoingProject.p1")}</Typography>
        <Typography variant={"h3"}>{t("OngoingProject.SupportedDisciplines.title")}</Typography>
        <Typography>{t("OngoingProject.SupportedDisciplines.p1")}</Typography>
        <List>
          <ListItem>
            <Typography component={"span"}>
              {`✅ ${t("OngoingProject.SupportedDisciplines.list1.item1")}`}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component={"span"}>
              {`✅ ${t("OngoingProject.SupportedDisciplines.list1.item2")}`}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component={"span"}>
              {`❌ ${t("OngoingProject.SupportedDisciplines.list1.item3")}`}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component={"span"}>
              {`❌ ${t("OngoingProject.SupportedDisciplines.list1.item4")}`}
            </Typography>
          </ListItem>
        </List>
        <Typography variant={"h3"}>{t("OngoingProject.AvailableFeatures.title")}</Typography>
        <Typography>{t("OngoingProject.AvailableFeatures.p1")}</Typography>
        <List>
          <ListItem>
            <Typography component={"span"}>
              {`✅ ${t("OngoingProject.AvailableFeatures.list1.item1")}`}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component={"span"}>
              {`✅ ${t("OngoingProject.AvailableFeatures.list1.item2")}`}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component={"span"}>
              {`✅ ${t("OngoingProject.AvailableFeatures.list1.item3")}`}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component={"span"}>
              {`✅ ${t("OngoingProject.AvailableFeatures.list1.item4")}`}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component={"span"}>
              {`✅ ${t("OngoingProject.AvailableFeatures.list1.item5")}`}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component={"span"}>
              {`❌ ${t("OngoingProject.AvailableFeatures.list1.item6")}`}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component={"span"}>
              {`❌ ${t("OngoingProject.AvailableFeatures.list1.item7")}`}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component={"span"}>
              {`❌ ${t("OngoingProject.AvailableFeatures.list1.item8")}`}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component={"span"}>
              {`✅ ${t("OngoingProject.AvailableFeatures.list1.item9")}`}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component={"span"}>
              {`❌ ${t("OngoingProject.AvailableFeatures.list1.item10")}`}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component={"span"}>
              {`✅ ${t("OngoingProject.AvailableFeatures.list1.item11")}`}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component={"span"}>
              <Trans i18nKey="OngoingProject.AvailableFeatures.list1.item12" t={t}>
                {"❌ "}
                Direct integration with online controls providers (such as{" "}
                <Link href="https://roc.olresultat.se/" target="_blank" rel="noopener noreferrer">
                  ROC
                </Link>{" "}
                and{" "}
                <Link href="https://www.jaruori.es" target="_blank" rel="noopener noreferrer">
                  CPI
                </Link>
                )
              </Trans>
            </Typography>
          </ListItem>
        </List>
        <Typography variant={"h2"}>{t("Authors.title")}</Typography>
        <Typography>
          <Trans t={t} i18nKey={"Authors.p1"}>
            The project is led by
            <Typography component="span" sx={styles.authorsNames}>
              Sergio García Pajares
            </Typography>
            (user interface and webpage),
            <Typography component="span" sx={styles.authorsNames}>
              Adrián Pérez Alonso
            </Typography>
            (servers and data processing), and
            <Typography component="span" sx={styles.authorsNames}>
              Javier Arufe Varela
            </Typography>
            (data uploading).
          </Trans>
        </Typography>
        <Typography>
          <Trans t={t} i18nKey={"Authors.p2"}>
            The full contributors list includes:
            <Typography component="span" sx={styles.authorsNames}>
              name
            </Typography>
            ,
            <Typography component="span" sx={styles.authorsNames}>
              name
            </Typography>
            ,
            <Typography component="span" sx={styles.authorsNames}>
              name
            </Typography>
            ,
            <Typography component="span" sx={styles.authorsNames}>
              name
            </Typography>
            ,
            <Typography component="span" sx={styles.authorsNames}>
              name
            </Typography>
            ,
            <Typography component="span" sx={styles.authorsNames}>
              name
            </Typography>
            ,
            <Typography component="span" sx={styles.authorsNames}>
              name
            </Typography>
            ,
            <Typography component="span" sx={styles.authorsNames}>
              name
            </Typography>
            ,
            <Typography component="span" sx={styles.authorsNames}>
              name
            </Typography>
            ,
            <Typography component="span" sx={styles.authorsNames}>
              name
            </Typography>
            ,
            <Typography component="span" sx={styles.authorsNames}>
              name
            </Typography>
            , and
            <Typography component="span" sx={styles.authorsNames}>
              name
            </Typography>
            . We are a group of spanish orienteers and time keepers.
          </Trans>
        </Typography>
        <Typography variant={"h3"}>{t("Authors.Acknowledgements.title")}</Typography>
        <Typography>
          <Trans t={t} i18nKey={"Authors.Acknowledgements.p1"}>
            We want to thank{" "}
            <Typography component={"span"} sx={styles.authorsNames}>
              Paula Padilla Fernández
            </Typography>{" "}
            (original logo design) and
            <Typography component={"span"} sx={styles.authorsNames}>
              José Luis Tribiño Fernández
            </Typography>{" "}
            (beta testing).
          </Trans>
        </Typography>
        <Typography>
          <Trans t={t} i18nKey={"Authors.Acknowledgements.p2"}>
            We also extend our gratitude to{" "}
            <Typography component={"span"} sx={styles.authorsNames}>
              FEGADO (Spanish Galician Orienteering Federation)
            </Typography>{" "}
            for supporting some costs of the project.
          </Trans>
        </Typography>
      </Container>
    </ThemeProvider>
  )
}
