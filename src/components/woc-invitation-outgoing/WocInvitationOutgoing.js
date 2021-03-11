import { html, LitElement } from 'lit-element'
import { nothing } from 'lit-html'
import { removeInvitation } from '../../services/api.js'

export class WocInvitationOutgoing extends LitElement {
  static get is () {
    return 'woc-invitation-outgoing'
  }

  static get properties () {
    return {
      id: '',
      to: ''
    }
  }

  async handleClickStopSharing () {
    await removeInvitation(this.id)
    this.dispatchEvent(new window.CustomEvent('update-cars', { bubbles: true, composed: true }))
  }

  async handleClickCopy () {
    const type = 'text/plain'
    const blob = new window.Blob([this.inviteUrl], { type })
    const data = [new window.ClipboardItem({ [type]: blob })]
    await navigator.clipboard.write(data)
  }

  render () {
    if (!this.id || !this.to) {
      return nothing
    }

    this.inviteUrl = `${window.location.origin}?invite=${this.id}`

    return html`
      <div>
        ${this.to}: <button @click=${this.handleClickStopSharing}>Stop sharing</button>
        <div>
          Sharing link: ${this.inviteUrl}
          <button @click=${this.handleClickCopy}>Copy</button>
        </div>
      </div>
    `
  }
}
