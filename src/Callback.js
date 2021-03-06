import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, View, Image} from 'react-native';
import loginKC from './keycloack';
import styles from './styles';

export default function Callback({route}) {
  const navigation = useNavigation();
  const {params} = route;
  const {code} = params;

  console.log("Code:", JSON.stringify(code, undefined, 2));
  async function getAuthTokens() {
    const tokens = await loginKC.getTokens();
    console.log(" Tokens:", JSON.stringify(tokens, undefined, 2))
    if (tokens) {
      const refreshedTokens = await loginKC.refreshToken();
      console.log("Refreshed  Tokens:", JSON.stringify(refreshedTokens, undefined, 2))
      if (refreshedTokens) navigation.navigate('Home');
    } else navigation.navigate('Login');
  }

  async function retrieveTokens() {
    await loginKC.retrieveTokens(code);
    getAuthTokens();
  }

  useEffect(() => {
    retrieveTokens();
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
