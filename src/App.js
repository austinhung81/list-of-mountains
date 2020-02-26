import React from 'react';
import logo from './logo.svg';
import './App.css';
import mapboxgl from 'mapbox-gl';
import Mountains from './mountains';

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
      map.addSource('peak', {
        'type': 'geojson',
        'data': Mountains,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'peak',
        filter: ['has', 'point_count'],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'peak',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });
      map.addLayer({
        'id': 'peak-point',
        'type': 'circle',
        'source': 'peak',
        'paint': {
          // make circles larger as the user zooms from z12 to z22
          'circle-radius': {
            'base': 1.75,
            'stops': [[12, 2], [22, 180]]
          },
          // color circles by peak, using a match expression
          // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
          'circle-color': [
            'match',
            ['get', 'peak'],
            'White',
            '#fbb03b',
            'Black',
            '#223b53',
            'Hispanic',
            '#e55e5e',
            'Asian',
            '#3bb2d0',
                /* other */ '#0096cc'
          ]
        }
      });
      map.on('click', 'clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('peak').getClusterExpansionZoom(
          clusterId,
          function (err, zoom) {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });

      map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
      });
      map.on('click', 'peak-point', function (e) {
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`${e.features[0].properties.name}<br>高度: ${e.features[0].properties.ele}`)
          .addTo(map);
      });
      map.on('mouseenter', 'peak-point', function () {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'peak-point', function () {
        map.getCanvas().style.cursor = '';
      });
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
