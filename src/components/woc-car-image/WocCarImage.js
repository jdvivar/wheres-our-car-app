import { LitElement, html, css } from 'lit-element'
import { nothing } from 'lit-html'
import { editCar } from '../../services/api.js'

const {
  SNOWPACK_PUBLIC_CLOUDINARY_PRESET,
  SNOWPACK_PUBLIC_CLOUDINARY_CLOUD,
  SNOWPACK_PUBLIC_GAPI_CUSTOM_SEARCH_KEY
} = import.meta.env

export class WocCarImage extends LitElement {
  static get is () {
    return 'woc-car-image'
  }

  static get styles () {
    return css`
      img {
        width: 100%;
      }
    `
  }

  static get properties () {
    return {
      imageUrl: String,
      car: Object
    }
  }

  constructor () {
    super()
    this.imageUrl = 'https://placekitten.com/300/200'
  }

  handleCloudinary (error, result) {
    if (!error && result && result.event === 'success') {
      this.imageUrl = result.info.secure_url
      editCar({ key: 'imageUrl', value: this.imageUrl, id: this.car.id })
    }
  }

  async handleUpload () {
    try {
      await import('/api/cloudinary-widget')
      const widget = window.cloudinary.createUploadWidget({
        cloudName: SNOWPACK_PUBLIC_CLOUDINARY_CLOUD,
        uploadPreset: SNOWPACK_PUBLIC_CLOUDINARY_PRESET,
        googleApiKey: SNOWPACK_PUBLIC_GAPI_CUSTOM_SEARCH_KEY
      },
      this.handleCloudinary.bind(this))
      widget.open()
    } catch {
      console.log('Couldn\'t download cloudinary widget')
    }
  }

  render () {
    return html`
      <img src=${this.car.imageUrl ? this.car.imageUrl : this.imageUrl}></img>
      ${
        this.car.isMine
        ? html`<button @click=${this.handleUpload}>Upload image</button>`
        : nothing
      }
      
    `
  }
}
