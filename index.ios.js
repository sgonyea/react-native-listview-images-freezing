/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';

import CameraRollViewer from './CameraRollViewer';

class Derp extends Component {
  render() {
    var width = Dimensions.get('window').width;
    return (
      <View style={styles.container}>
        <View style={[styles.header, {width: width}]}>
          <Text style={styles.headerText}>ListView+Images Lockup</Text>
        </View>
        <CameraRollViewer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    position: 'relative',
    marginTop: 20,
  },
  header: {
    backgroundColor: '#ffffffaa',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  },
});

AppRegistry.registerComponent('Derp', () => Derp);
