import 'leaflet/dist/leaflet.css'
import './application.css';
import * as login_utils from './login_form.js';
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
    var response_json = JSON.parse(response.response);
    if (response_json.success){
        add_markers(response_json.markers, map);
    }
      
  })
  .catch(function(err) {
    // TODO REMOVE
    let markers_mock = JSON.parse('[{"id":1, "lat":51.505, "lon":-0.09}]');
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
  var link = $('<a href="#">Wiecej</a>').click(function() {
    get_marker_data_by_id(id);
  })[0];
  marker.bindPopup(link);
  marker.addTo(map);
}

function populate_info_table(marker){
  let table = document.getElementById('login_table');
  login_utils.clearElement(table);
  login_table.appendChild(login_utils.add_tr('<b>Rodzaj zdarzenia:</b>'));
  login_table.appendChild(login_utils.add_tr(marker.name));
  login_table.appendChild(login_utils.add_tr('<b>Opis:</b>'));
  login_table.appendChild(login_utils.add_tr(marker.desc));
  login_table.appendChild(login_utils.add_tr('<b>Ocen:</b>'));
  let voteUp = '<button class="btn btn-success" onClick="window.vote('+ marker.id +', 1)">+</button>'
  let voteDown = '<button class="btn btn-danger" onClick="window.vote('+ marker.id +', -1)">-</button>'
  login_table.appendChild(login_utils.add_tr(voteUp + voteDown));
  login_table.appendChild(login_utils.add_tr('<div id="id_event_info"></div>'));
  $('#login_div').show();
}

export function get_marker_data_by_id(id){
  ajax('/markers/')
  .post({
    id: id
  })
  .then(function(response) {
    var response_json = JSON.parse(response.response);
    if (response_json.success){
        populate_info_table(response_json.marker);
    }
      
  })
  .catch(function(err) {
    // TODO REMOVE
    let mock_marker = JSON.parse('{"id":1, "name":"Wypadek", "desc":"Opis zdarzenia"}');
    populate_info_table(mock_marker);
  });
}

export function vote(id, vote){
  ajax('/vote').post({
    id: id,
    vote: vote
  })
  .then(function(response) {
    var response_json = JSON.parse(response.response);
    if (response_json.success){
        info_to_user('Dziekujemy za ocene');
    }
      
  })
  .catch(function(err) {
    // TODO REMOVE
    info_to_user('ID: ' + id + ' Vote: ' + vote);
  });
}
function info_to_user(msg){
  document.getElementById('id_event_info').innerText = msg;
}