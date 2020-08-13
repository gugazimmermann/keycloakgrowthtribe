import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import loginKC, {getDeepLink} from './keycloack';
import styles from './styles';

export default function Login() {
  const callback = getDeepLink('Callback');

  async function handleLogin() {
    await loginKC.openLogin(callback);
  }

  const imageSrc =
  'https://growthtribe.io/wp-content/uploads/2019/08/RGB-GrowthTribe-Horizontal-300x89.png';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffb90f" />
      <Image source={{uri: imageSrc}} style={styles.image} />
      <View style={styles.content}>
        <TouchableOpacity onPress={handleLogin} style={styles.buttonContainer}>
          <Text style={[styles.text, styles.buttonText]}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
