import { LitElement, css, html } from 'lit-element'
import { nothing } from 'lit-html'

import { getInvitation, acceptInvitation } from '../../services/api.js'

export class WocInvitation extends LitElement {
  static get is () {
    return 'woc-invitation'
  }

  constructor () {
    super()
    this.invitation = false
  }

  static get styles () {
    return css`
      div {
        border: 1px solid black;
        padding: 10px;
        margin: 10px 0;
      }
    `
  }

  static get properties () {
    return {
      invitation: Object
    }
  }

  async connectedCallback () {
    super.connectedCallback()
    const params = new URLSearchParams(window.location.search)
    if (params.get('invite')) {
      this.invitation = await getInvitation()
    }
  }

  async handleAcceptInvitation () {
    await acceptInvitation()
    this.dispatchEvent(new window.CustomEvent('update-cars', { bubbles: true }))
  }

  render () {
    if (!this.invitation) {
      return nothing
    }
    return html`
      <div>
        <p>Accept invitation from <b>${this.invitation.from}</b> to share their car <b>${this.invitation.carName}</b>?</p>
        <button @click=${this.handleAcceptInvitation}>Accept</button>
        <button>Reject</button>
      </div>
    `
  }
}
