import { LitElement, html } from 'lit-element'
import { nothing } from 'lit-html'
import { connect } from 'pwa-helpers'
import { store } from '../../services/state.js'
import { getCars } from '../../services/db.js'

function renderCar (car) {
  return html`
    <div style="border: 1px solid black; padding: 10px; margin: 10px 0;">
      <h3>${car.name}</h3>
    </div>
  `
}

export class WocCars extends connect(store)(LitElement) {
  static get is () {
    return 'woc-cars'
  }

  static get properties () {
    return {
      cars: Object,
      isAuthenticated: Boolean
    }
  }

  constructor () {
    super()
    this.isAuthenticated = false
    this.cars = undefined
  }

  async stateChanged (state) {
    this.isAuthenticated = state.isAuthenticated
    try {
      if (state.isAuthenticated && state.user && state.user.email) {
        this.cars = await getCars(state.user.email)
      }
    } catch {
      this.isAuthenticated = false
    }
  }

  // async connectedCallback () {
  //   super.connectedCallback()
  //   try {
  //     this.cars = await getCars()
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }

  render () {
    if (!this.isAuthenticated || !this.cars) {
      return nothing
    }
    return html`
      <h2>Your cars</h2>
      ${this.cars.map(renderCar)}
    `
  }
}
