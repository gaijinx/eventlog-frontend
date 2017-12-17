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
  function onMapClick(e) {
    populate_new_event_table(e.latlng.lat, e.latlng.lng);
  };
  mainMap.on('click', onMapClick);
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
  ajax('/markers')
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

function populate_new_event_table(lat, lon){
  let table = document.getElementById('login_table');
  login_utils.clearElement(table);
  login_table.appendChild(login_utils.add_tr('<b>Rodzaj zdarzenia:</b>'));
  login_table.appendChild(get_event_type_select_tr());
  get_event_types();
  login_table.appendChild(login_utils.add_tr('<b>Opis:</b>'));
  login_table.appendChild(login_utils.add_tr('<input type="text" id="id_desc">'));
  login_table.appendChild(login_utils.add_tr('<button class="btn btn-primary" onClick="window.add_new_event(' + lat + ',' + lon + ')">DODAJ</button>'));
  $('#login_div').show();

} 

function get_event_types(){
  ajax('/event_types')
  .post()
  .then(function(response) {
    var response_json = JSON.parse(response.response);
    if (response_json.success){
      populate_event_types(response_json.event_types);
    }else{
      populate_event_types([]);
    }
  })
  .catch(function(err) {
    // TODO REMOVE
    let mock = JSON.parse('[{"id":1, "name":"Wypadek"}, {"id":2, "name":"Patrol"}]');
    populate_event_types(mock);
  });
}

function populate_event_types(event_types_array){
  let select = document.getElementById('id_event_types_select');
  for (var index in event_types_array){
    let event_type = event_types_array[index]
    let option = document.createElement('option');
    option.setAttribute('value', event_type.id);
    option.innerText = event_type.name;
    if (index == 0){
      option.setAttribute("selected", "selected");
    }
    select.appendChild(option);
  }
}

function get_event_type_select_tr(){
  let input_tr = document.createElement('tr');
  let input_td = document.createElement('td');
  let select = document.createElement('select');
  select.setAttribute("id", "id_event_types_select");
  input_td.appendChild(select);
  input_tr.appendChild(input_td);
  return input_tr;
}

export function add_new_event(lat, lon){
  let login = login_utils.getCookie('login');
  let event_type = get_selected_value('id_event_types_select');
  let description = document.getElementById('id_desc').value;
  ajax('/new_event').post({
    login: login,
    lat: lat,
    lon: lon,
    event_type: event_type,
    description: description,
  })
  .then(function(response) {
    var response_json = JSON.parse(response.response);
    if (response_json.success){
      alert('Dodano zgloszenie');
    }
  })
  .catch(function(err) {
  });
  $('#login_div').hide();
}

function get_selected_value(select_object_id){
  var e = document.getElementById(select_object_id);
  return e.options[e.selectedIndex].value;
}