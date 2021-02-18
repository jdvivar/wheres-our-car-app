import { LitElement, html } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store, setUser, signInState, signOutState } from '../../services/state.js'
import { setup, signInAuth, signOutAuth, isSignedIn, getEmail, getName } from '../../services/auth.js'

export class WocAuth extends connect(store)(LitElement) {
  static get is () {
    return 'woc-auth'
  }

  static get properties () {
    return {
      error: String,
      loading: Boolean,
      auth: Object,
      isAuthenticated: Boolean
    }
  }

  constructor () {
    super()
    this.error = false
    this.loading = true
    this.auth = {}
    this.isAuthenticated = false
  }

  stateChanged (state) {
    this.isAuthenticated = state.isAuthenticated
    this.user = state.user
  }

  async connectedCallback () {
    super.connectedCallback()
    this.loading = true
    try {
      this.auth = await setup()
      if (isSignedIn(this.auth)) {
        store.dispatch(setUser({
          email: getEmail(this.auth),
          name: getName(this.auth)
        }))
        store.dispatch(signInState())
      } else {
        store.dispatch(signOutState())
      }
    } catch (e) {
      this.error = e
    }
    this.loading = false
  }

  async signIn () {
    this.loading = true
    try {
      await signInAuth(this.auth)
      store.dispatch(setUser({
        email: getEmail(this.auth),
        name: getName(this.auth)
      }))
      store.dispatch(signInState())
    } catch (e) {
      this.error = e
    }
    this.loading = false
  }

  async signOut () {
    this.loading = true
    try {
      await signOutAuth(this.auth)
      store.dispatch(setUser({}))
      store.dispatch(signOutState())
    } catch (e) {
      this.error = e
    }
    this.loading = false
  }

  renderError () {
    return html`<p>${JSON.stringify(this.error)}</p>`
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
        Hi ${this.user.name} (${this.user.email})
        <button @click=${this.signOut}>Sign out</button>
      `
    }

    return html`
      <button @click=${this.signIn}>Sign in</button>
    `
  }
}
