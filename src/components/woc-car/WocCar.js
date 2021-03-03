import { LitElement, html } from 'lit-element'
import { removeCar } from '../../services/api.js'
import '../woc-location/woc-location.js'
import '../woc-new-location/woc-new-location.js'

export class WocCar extends LitElement {
  static get is () {
    return 'woc-car'
  }

  async handleRemove () {
    await removeCar(this.car.id)
    this.dispatchEvent(new window.CustomEvent('update-cars', { bubbles: true }))
  }

  render () {
    if (this.car.new) {
      return html`<woc-edit-car op="new"></woc-edit-car>`
    }
    return html`
      <div style="border: 1px solid black; padding: 10px; margin: 10px 0;">
        <h3>${this.car.name}</h3>
        <woc-new-location .id=${this.car.id}></woc-new-location>
        ${this.car.locations.map(location => html`<woc-location .location=${location}></woc-location>`)}
        <button @click=${this.handleRemove}>Remove car</button>
        <woc-edit-car op="rename" .car=${this.car}></woc-edit-car>
      </div>
    `
  }
}
