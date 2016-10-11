export const SET_COUNTER = 'SET_COUNTER'
export const INCREMENT_COUNTER = 'INCREMENT_COUNTER'
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER'

export function setCounter(value) {
  return {
    type: SET_COUNTER,
    payload: value
  }
}

export function incrementCounter() {
  return {
    type: INCREMENT_COUNTER
  }
}

export function decrementCounter() {
  return {
    type: DECREMENT_COUNTER
  }
}
