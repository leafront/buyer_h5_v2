export const SHOW_POPUP_GIFTS = 'SHOW_POPUP_GIFTS'
export const HIDE_POPUP_GIFTS = 'HIDE_POPUP_GIFTS'
export const SHOW_LOADING = 'SHOW_LOADING'
export const HIDE_LOADING = 'HIDE_LOADING'

export function showPopupGifts() {
  return {
    type: SHOW_POPUP_GIFTS
  }
}

export function hidePopupGifts() {
  return {
    type: HIDE_POPUP_GIFTS
  }
}

export function showLoading() {
  return {
    type: SHOW_LOADING
  }
}

export function hideLoading() {
  return {
    type: HIDE_LOADING
  }
}
