import { LitElement, html } from 'lit-element'
import { nothing } from 'lit-html'
import { connect } from 'pwa-helpers'
import { store } from '../../services/state.js'
import { getCars, getLocations } from '../../services/db.js'

function renderLocation (location) {
  const dateString = new Date(location.date._seconds).toUTCString()
  return html`
    <p>
      Location at ${dateString} by ${location.user}: <a href="geo:${location.geo._latitude},${location.geo._longitude}">see location</a>
    </p>
  `
}

function renderCar (car) {
  return html`
    <div style="border: 1px solid black; padding: 10px; margin: 10px 0;">
      <h3>${car.name}</h3>
      <p>Locations:</p>
      ${car.locations.map(renderLocation)}
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
      if (state.isAuthenticated && state.user && state.user.email) {
        this.loading = true
        this.cars = await getCars(state.user.email)
        this.cars.forEach(async (car) => {
          car.locations = await getLocations(car.id)
        })
        this.loading = false
      }
    } catch {
      this.isAuthenticated = false
    }
  }

  render () {
    if (!this.isAuthenticated) {
      return nothing
    }

    if (this.loading) {
      return html`Loading cars...`
    }

    return html`
      <h2>Your cars</h2>
      ${this.cars.length === 0 ? html`<p>You don\'t have any cars, add one!</p>` : nothing}
      ${this.cars.map(renderCar)}
    `
  }
}
