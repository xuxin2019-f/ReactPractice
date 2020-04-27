import { initVNode } from './kvdom'
function render(vdom, container) {
  // container.innerHTML = `<pre>${JSON.stringify(vdom, null, 2)}</pre>`
  const dom = initVNode(vdom)
  container.appendChild(dom)
}
export default { render }
