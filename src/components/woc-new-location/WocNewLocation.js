import { LitElement, html, css } from 'lit-element'
import { createLocation } from '../../services/api.js'
import dialogPolyfill from 'dialog-polyfill'
import { dialogPolyfillStyle } from '../lib/dialog-polyfill.style.js'

function getCurrentPosition () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true })
  })
}

export class WocNewLocation extends LitElement {
  static get is () {
    return 'woc-new-location'
  }

  firstUpdated () {
    super.firstUpdated()
    dialogPolyfill.registerDialog(this.shadowRoot.querySelector('#dialog'))
  }

  static get styles () {
    return css`
      ${dialogPolyfillStyle}
    `
  }

  static get properties () {
    return {
      loading: Boolean
    }
  }

  async handleUserInput () {
    this.getDialog().close()
    if (navigator.geolocation) {
      this.loading = true
      const location = await getCurrentPosition()
      await createLocation({
        geo: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        carId: this.id
      })
      this.loading = false
      this.dispatchEvent(new window.CustomEvent('update-cars', { bubbles: true, composed: true }))
    }
  }

  getDialog () {
    return this.shadowRoot.querySelector('#dialog')
  }

  render () {
    if (this.loading) {
      return html`Adding location...`
    }
    return html`
      <button @click=${() => this.getDialog().showModal()}>
        New location
      </button>
      <dialog id="dialog">
        The browser will ask for permission to get your location.
        <menu>
          <button @click=${this.handleUserInput}>OK</button>
        </menu>
      </dialog>
    `
  }
}
