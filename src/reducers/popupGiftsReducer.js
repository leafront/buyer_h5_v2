import { SHOW_POPUP_GIFTS, HIDE_POPUP_GIFTS } from '../actions/commonAction'

export default function isShowPopupGifts(state = false, action) {
  switch (action.type) {
    case SHOW_POPUP_GIFTS:
      return true
    case HIDE_POPUP_GIFTS:
      return false
    default:
      return state
  }
}
