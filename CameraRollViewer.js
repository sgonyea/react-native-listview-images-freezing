var React = require('react-native');

var {
  Image,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBarIOS,
  StyleSheet,
  Text,
  ListView,
  PixelRatio,
  ActivityIndicatorIOS,
  CameraRoll,
  Dimensions,
} = React;

// var groupByEveryN = require('groupByEveryN');
import groupByEveryN from 'groupByEveryN';

import CameraRollImage from './CameraRollImage';

var CameraRollViewer = React.createClass({
  getDefaultProps() {
    return {
      groupTypes: 'SavedPhotos',
      batchSize: 1000,
      imagesPerRow: 3,
      assetType: 'Photos',
    }
  },
  getInitialState() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: function(row1, row2) { return row1 !== row2 },
    });

    return {
      dataSource: dataSource,
      assets: [],
    }
  },
  componentWillMount: function() {
    this.fetch();
  },
  _appendAssets: function(data: Object) {
    var newAssets = data.edges;
    var assets    = this.state.assets.concat(newAssets);

    var newState: Object = {
      loadingMore: false,
      noMore: !!data.page_info.has_next_page,
      lastCursor: data.page_info.end_cursor,
      assets: assets,
    };

    newState.dataSource = this.state.dataSource.cloneWithRows(
      groupByEveryN(newState.assets, this.props.imagesPerRow)
    );

    this.setState(newState);
  },
  _fetch: function() {
    var fetchParams: Object = {
      first: this.props.batchSize,
      groupTypes: this.props.groupTypes,
      assetType: this.props.assetType,
    };

    if (this.state.lastCursor)
      fetchParams.after = this.state.lastCursor;

    CameraRoll.getPhotos(fetchParams).then(this._appendAssets);
  },
  fetch: function() {
    if (!this.state.loadingMore) {
      this.setState({loadingMore: true}, () => { this._fetch(); });
    }
  },
  _onEndReached: function() {
    if (!this.state.noMore) {
      this.fetch();
    }
  },
  _renderFooterSpinner: function() {
    if (!this.state.noMore) {
      return <ActivityIndicatorIOS style={styles.spinner} />;
    }
    return null;
  },
  _renderImage(asset, idx, sectionID, rowID) {
    var key = asset && asset.node.image.uri;

    if(!key)
      key = `${idx}-${sectionID}-${rowID}`;

    return (
      <CameraRollImage
          key={key}
          asset={asset}
          imagesPerRow={this.props.imagesPerRow}
      />
    )
  },
  _renderRow(rowData: Array<Image>, sectionID: string, rowID: string)  {
    if(rowData === null) return;
    if(rowData.constructor === Object) {
      rowData = [rowData];
    }

    var images = rowData.map((image, idx) => {
      return this._renderImage(image, idx, sectionID, rowID);
    });

    return (
      <View key={sectionID + ',' + rowID} style={styles.row}>
        {images}
      </View>
    );
  },
  render() {
    return (
      <View style={styles.container}>
        <ListView
          renderRow={this._renderRow}
          renderFooter={this._renderFooterSpinner}
          onEndReached={this._onEndReached}
          style={styles.container}
          contentContainerStyle={styles.containerStyle}
          dataSource={this.state.dataSource}
        />
      </View>
    )
  },
});

module.exports = CameraRollViewer;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  rowSection: {
    paddingVertical: 5,
    paddingLeft: 5,
    backgroundColor: 'rgba(229,229,229,0.95)',
    borderBottomWidth: 1 / PixelRatio.get(),
  },
  sectionText: {
    fontSize: 18,
    fontFamily: 'Helvetica-Light',
    fontWeight: '300',
  },
});
