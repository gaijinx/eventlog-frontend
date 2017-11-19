import application from './application.js';

function component() {
  let element = document.createElement('div');
  element.setAttribute('id', 'main-container')
  element.appendChild(application());
  return element;
}

let element = component();
document.body.appendChild(element);

if (module.hot) {
  module.hot.accept('./application.js', function() {
    document.body.removeChild(element);
    element = component();
    document.body.appendChild(element);
  })
}
