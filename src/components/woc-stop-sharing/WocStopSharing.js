import { html, LitElement } from 'lit-element'
import { nothing } from 'lit-html'
import { removeInvitation } from '../../services/api.js'

export class WocStopSharing extends LitElement {
  static get is () {
    return 'woc-stop-sharing'
  }

  static get properties () {
    return {
      id: '',
      to: ''
    }
  }

  async handleClick () {
    await removeInvitation(this.id)
    this.dispatchEvent(new window.CustomEvent('update-cars', { bubbles: true, composed: true }))
  }

  render () {
    if (!this.id || !this.to) {
      return nothing
    }
    return html`
      <div>
        ${this.to}: <button @click=${this.handleClick}>Stop sharing</button>
      </div>
    `
  }
}
