import { IconButton, InputAdornment, TextField } from "@mui/material"
import { useTranslation } from "react-i18next"
import { ClearIcon } from "@mui/x-date-pickers"
import SearchIcon from "@mui/icons-material/Search"
import Tooltip from "@mui/material/Tooltip"

interface AutocompleteListSearchBarProps {
  value: string
  setValue: (query: string) => void
}

export default function AutocompleteListSearchBar({
  value,
  setValue,
}: AutocompleteListSearchBarProps) {
  const { t } = useTranslation()

  return (
    <TextField
      fullWidth
      placeholder={t("Search.Search")}
      variant="outlined"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      sx={{ marginBottom: 2 }}
      slotProps={{
        input: {
          endAdornment: value ? (
            <InputAdornment position="end">
              <Tooltip title={t("Search.ClearSearch")}>
                <IconButton
                  size="small"
                  onClick={() => setValue("")}
                  aria-label={t("Clear search")}
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ) : (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  )
}
