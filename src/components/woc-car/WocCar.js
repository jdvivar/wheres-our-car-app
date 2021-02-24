import { LitElement, html } from 'lit-element'
import { removeCar } from '../../services/db.js'

function renderLocation ({ date, user, geo }) {
  const dateString = new Date(date._seconds * 1000).toUTCString()
  const geoURL = `https://www.google.com/maps/search/?api=1&query=${geo._latitude},${geo._longitude}`
  return html`
    <p>
      Location at ${dateString} by ${user}: <a target=_blank href="${geoURL}">see location in Google Maps</a>
    </p>
  `
}

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
        <p>Locations:</p>
        ${this.car.locations.map(renderLocation)}
        <button @click=${this.handleRemove}>Remove</button>
        <woc-edit-car op="rename" .car=${this.car}></woc-edit-car>
      </div>
    `
  }
}
