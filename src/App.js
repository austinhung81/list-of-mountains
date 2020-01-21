import React from 'react';
import logo from './logo.svg';
import './App.css';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXVzdGluaHVuZzgxIiwiYSI6ImNrNWh4Z252OTA4cHAzZ285dmR4ZnB6cmYifQ.7Hij0vbrY3lfBp_pxZD2cw';

const bounds = [
  [115.93339971075522, 21.69236816168778], // Southwest coordinates
  [127.71754170874522, 25.43456255835359] // Northeast coordinates
];
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 5,
      lat: 34,
      zoom: 2
    };
  };
  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v10',
      zoom: this.state.zoom,
      maxBounds: bounds
    });

    map.on('move', () => {
    });

    map.on('load', function () {
      // Insert the layer beneath any symbol layer.
      var layers = map.getStyle().layers;

      var labelLayerId;
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      map.addLayer(
        {
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
      );
    });

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <div>
          <div ref={el => this.mapContainer = el} className='mapContainer' />
        </div>
      </div>
    );
  }
}

export default App;
