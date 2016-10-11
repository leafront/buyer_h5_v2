import { SET_COUNTER, INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/priceAction'

export default function user(state = {
  loan: 'd',
  paizhao: 'h'
}, action) {
  switch (action.type) {
    case SET_COUNTER:
      return action.payload
    case INCREMENT_COUNTER:
      return state + 1
    case DECREMENT_COUNTER:
      return state - 1
    default:
      return state
  }
}
