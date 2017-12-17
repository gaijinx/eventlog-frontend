import 'leaflet/dist/leaflet.css'
import './application.css';
import L from 'leaflet';
import ajax from 'es-ajax';

export function init_map() {
  let element = document.createElement('div');
  element.setAttribute('id', 'main-container')
  element.appendChild(application());
  document.body.appendChild(element);
}

export function remove_map() {
  document.body.removeChild(document.getElementById('main-container'));
}

function application() {
  let mapDiv = document.createElement('div');
  mapDiv.setAttribute("id", "main-map")
  let mainMap = L.map(mapDiv).setView([51.505, -0.09], 13);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mainMap);
  get_markers(mainMap);
  return mapDiv;
}

function get_markers(map){
  ajax('/markers').post()
  .then(function(response) {
    console.log('success');
    var response_json = JSON.parse(response.response);
    if (response_json.success){
        add_markers(response_json.markers, map);
    }
      
  })
  .catch(function(err) {
    // TODO REMOVE
    let markers_mock = JSON.parse('[{"id":1, "lat":51.505, "lon":-0.09},{"id":2, "lat":51.505, "lon":-0.12}]');
    add_markers(markers_mock, map);
  });
}

function add_markers(marker_array, map){
  for (var marker in marker_array){
    add_marker(marker_array[marker].lat, marker_array[marker].lon, marker_array[marker].id, map);
  }
}

function add_marker(lat, lon, id, map){
  let marker = L.marker([lat, lon]);
  marker.bindPopup("ID:" + id);
  marker.addTo(map);
}