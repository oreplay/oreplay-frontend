import { IconButton, ListItem, ListItemText, Paper } from "@mui/material"
import SettingsIcon from "@mui/icons-material/Settings"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { RankingsNsRanking } from "@oreplay/api-client"

interface RankingListItemProps {
  ranking: RankingsNsRanking
}

export default function RankingListItem({ ranking }: RankingListItemProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const secondary = `${t("Ranking.List.scoringAlgorithm")}: ${ranking.scoring_algorithm} · ${t(
    "Ranking.List.maxPoints",
  )}: ${ranking.max_points}`

  return (
    <Paper variant="outlined" sx={{ mb: 1.5 }}>
      <ListItem
        secondaryAction={
          <IconButton
            aria-label={t("Ranking.List.editSettings")}
            edge="end"
            onClick={() => void navigate(`${ranking.id}/settings`)}
          >
            <SettingsIcon />
          </IconButton>
        }
      >
        <ListItemText primary={ranking.id} secondary={secondary} />
      </ListItem>
    </Paper>
  )
}
