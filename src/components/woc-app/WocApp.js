import { LitElement, html } from 'lit-element'
import '../woc-auth/woc-auth.js'
import '../woc-cars/woc-cars.js'

export class WocApp extends LitElement {
  static get is () {
    return 'woc-app'
  }

  render () {
    return html`
      <p>(ALPHA)</p>
      <h1>Where's our car?</h1>
      <woc-auth></woc-auth>
      <woc-cars></woc-cars>
    `
  }
}
