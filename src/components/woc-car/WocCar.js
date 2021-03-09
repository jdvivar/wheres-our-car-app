import { LitElement, html } from 'lit-element'
import { nothing } from 'lit-html'
import { removeCar } from '../../services/api.js'
import '../woc-new-location/woc-new-location.js'
import '../woc-locations/woc-locations.js'
import '../woc-manage-sharing/woc-manage-sharing.js'

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
        <button @click=${this.handleRemove}>
          ${
            this.car.isMine
            ? 'Remove car'
            : 'Stop sharing car'
          }
        </button>
        <woc-edit-car op="rename" .car=${this.car}></woc-edit-car>
        ${
          this.car.isMine
          ? html`<woc-manage-sharing .car=${this.car}></woc-manage-sharing>`
          : nothing
        }
        <div style="border: 1px solid black; padding: 10px; margin: 10px 0;">
          <woc-new-location id=${this.car.id}></woc-new-location>
          <woc-locations id=${this.car.id}></woc-locations>
        </div>
      </div>
    `
  }
}
