import { configureStore } from '@reduxjs/toolkit'
import cardsReducer from './reducers/cardsSlice'

export default configureStore({
  reducer: {
    cards: cardsReducer,
  },
})
