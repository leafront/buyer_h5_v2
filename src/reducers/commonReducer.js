import { SHOW_POPUP_GIFTS, HIDE_POPUP_GIFTS, SHOW_LOADING, HIDE_LOADING } from '../actions/commonAction'

export default function common(state = {
  isLoading: false,
  isShowPopupGifts: false
}, action) {
  switch (action.type) {
    case SHOW_POPUP_GIFTS:
      return Object.assign({}, state, { isShowPopupGifts: true })
    case HIDE_POPUP_GIFTS:
      return Object.assign({}, state, { isShowPopupGifts: false })
    case SHOW_LOADING:
      return Object.assign({}, state, { isLoading: true })
    case HIDE_LOADING:
      return Object.assign({}, state, { isLoading: false })
    default:
      return state
  }
}
