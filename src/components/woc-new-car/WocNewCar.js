import { LitElement, html, css } from 'lit-element'
import { createCar } from '../../services/db.js'
import dialogPolyfill from 'dialog-polyfill'
import { dialogPolyfillStyle } from '../lib/dialog-polyfill.style.js'
export class WocNewCar extends LitElement {
  static get is () {
    return 'woc-new-car'
  }

  firstUpdated () {
    super.firstUpdated()
    dialogPolyfill.registerDialog(this.shadowRoot.querySelector('#dialog'))
  }

  static get styles () {
    return css`
      ${dialogPolyfillStyle}
      dialog::backdrop {
        background: rgba(0,0,0,.1);
        backdrop-filter: blur(3px);
      }
    `
  }

  async handleUserInput () {
    const form = this.shadowRoot.querySelector('form')
    const newCar = form.name.value
    await createCar(newCar)
    this.dispatchEvent(new window.CustomEvent('update-cars', { bubbles: true }))
  }

  getDialog () {
    return this.shadowRoot.querySelector('#dialog')
  }

  render () {
    return html`
      <button @click=${() => this.getDialog().showModal()}>+</button>
      <dialog id="dialog">
        <form method="dialog" @submit=${this.handleUserInput} autocomplete="off">
          <section>
            <input name="name" type="text" required>
          </section>
          <menu>
            <button type="submit" value="confirm">Confirm</button>
            <button type="submit" value="cancel" @click=${() => this.getDialog().close()}>Cancel</button>
          </menu>
        </form>
      </dialog>
    `
  }
}
