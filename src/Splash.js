import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, View, Image} from 'react-native';
import loginKC, {getDeepLink}  from './keycloack';
import styles from './styles'

export default function Splash() {
  const navigation = useNavigation();

  const conf = {
    url: 'https://test-abl-keycloack.herokuapp.com/auth/',
    realm: 'test',
    clientId: 'test-client',
    appsiteUri: getDeepLink(),
  };

  async function getAuthTokens() {
    loginKC.setConf(conf);
    const tokens = await loginKC.getTokens();
    console.log("Splash:",  JSON.stringify(tokens, undefined, 2))
    if (tokens) {
      const refreshedTokens = await loginKC.refreshToken();
      console.log("Splash Refresh:",  JSON.stringify(refreshedTokens, undefined, 2))
      if (refreshedTokens) navigation.navigate('Home');
    } else navigation.navigate('Login');
  }

  useEffect(() => {
    getAuthTokens();
  }, []);

  const imageSrc =
    'https://growthtribe.io/wp-content/uploads/2019/08/RGB-GrowthTribe-Horizontal-300x89.png';

  return (
    <View style={styles.container}>
      <Image source={{uri: imageSrc}} style={styles.image} />
      <ActivityIndicator size="large" color="#e60f1e" style={styles.loading} />
    </View>
  );
}