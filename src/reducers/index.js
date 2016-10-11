import { combineReducers } from 'redux'

import price from './priceReducer'
import common from './commonReducer'

const rootReducer = combineReducers({
  //price: price,
  common: common
})

export default rootReducer
