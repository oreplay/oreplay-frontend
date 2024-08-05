import {deleteRequest, get, post, API_DOMAIN} from './ApiConfig.ts'
import {UserModel, Data} from "../shared/EntityTypes.ts";

const clientId: number = 2658

interface UserTokenModel {
  access_token: string,
  expires_in: number,
  token_type: string,
  scope: string
}

const loginCodeVerifierKey = 'loginCodeVerifier'
const loginStateKey = 'loginState'

const getCrypto = () => {
  return window.crypto;
};

const createRandomString = () => {
  const charset =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.';
  let random = '';
  const randomValues = Array.from(
    getCrypto().getRandomValues(new Uint8Array(43))
  );
  randomValues.forEach(v => (random += charset[v % charset.length]));
  return random;
};

const getRedirectUri = () => {
  const host = window.location.host
  const protocol = window.location.protocol // TODO this is a bit ugly and could be not working in some cases
  return `${protocol}//${host}/signin`// TODO instead of signin we should implement a new page in frontend
}

/**
 * Get URL to initialize the login flow
 */
export async function getSignInUrl(): Promise<string> {
  console.log('xx getSignInUrl')

  const urlEncodeB64 = (input: string) => {
    const b64Chars: { [index: string]: string } = { '+': '-', '/': '_', '=': '' };
    return input.replace(/[+/=]/g, (m: string) => b64Chars[m]);
  };
  const bufferToBase64UrlEncoded = (input: number[] | Uint8Array | ArrayBuffer) => {
    const ie11SafeInput = new Uint8Array(input);
    return urlEncodeB64(
      window.btoa(String.fromCharCode(...Array.from(ie11SafeInput)))
    );
  };
  const sha256 = async (s: string): Promise<ArrayBuffer> => {
    const digestOp = getCrypto().subtle.digest(
      { name: 'SHA-256' },
      new TextEncoder().encode(s)
    );
    return await digestOp;
  };

  const state = createRandomString()
  window.sessionStorage.setItem(loginStateKey, state);
  console.log('xx getSignInUrl store state', state)
  const codeVerifier: string = createRandomString();
  const codeChallenge: string = bufferToBase64UrlEncoded(await sha256(codeVerifier));
  console.log('xx loginCodeChallenge', codeChallenge, ' codeVerifier ', codeVerifier)// TODO
  // throw new Error();
  window.sessionStorage.setItem(loginCodeVerifierKey, codeVerifier);
  return `${API_DOMAIN}api/v1/authorize?response_type=code&client_id=${clientId}&state=${state}`
    + `&redirect_uri=${getRedirectUri()}&code_challenge_method=S256&code_challenge=${codeChallenge}`
}

export function popStoredLoginCodeVerifier():string
{
  const item = window.sessionStorage.getItem(loginCodeVerifierKey)
  if (!item) {
    throw new Error('Could not pop stored login CodeVerifier')
  }
  //window.sessionStorage.setItem(loginCodeVerifierKey, '') //TODO: remove item. Careful! if the component reloads it fails
  return item
}

export function popStoredLoginState()
{
  const item = window.sessionStorage.getItem(loginStateKey)
  if (!item) {
    throw new Error('State stored must not be empty')
  }
  //window.sessionStorage.setItem(loginStateKey, '') //TODO: remove storage. Careful! if the component reloads it fails
  return item
}

/**
 * Check in backend if an authorization code and code_verifier are correct. If they are, it provides an
 * authentication token.
 * @param code authorization_code
 * @param code_verifier
 */
export async function validateSignIn(code: string,code_verifier: string): Promise<Data<UserTokenModel>> {
  const isRememberSessionChecked = getRedirectUri() === 'alwaysFalse' // TODO implement remember logic
  const scope = isRememberSessionChecked ? 'offline_access' : '';
  return await post(
    'api/v1/oauth/token', {
      "code": code,
      "code_verifier": code_verifier,
      "grant_type": "authorization_code",
      "redirect_uri": getRedirectUri(),
      "client_id" : clientId,
      "scope" : scope
    }
  )
}

/**
 * Request backend invalidation of a token. In essence, it logs you out.
 * @param token to be invalidated
 */
export async function deleteToken(token:string): Promise<Response> {
  return await deleteRequest(`api/v1/oauth/token/${token}`)
}

/**
 * Request data of the user that is logged in with a given token
 * @param token
 */
export function getUserData(token:string): Promise<Data<UserModel>> {
  return get<Data<UserModel>>('api/v1/me',token)
}