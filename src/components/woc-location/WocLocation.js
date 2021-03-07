import { LitElement, html, css } from 'lit-element'
import { nothing } from 'lit-html'

import { removeLocation } from '../../services/api.js'

export class WocLocation extends LitElement {
  static get is () {
    return 'woc-location'
  }

  // static get properties () {
  //   return {
  //     location: Object
  //   }
  // }

  static get styles () {
    return css`
      div {
        border: 1px solid black;
        margin: 10px 0;
        padding: 10px;
      }
    `
  }

  async handleRemove () {
    console.log({ carId: this.id, ...this.location })
    await removeLocation({ carId: this.id, ...this.location })
    this.dispatchEvent(new window.CustomEvent('update-cars', { bubbles: true, composed: true }))
  }

  render () {
    if (!this.location && !this.id) {
      return nothing
    }
    const { date, userName, geo } = this.location
    const dateString = new Date(date._seconds * 1000).toUTCString()
    const geoURL = `https://www.google.com/maps/search/?api=1&query=${geo.latitude},${geo.longitude}`
    return html`
      <div>
        Location at ${dateString} by ${userName}:
        <br>
        <a target=_blank href="${geoURL}">See location in Google Maps</a>
        <button @click=${this.handleRemove}>Remove location</button>
      </div>
    `
  }
}
