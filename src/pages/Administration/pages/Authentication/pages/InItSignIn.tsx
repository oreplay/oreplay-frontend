import {getSignInUrl} from "../../../services/AuthenticationService.ts";
import {Box} from "@mui/material";
import loadingIcon from "../../../../../assets/loading.svg";
import {useEffect} from "react";

export default function InItSignIn() {

  useEffect(() => {
    getSignInUrl().then((url:string) =>{
      window.location.replace(url)
    })
  }, []);

  return (
    <Box sx={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <img alt={'loading icon'} height={50} width={50} src={loadingIcon}></img>
    </Box>
  )
}