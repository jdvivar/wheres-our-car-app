import { LitElement, html, css } from 'lit-element'
import { createCar, renameCar } from '../../services/api.js'
import { getName, setup } from '../../services/auth.js'
import dialogPolyfill from 'dialog-polyfill'
import { dialogPolyfillStyle } from '../lib/dialog-polyfill.style.js'

export class WocEditCar extends LitElement {
  static get is () {
    return 'woc-edit-car'
  }

  static get properties () {
    return {
      op: String,
      car: Object
    }
  }

  async connectedCallback () {
    super.connectedCallback()
    if (this.op === 'new') {
      const auth = await setup()
      this.car = { name: `${getName(auth)}'s car` }
    }
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
    const name = form.name.value
    if (this.op === 'new') {
      await createCar(name)
    } else {
      await renameCar({ name, id: this.car.id })
    }
    this.dispatchEvent(new window.CustomEvent('update-cars', { bubbles: true, composed: true }))
  }

  getDialog () {
    return this.shadowRoot.querySelector('#dialog')
  }

  handleClick () {
    const form = this.shadowRoot.querySelector('form')
    const input = form.name
    input.select()
    this.getDialog().showModal()
  }

  render () {
    return html`
      <button @click=${this.handleClick}>
        ${this.op === 'new' ? 'New car' : 'Rename car'}
      </button>
      <dialog id="dialog">
        <form method="dialog" @submit=${this.handleUserInput} autocomplete="off">
          <section>
            <input name="name" type="text" required value=${this.car.name}>
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
