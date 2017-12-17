import 'bootstrap/dist/css/bootstrap.css';

export function create_container_div(){
  let login_div = document.createElement('div');
  login_div.setAttribute('id', 'login_div');
  let login_register_form = document.createElement('form');
  login_register_form.setAttribute('method', 'post');
  let login_table = document.createElement('table');
  login_table.setAttribute('id', 'login_table');
  login_table.setAttribute('class', 'table middlebox');
  login_table.setAttribute('style', 'width:300px;');
  login_register_form.appendChild(login_table);
  login_div.appendChild(login_register_form);
  return login_div;
}

export function login_form() {
    let login_table = document.getElementById('login_table');
    
    clearElement(login_table); 
    login_table.appendChild(add_tr('Login:'));
    login_table.appendChild(add_tr('<input type="text" placeholder="Wpisz login" name="login">'));
    login_table.appendChild(add_tr('Haslo:'));
    login_table.appendChild(add_tr('<input type="password" placeholder="Wpisz haslo" name="password">'));
    login_table.appendChild(add_tr('<input class="btn" type="submit" value="Zaloguj">'));
    login_table.appendChild(add_tr('<input class="btn" type="submit" value="Nie masz konta? Zarejestruj sie" onClick="window.show_register_form()">'));    
  }

export function register_form() {
    let login_table = document.getElementById('login_table');
    clearElement(login_table);  
    login_table.appendChild(add_tr('Login:'));
    login_table.appendChild(add_tr('<input type="text" placeholder="Wpisz login" name="login">'));
    login_table.appendChild(add_tr('Haslo:'));
    login_table.appendChild(add_tr('<input type="password" placeholder="Wpisz haslo" name="password">'));
    login_table.appendChild(add_tr('Powtorz haslo:'));
    login_table.appendChild(add_tr('<input type="password" placeholder="Powtorz haslo" name="password_confirmation">'));
    login_table.appendChild(add_tr('<input class="btn" type="submit" value="Rejestruj">'));    
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
