import { LitElement, html } from 'lit-element'
import { observeState } from 'lit-element-state'
import { wocState } from '../state.js'
import { isSignedIn, signIn, signOut, getUserName, getEmail } from '../services/auth.js'

class WocAuthBar extends observeState(LitElement) {
  static get properties () {
    return {
      error: String,
      loading: Boolean
    }
  }

  async connectedCallback () {
    super.connectedCallback()
    this.loading = true
    try {
      wocState.signInOut(await isSignedIn())
    } catch (e) {
      this.error = e
    }
    this.loading = false
  }

  renderError () {
    return html`<p>${JSON.stringify(this.error)}</p>`
  }

  async signIn () {
    this.loading = true
    try {
      await signIn()
    } catch (e) {
      this.error = e
    }
    this.loading = false
  }

  async signOut () {
    this.loading = true
    try {
      await signOut()
    } catch (e) {
      this.error = e
    }
    this.loading = false
  }

  renderLoading () {
    return html`<p>Loading...</p>`
  }

  render () {
    if (this.loading) {
      return this.renderLoading()
    }

    if (this.error) {
      return this.renderError()
    }

    if (wocState.isAuthenticated) {
      return html`
        Hi ${getUserName()} (${getEmail()})
        <button @click=${this.signOut}>Sign out</button>
      `
    }

    return html`
      <button @click=${this.signIn}>Sign in</button>
    `
  }
}

window.customElements.define('woc-auth-bar', WocAuthBar)
