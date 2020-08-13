import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  SafeAreaView,
  StatusBar,
  View,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import loginKC from './keycloack';
import styles from './styles';

export default function Home() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState(null);

  async function retrieveUserInfo() {
    const loggedInUser = await loginKC.retrieveUserInfo();
    if (loggedInUser) setUserName(loggedInUser.name);
  }

  async function handleLogout() {
    const logout = await loginKC.logout();
    if (logout) navigation.navigate('Login');
  }

  useEffect(() => {
    retrieveUserInfo();
  }, []);

  const imageSrc =
    'https://growthtribe.io/wp-content/uploads/2019/08/RGB-GrowthTribe-Horizontal-300x89.png';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffb90f" />
      <Image source={{uri: imageSrc}} style={styles.image} />
      <View style={[styles.content, styles.home]}>
        <Text style={styles.text}>Welcome</Text>
        {!userName ? (
          <ActivityIndicator
            size="large"
            color="#e60f1e"
            style={styles.loading}
          />
        ) : (
          <Text style={styles.text}>{userName}</Text>
        )}
        <TouchableOpacity onPress={handleLogout} style={styles.buttonContainer}>
          <Text style={[styles.text, styles.buttonText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
