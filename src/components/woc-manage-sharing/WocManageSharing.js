import { LitElement, html } from 'lit-element'
import { nothing } from 'lit-html'
import { getInvitations } from '../../services/api.js'

import '../woc-stop-sharing/woc-stop-sharing.js'

export class WocManageSharing extends LitElement {
  static get is () {
    return 'woc-manage-sharing'
  }

  static get properties () {
    return {
      invitations: [],
      id: false
    }
  }

  async connectedCallback () {
    super.connectedCallback()
    this.invitations = await getInvitations(this.id)
  }

  renderInvitationsList () {
    if (this.invitations && this.invitations.length) {
      return html`
        <div style="border: 1px solid black; padding: 10px; margin: 10px 0;">
        ${this.invitations.map(({ id, to }) => html`<woc-stop-sharing id=${id} to=${to}></woc-stop-sharing>`)}
        </div>
      `
    }
    return nothing
  }

  render () {
    if (!this.id) {
      return nothing
    }
    return html`
      <button>Share car</button>
      ${this.renderInvitationsList()}
    `
  }
}
