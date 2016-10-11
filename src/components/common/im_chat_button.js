import React from 'react'
import { CallPhone } from '../../common'

export function ImChatButtonTwo() {
    return (
        <button type="button" className="im_chat" onClick={CallPhone.bind(null)}>客服</button>
    )
}

export function ImChatButtonThree() {
    return (
        <button type="button" className="call_kf" data-poicode="MPB32" onClick={CallPhone.bind(null)}>联系购车顾问</button>
    )
}

export function ImChatButtonFour() {
    return (
        <button type="button" className="im_chat" onClick={CallPhone.bind(null)}>客服</button>
    )
}

class ImChatButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="global_go_service_button_wrapper" onClick={CallPhone.bind(null)}>
        <button></button>
      </div>
    )
  }
}

export default ImChatButton
