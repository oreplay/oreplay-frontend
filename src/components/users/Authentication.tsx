import {popStoredLoginCodeVerifier, popStoredLoginState} from "../../services/UsersService.ts";
import {useAuth} from "../../shared/hooks.ts";
import {Navigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Box} from "@mui/material";
import loadingIcon from "../../assets/loading.svg";

function MakeRequest(props:{code:string,code_verifier:string}) {
  const [loading,setLoading] = useState<boolean>(true);
  const {loginAction} = useAuth()

  useEffect(() => {
    loginAction(props.code, props.code_verifier).then(()=>{
      setLoading(false);
    })
  }, );

  if (loading) {
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
  else {
    return <Navigate to={'/Dashboard'} /> //TODO: Sometimes the application gets crazy because user state is not set yet and an infinate redirection loop happens from here to private route to initsignin and back here.
  }
}

export default function Authentication() {
  // TODO this function should get the login challenge from the router (maybe router in react, using window location is ugly)
  // TODO after getting the param, the value should be removed from the URL (so it is not visible for the user)

  const url = window.location.href
  const error = url.match(/error_description=([^&]*)/);
  const authenticationCode = url.match(/code=([^&]*)/);

  if (authenticationCode) {
    console.log('__authentication_code_provided__')
    const loginState = url.match(/state=([^&]*)/);
    const storedState = popStoredLoginState()
    if (!loginState || !loginState[1] || decodeURIComponent(loginState[1]) !== storedState) {
      throw new Error(
        'State must be the same, otherwise there is a potential security issue. Stored: '
        + storedState + ', but got : ' + decodeURIComponent(loginState? loginState[1] : '')
      )
    }
    const loginCodeVerifier = popStoredLoginCodeVerifier()
    return <MakeRequest code={authenticationCode[1]} code_verifier={loginCodeVerifier}/>
  } else if (error) {
    // TODO handle the error (for example invalid username and password
    console.log('__authentication_code_provided__ with error')
    return (<p>An error happened</p>)
  } else {
    // TODO handle this case in the ui in a nicer way than a redirection to the startpage

    console.log('__redirect_out_to_startpage__')
    return <Navigate to={'/'}/>
  }

}
