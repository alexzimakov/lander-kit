export function defineCustomElement(name, component) {
  if (customElements.get(name) === undefined) {
    customElements.define(name, component);
  }
}
