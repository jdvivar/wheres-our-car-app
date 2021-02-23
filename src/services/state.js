import { createSlice, configureStore } from '@reduxjs/toolkit'

const { actions: authActions, reducer: authReducer } = createSlice({
  name: 'isAuthenticated',
  initialState: false,
  reducers: {
    signInState: () => true,
    signOutState: () => false
  }
})

const { signInState, signOutState } = authActions

const store = configureStore({
  reducer: {
    isAuthenticated: authReducer
  }
})

export {
  store,
  signInState,
  signOutState
}
