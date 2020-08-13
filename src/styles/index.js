import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
  },
  image: {
    width: 300,
    height: 89,
  },
  loading: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  home: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
    color: 'black',
  },
  buttonContainer: {
    elevation: 8,
    backgroundColor: '#e60f1e',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default styles;
