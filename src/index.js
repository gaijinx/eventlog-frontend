import application from './application.js';
import * as login_utils from './login_form.js';
import register_form from './login_form.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import ajax from 'es-ajax';

function component() {
  let element = document.createElement('div');
  element.setAttribute('id', 'main-container')
  element.appendChild(application());
  return element;
}

// document.body.appendChild(component());

function show_login_form(){
  let loginTable = login_utils.create_container_div();
  document.body.appendChild(loginTable);
  login_utils.login_form();
  $("#login_btn_div").hide();
}

function show_register_form(){
  login_utils.register_form();
}

window.authenticate = login_utils.authenticate;
window.register = login_utils.register;
window.show_login_form = show_login_form;
window.show_register_form = show_register_form;

function login_btn() {
  let element = document.createElement('div');
  element.setAttribute('id', 'login_btn_div');
  element.innerHTML = '<input class="top_right_float" type="submit" value="Zaloguj" onClick="window.show_login_form()">'
  return element;
}

let login_btn_element = login_btn();
document.body.appendChild(login_btn_element);

if (module.hot) {
  module.hot.accept('./application.js', function() {
    document.body.removeChild(element);
    element = component();
    document.body.appendChild(element);
  })
}
