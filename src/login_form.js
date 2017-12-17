import * as map_app from './application.js';
import 'bootstrap/dist/css/bootstrap.css';
import ajax from 'es-ajax';

export function create_container_div(){
  if ($('#login_div').length == 0){
    let login_div = document.createElement('div');
    login_div.setAttribute('id', 'login_div');
    let login_table = document.createElement('table');
    login_table.setAttribute('id', 'login_table');
    login_table.setAttribute('class', 'table middlebox');
    login_table.setAttribute('style', 'width:300px;');
    login_div.appendChild(login_table);
    document.body.appendChild(login_div);
  }
  
}

export function login_form() {
    let login_table = document.getElementById('login_table');
    
    clearElement(login_table); 
    login_table.appendChild(add_tr('Login:'));
    login_table.appendChild(add_tr('<input type="text" placeholder="Wpisz login" id="id_login">'));
    login_table.appendChild(add_tr('Haslo:'));
    login_table.appendChild(add_tr('<input type="password" placeholder="Wpisz haslo" id="id_password">'));
    login_table.appendChild(add_tr('<div id="id_errors"></div>'));
    login_table.appendChild(add_tr('<button class="btn" role="button" onClick="window.authenticate()">Zaloguj</button>'));
    login_table.appendChild(add_tr('<button class="btn" role="button" onClick="window.show_register_form()">Nie masz konta? Zarejestruj sie</button>'));    
  }

export function register_form() {
    let login_table = document.getElementById('login_table');
    clearElement(login_table);  
    login_table.appendChild(add_tr('Login:'));
    login_table.appendChild(add_tr('<input type="text" placeholder="Wpisz login" id="id_login">'));
    login_table.appendChild(add_tr('Haslo:'));
    login_table.appendChild(add_tr('<input type="password" placeholder="Wpisz haslo" id="id_password">'));
    login_table.appendChild(add_tr('Powtorz haslo:'));
    login_table.appendChild(add_tr('<input type="password" placeholder="Powtorz haslo" id="id_password_confirmation">'));
    login_table.appendChild(add_tr('<div id="id_errors"></div>'));
    login_table.appendChild(add_tr('<button class="btn" role="button" onClick="window.register()">Rejestruj</button>'));    
  }

export function authenticate(){
  let login = document.getElementById("id_login").value;
  let password = document.getElementById("id_password").value;
  if (!login || !password){
    authenticate_result(false, 'Please fill all fields.');
  }
  else{
    ajax('/authenticate')
    .post({
      login: login,
      password: password
    })
    .then(function(response) {
      var response_json = JSON.parse(response.response);
      if (response_json.success){
        authenticate_result(true, null);
      }
      else{
        authenticate_result(false, 'Couldn\'t authenticate.');
      }
        
    })
    .catch(function(err) {
      // TODO SET TO FALSE
      authenticate_result(true, 'Something went wrong.');
    });
  }
}

export function register(){
  let login = document.getElementById("id_login").value;
  let password = document.getElementById("id_password").value;
  let password_confirmation = document.getElementById("id_password_confirmation").value;
  if (!login || !password || !password_confirmation){
    authenticate_result(false, 'Please fill all fields.');
  }else if (password != password_confirmation){
    authenticate_result(false, 'Password and password confirmation aren\'t the same.');
  }else {
    ajax('/register')
    .post({
      login: login,
      password: password,
      password_confirmation: password_confirmation
    })
    .then(function(response) {
      var response_json = JSON.parse(response.response);
      if (response_json.success){
        authenticate_result(true, null);
      }
      else{
        authenticate_result(false, 'Couldn\'t register.');
      }
        
    })
    .catch(function(err) {
      authenticate_result(false, 'Something went wrong.');
    });
  
  }
}

function authenticate_result(success, msg){
  console.log('magic: ' + success);
  if (success){
    $("#login_div").hide();
    setCookie('login=' + document.getElementById("id_login").value + ';');
    set_logout_btn();
    map_app.init_map();
  }else{
    document.getElementById("id_errors").innerText = msg;
  }
}

function clearElement(element){
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function add_tr(innerHTML){
  let new_tr = document.createElement('tr');
  let new_td = document.createElement('td');
  if (innerHTML){
    new_td.innerHTML = innerHTML;
  }
  new_tr.appendChild(new_td);
  return new_tr;
}

function set_logout_btn(){
  let btn = document.getElementById("id_login_logout_btn");
  btn.innerText = 'Wyloguj';
  btn.setAttribute('onClick', 'window.logout()');
  let div = document.getElementById("id_login_logout_btn_div");
  let paragraph = document.getElementById('id_info_box');
  paragraph.innerText = 'Zalogowany jako: ' + getCookie('login');
  $("#id_login_logout_btn_div").show();
}

export function logout(){
  setCookie("login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");
  show_login_form();
}

export function init_login_logout_btn() {
  let element = document.createElement('div');
  element.setAttribute('id', 'id_login_logout_btn_div');
  element.setAttribute('class', 'top_right_float');
  let btn = document.createElement('button');
  btn.setAttribute('class', 'btn btn-primary');
  btn.innerText = 'Zaloguj';
  btn.setAttribute('id', 'id_login_logout_btn');
  btn.setAttribute('onClick', "window.show_login_form()");
  element.appendChild(btn);
  let paragraph = document.createElement('p');
  paragraph.setAttribute('id', 'id_info_box');
  element.appendChild(paragraph);
  document.body.appendChild(element);
}

export function show_login_form(){
  create_container_div();
  login_form();
  map_app.remove_map();
  $("#id_login_logout_btn_div").hide();
  $("#login_div").show();
}

function setCookie(cookie){
  document.cookie = cookie;
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}