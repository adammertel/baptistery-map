import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import MapRecords from './maprecords';
import MapGrid from './mapgrid';

require('./../../node_modules/leaflet.awesome-markers/dist/leaflet.awesome-markers.js');
require('./../../node_modules/leaflet.awesome-markers/dist/leaflet.awesome-markers.css');

import {
  Map,
  TileLayer,
  WMSTileLayer,
  ScaleControl,
  AttributionControl,
  LayersControl,
  CircleMarker,
  Tooltip,
  Marker,
  LayerGroup,
  GeoJSON,
  Pane
} from 'react-leaflet';
import 'leaflet-regular-grid-cluster';

@observer
class AppMap extends React.Component {
  @observable center = [40, 20];
  @observable zoom = 5;

  @action
  handleViewportChanged = e => {
    this.center = e.center;
    this.zoom = e.zoom;
  };

  @computed
  get mapPosition() {
    return [this.center[0], this.center[1]];
  }

  style() {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      position: 'fixed'
    };
  }

  mapStyle() {
    return {
      position: 'absolute',
      width: '100%',
      top: 0,
      bottom: 300
    };
  }

  componentDidMount() {
    window['map'] = this.refs.map.leafletElement;
    L.Util.setOptions(map, { maxBoundsViscosity: 1 });
  }

  renderBaseLayers() {
    return <LayerGroup>{this.renderBaseLayer()}</LayerGroup>;
  }

  renderBaseLayer(basemap) {
    if (basemap.type === 'tile') {
      return <TileLayer {...basemap} />;
    } else if (basemap.type === 'wms') {
      return <WMSTileLayer {...basemap} />;
    }
  }

  render() {
    return (
      <div className="map-wrapped" style={this.style()}>
        <Map
          center={this.mapPosition}
          zoom={this.zoom}
          onViewportChanged={this.handleViewportChanged}
          useFlyTo={true}
          ref="map"
          style={this.mapStyle()}
          attributionControl={false}
          maxZoom={10}
          minZoom={3}
        >
          <ScaleControl position="topleft" imperial={false} />
          <AttributionControl position="bottomleft" />

          <LayersControl position="topright">
            {Object.keys(basemaps).map(basemapId => {
              const basemap = basemaps[basemapId];
              return (
                <LayersControl.BaseLayer
                  checked={store.basemap === basemapId}
                  name={basemapId}
                  key={basemapId}
                >
                  {this.renderBaseLayer(basemap)}
                </LayersControl.BaseLayer>
              );
            })}
          </LayersControl>
          {this.zoom > store.gridThreshold ? (
            <MapRecords />
          ) : (
            <MapGrid map={map} />
          )}
        </Map>
      </div>
    );
  }
}

export default AppMap;
