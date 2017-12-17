import * as login_utils from './login_form.js';
import * as map_app from './application.js';
import 'bootstrap/dist/css/bootstrap.min.css';

window.authenticate = login_utils.authenticate;
window.register = login_utils.register;
window.show_login_form = login_utils.show_login_form;
window.show_register_form = login_utils.register_form;
window.logout = login_utils.logout;
window.get_marker_data_by_id = map_app.get_marker_data_by_id;
window.vote = map_app.vote;
window.add_new_event = map_app.add_new_event;

// function logout_btn() {
//   let element = document.createElement('div');
//   element.setAttribute('id', 'logout_btn_div');
//   element.innerHTML = '<input class="top_right_float" type="submit" value="Wyloguj" onClick="window.show_login_form()"><br/><p>Zalogowany jako:</p>'
//   return element;
// }
login_utils.init_login_logout_btn();

// let login_btn_element = login_btn();
// document.body.appendChild(login_btn_element);
// map_app.init_map();
if (module.hot) {
  module.hot.accept('./application.js', function() {
    document.body.removeChild(element);
    element = component();
    document.body.appendChild(element);
  })
}
