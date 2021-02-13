import { LitElement, html } from 'lit-element'
import { setup, isSignedIn, signIn, signOut, getUserName } from '../services/auth.js'

class AuthBar extends LitElement {
  static get properties () {
    return {
      error: String,
      isAuthenticated: Boolean,
      loading: Boolean
    }
  }

  async connectedCallback () {
    super.connectedCallback()
    this.loading = true
    try {
      await setup()
      this.isAuthenticated = isSignedIn()
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
      this.isAuthenticated = true
    } catch (e) {
      this.error = e
    }
    this.loading = false
  }

  async signOut () {
    this.loading = true
    try {
      await signOut()
      this.isAuthenticated = false
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

    if (this.isAuthenticated) {
      return html`
        Hello ${getUserName()}
        <button @click=${this.signOut}>Sign out</button>
      `
    }

    return html`
      <button @click=${this.signIn}>Sign in</button>
    `
  }
}

window.customElements.define('auth-bar', AuthBar)
