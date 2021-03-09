import { LitElement, html, css } from 'lit-element'
import dialogPolyfill from 'dialog-polyfill'
import { dialogPolyfillStyle } from '../lib/dialog-polyfill.style.js'
import { createInvitation } from '../../services/api.js'

export class WocShareCar extends LitElement {
  static get is () {
    return 'woc-share-car'
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

  async handleUserInput () {
    const form = this.shadowRoot.querySelector('form')
    const to = form.to.value
    await createInvitation({ to, carId: this.car.id, carName: this.car.name })
    this.dispatchEvent(new window.CustomEvent('update-cars', { bubbles: true, composed: true }))
  }

  getDialog () {
    return this.shadowRoot.querySelector('#dialog')
  }

  handleClick () {
    const form = this.shadowRoot.querySelector('form')
    const input = form.to
    input.select()
    this.getDialog().showModal()
  }

  render () {
    return html`
      <button @click=${this.handleClick}>
        Share car
      </button>
      <dialog id="dialog">
        <form method="dialog" @submit=${this.handleUserInput} autocomplete="off">
          <section>
            <label for="to">For:</label>
            <input name="to" type="email" placeholder="friend@example.es" required>
          </section>
          <menu>
            <button type="submit">Confirm</button>
            <button type="button" @click=${() => this.getDialog().close()}>Cancel</button>
          </menu>
        </form>
      </dialog>
    `
  }
}
