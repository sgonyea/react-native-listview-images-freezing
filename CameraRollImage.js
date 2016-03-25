var React = require('react-native');

var {
  Image,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Text,
  PixelRatio,
  CameraRoll,
  Dimensions,
} = React;

var CameraRollImage = React.createClass({
  getStyle() {
    var width = Dimensions.get('window').width;

    return {
      width: (width / this.props.imagesPerRow) - 1,
      height: (width / this.props.imagesPerRow) - 1,
    }
  },
  render() {
    var asset = this.props.asset;
    var source = asset && asset.node.image;

    return (
      <Image source={source} style={this.getStyle()} />
    )
  },
});

module.exports = CameraRollImage;
