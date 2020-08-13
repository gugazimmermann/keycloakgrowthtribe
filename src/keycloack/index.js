import {Login} from './Login';
import {TokenStorage} from './TokenStorage';

export function getDeepLink(path = '') {
    const scheme = 'growthtribeapp';
    const prefix =
      Platform.OS == 'android' ? `${scheme}://growthtribe/` : `${scheme}://`;
    return prefix + path;
  }
  

const loginKC = new Login();
loginKC.setTokenStorage(new TokenStorage('keycloak-tokens'));

export default loginKC;
