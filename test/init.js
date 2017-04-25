// Patches the inject function so that all tests run with the strict dependency injection flag on.
let originalInject = window.inject;
window.inject = (...args) => {
  if (module.$$currentSpec) {
    originalInject.strictDi(true);
  }
  originalInject.call(window, ...args);
};