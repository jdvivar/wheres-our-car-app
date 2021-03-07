import { LitElement, html } from 'lit-element'
import { nothing } from 'lit-html'
import { getLocations } from '../../services/api.js'

import '../woc-location/woc-location.js'

export class WocLocations extends LitElement {
  static get is () {
    return 'woc-locations'
  }

  constructor () {
    super()
    this.locations = false
    this.id = false
  }

  static get properties () {
    return {
      id: String,
      locations: Array
    }
  }

  async connectedCallback () {
    super.connectedCallback()
    if (this.id) {
      this.locations = await getLocations(this.id)
    }
  }

  render () {
    if (!this.locations || !this.id) {
      return nothing
    }

    return html`
      ${this.locations.map(location => html`
        <woc-location .id=${this.id} .location=${location}></woc-location>
      `)}
    `
  }
}
