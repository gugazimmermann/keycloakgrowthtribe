import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import * as querystring from 'query-string';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

export class Login {
  state;
  conf;
  tokenStorage;

  constructor() {
    this.state = {};

    this.props = {
      requestOptions: {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'GET',
        body: undefined,
      },
      url: '',
    };
  }

  setConf(conf) {
    if (conf) {
      this.conf = conf;
    }
  }

  openLogin(callback) {
    const conf = {
      ...this.conf,
      redirectUri: callback,
    };
    this.setConf(conf);
    return new Promise((resolve, reject) => {
      const {url, state} = this.getLoginURL();
      this.state = {
        ...this.state,
        resolve,
        reject,
        state,
      };
      this.openLink(url, callback);
    });
  }

  getRealmURL() {
    const {url, realm} = this.conf;
    const slash = url.endsWith('/') ? '' : '/';
    return `${url + slash}realms/${encodeURIComponent(realm)}`;
  }

  getLoginURL() {
    const {redirectUri, clientId, kcIdpHint, options} = this.conf;
    const responseType = 'code';
    const state = uuidv4();
    const scope = 'openid';
    const url = `${this.getRealmURL()}/protocol/openid-connect/auth?${querystring.stringify(
      {
        scope,
        kc_idp_hint: kcIdpHint,
        redirect_uri: redirectUri,
        client_id: clientId,
        response_type: responseType,
        options: options,
        state,
      },
    )}`;

    return {
      url,
      state,
    };
  }

  async openLink(url, callback) {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(url, callback, {
          // iOS Properties
          ephemeralWebSession: false,
          // Android Properties
          showTitle: false,
          enableUrlBarHiding: true,
          enableDefaultShare: false,
        });
        if (result.type === 'success' && result.url) {
          Linking.openURL(result.url);
        }
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      Linking.openURL(url);
    }
  }

  async retrieveTokens(code) {
    const {redirectUri, clientId} = this.conf;
    this.props.url = `${this.getRealmURL()}/protocol/openid-connect/token`;

    this.setRequestOptions(
      'POST',
      querystring.stringify({
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        client_id: clientId,
        code,
      }),
    );

    const fullResponse = await fetch(this.props.url, this.props.requestOptions);
    const jsonResponse = await fullResponse.json();
    if (fullResponse.ok) {
      this.tokenStorage.saveTokens(jsonResponse);
      this.state.resolve(jsonResponse);
    } else {
      this.state.reject(jsonResponse);
    }
  }

  getTokens() {
    return this.tokenStorage.loadTokens();
  }

  async refreshToken() {
    const savedTokens = await this.getTokens();
    if (!savedTokens) {
      return undefined;
    }

    const {clientId} = this.conf;
    this.props.url = `${this.getRealmURL()}/protocol/openid-connect/token`;

    this.setRequestOptions(
      'POST',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: savedTokens.refresh_token,
        client_id: encodeURIComponent(clientId),
      }),
    );

    const fullResponse = await fetch(this.props.url, this.props.requestOptions);
    if (fullResponse.ok) {
      const jsonResponse = await fullResponse.json();
      this.tokenStorage.saveTokens(jsonResponse);
      return jsonResponse;
    }
    return undefined;
  }

  async retrieveUserInfo() {
    const savedTokens = await this.getTokens();
    if (savedTokens) {
      this.props.url = `${this.getRealmURL()}/protocol/openid-connect/userinfo`;

      this.setHeader('Authorization', `Bearer ${savedTokens.access_token}`);
      this.setRequestOptions('GET');

      const fullResponse = await fetch(
        this.props.url,
        this.props.requestOptions,
      );
      if (fullResponse.ok) {
        return fullResponse.json();
      }
    }
    return undefined;
  }

  async logout() {
    const {clientId} = this.conf;
    const savedTokens = await this.getTokens();
    if (!savedTokens) {
      return undefined;
    }

    this.props.url = `${this.getRealmURL()}/protocol/openid-connect/logout`;

    this.setRequestOptions(
      'POST',
      querystring.stringify({
        client_id: clientId,
        refresh_token: savedTokens.refresh_token,
      }),
    );

    const fullResponse = await fetch(this.props.url, this.props.requestOptions);

    if (fullResponse.ok) {
      this.tokenStorage.clearTokens();
      return true;
    }
    return false;
  }

  setTokenStorage(tokenStorage) {
    this.tokenStorage = tokenStorage;
  }

  setRequestOptions(method, body) {
    this.props.requestOptions = {
      ...this.props.requestOptions,
      method,
      body,
    };
  }

  setHeader(key, value) {
    this.props.requestOptions.headers[key] = value;
  }
}
