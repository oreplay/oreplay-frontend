import {useContext} from "react";
import {activeResultBottomMenuContext} from "./Context.ts";

/**
 * This hook allows to set the bottom navigation bar focus on one of the possible submenus. This
 * allows to set the focus correctly when the menu is directly loaded from the url. It works using
 * activeResultBottomMenuContext context.
 * @param newActiveMenu 1='startList', 2='results', 3='splits'
 */
export function useBottomActiveMenu(newActiveMenu:number) {
  const setActiveMenu = useContext(activeResultBottomMenuContext);
  if (setActiveMenu) {
    setActiveMenu(newActiveMenu);
  }
}
