import 'leaflet/dist/leaflet.css'
import './application.css';
import L from 'leaflet';

export default function application() {
  let mapDiv = document.createElement('div');
  mapDiv.setAttribute("id", "main-map")
  let mainMap = L.map(mapDiv).setView([51.505, -0.09], 13);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mainMap);
  add_marker(51.5, -0.09, null, null).addTo(mainMap);
  return mapDiv;
}

function add_marker(lat, lon, color, id){
  let marker = L.marker([lat, lon]);
  marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
  return marker
}
