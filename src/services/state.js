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

const { actions: userActions, reducer: userReducer } = createSlice({
  name: 'user',
  initialState: {
    name: '',
    email: ''
  },
  reducers: {
    setUser (state, { payload }) {
      const { name, email } = payload
      state.name = name
      state.email = email
    }
  }
})

const { setUser } = userActions

const store = configureStore({
  reducer: {
    isAuthenticated: authReducer,
    user: userReducer
  }
})

export {
  store,
  signInState,
  signOutState,
  setUser
}
