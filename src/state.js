import { LitState, stateVar } from 'lit-element-state'

class WocState extends LitState {
  isAuthenticated = stateVar(false)
  signInOut (state) {
    this.isAuthenticated = state
  }
}

export const wocState = new WocState()
