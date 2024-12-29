import {popStoredLoginCodeVerifier, popStoredLoginState} from "../../../services/AuthenticationService.ts";
import {Navigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Box} from "@mui/material";
import loadingIcon from "../../../../../assets/loading.svg";
import {useAuth} from "../../../../../shared/hooks.ts";

function MakeRequest(props:{code:string,code_verifier:string}) {
  const [loading,setLoading] = useState<boolean>(true);
  const {loginAction} = useAuth()

  useEffect(() => {
    loginAction(props.code, props.code_verifier).then(()=>{
      setLoading(false);
    })
  }, [loginAction, props.code, props.code_verifier]);

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

  const [searchParams] = useSearchParams();
  const error = searchParams.get("error")
  const authenticationCode = searchParams.get("code")

  if (authenticationCode) {
    const loginState = searchParams.get('state')
    if (!loginState) {
      throw new Error('State param is missing from URL')
    }
    const storedState = popStoredLoginState()
    if (decodeURIComponent(loginState) !== storedState) {
      throw new Error(
        'State must be the same, otherwise there is a potential security issue. Stored: '
        + storedState + ', but got: ' + decodeURIComponent(loginState)
      )
    }
    // TODO this is called twice in development, we should check why and fix it, to be able to also fix the todo in the pop funcion
    const loginCodeVerifier = popStoredLoginCodeVerifier()
    return <MakeRequest code={authenticationCode} code_verifier={loginCodeVerifier}/>
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