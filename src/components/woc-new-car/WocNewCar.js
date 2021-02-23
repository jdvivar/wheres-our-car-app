import { LitElement, html, css } from 'lit-element'
import { createCar } from '../../services/db.js'

export class WocNewCar extends LitElement {
  static get is () {
    return 'woc-new-car'
  }

  static get styles () {
    return css`
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
    this.dispatchEvent(new window.CustomEvent('new-car-added'))
  }

  handleOpenDialog () {
    const dialog = this.shadowRoot.querySelector('#dialog')
    dialog.showModal()
  }

  render () {
    return html`
      <button @click=${this.handleOpenDialog}>+</button>
      <dialog id="dialog">
        <form method="dialog">
          <section>
            <input name="name" type="text">
          </section>
          <menu>
            <button type="submit" value="confirm" @click=${this.handleUserInput}>Confirm</button>
            <button type="submit" value="cancel">Cancel</button>
          </menu>
        </form>
      </dialog>
    `
  }
}
