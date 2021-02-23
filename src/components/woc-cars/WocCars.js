import { LitElement, html } from 'lit-element'
import { nothing } from 'lit-html'
import { connect } from 'pwa-helpers'
import { store } from '../../services/state.js'
import { getCars } from '../../services/db.js'
import { WocNewCar } from '../woc-new-car/WocNewCar.js'
import { WocCar } from '../woc-car/WocCar.js'

window.customElements.define(WocNewCar.is, WocNewCar)
window.customElements.define(WocCar.is, WocCar)
export class WocCars extends connect(store)(LitElement) {
  static get is () {
    return 'woc-cars'
  }

  static get properties () {
    return {
      cars: Object,
      isAuthenticated: Boolean,
      loading: Boolean
    }
  }

  constructor () {
    super()
    this.isAuthenticated = false
    this.cars = undefined
    this.loading = true
  }

  async stateChanged (state) {
    this.isAuthenticated = state.isAuthenticated
    try {
      if (state.isAuthenticated) {
        this.updateCars()
      }
    } catch {
      this.isAuthenticated = false
    }
  }

  async updateCars () {
    this.loading = true
    this.cars = await getCars()
    this.loading = false
  }

  handleNewCar () {
    this.updateCars()
  }

  render () {
    if (!this.isAuthenticated) {
      return nothing
    }

    if (this.loading) {
      return html`<p>Loading cars...</p>`
    }

    return html`
      <div @update-cars=${this.handleNewCar}>
        <h2>Your cars</h2>
        <woc-new-car></woc-new-car>
        ${
          this.cars.length === 0
          ? html`<p>You don\'t have any cars, add one!</p>`
          : this.cars.map(car => html`<woc-car .car=${car}></woc-car`)
        }
      </div>
    `
  }
}
