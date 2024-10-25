import {useEffect, useState} from "react";
import {AppBar, BottomNavigation, Box} from "@mui/material";
import {useSearchParams} from "react-router-dom";

export interface resultMenuSelectorProps {
  defaultMenu: number,
  pages:JSX.Element[],
  menuOptions:JSX.Element[],
  menuOptionsLabels:string[]
}

export default function ResultMenuSelector(props:resultMenuSelectorProps) {
  const [selectedMenu, setSelectedMenu] = useState<number>(props.defaultMenu);
  const [searchParams, setSearchParams] = useSearchParams()
  const ACTIVE_MENU_SEARCH_PARAM = 'menu'

  // Pick the right menu from Search Params
  useEffect(()=>{
    const desired_active_menu = searchParams.get(ACTIVE_MENU_SEARCH_PARAM)
    if (desired_active_menu) {
      setSelectedMenu(props.menuOptionsLabels.indexOf(desired_active_menu))
    } else {
      searchParams.set(ACTIVE_MENU_SEARCH_PARAM,props.menuOptionsLabels[props.defaultMenu])
      setSearchParams(searchParams)
    }

    //es-lint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // update page when navigating
  const handleMenuChange = (newValue:number) => {
    setSelectedMenu(newValue)
    searchParams.set(ACTIVE_MENU_SEARCH_PARAM,props.menuOptionsLabels[newValue])
    setSearchParams(searchParams)
  }

  return (
    <>
      {props.pages[selectedMenu]}
      <Box sx={{marginTop: "auto", width: "100%"}}>
        <AppBar position="static" sx={{backgroundColor: "white"}}>
          <BottomNavigation
            value={selectedMenu}
            onChange={(_,newValue)=> {handleMenuChange(newValue)}}
          >
            {props.menuOptions}
          </BottomNavigation>
        </AppBar>
      </Box>
    </>

  )
}