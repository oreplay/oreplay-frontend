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
      placeholder={t("Search.Search")}
      variant="standard"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      sx={{ marginY: 2, width: "100%" }}
      slotProps={{
        input: {
          sx: { mx: "10px", mt: "5px" },
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
