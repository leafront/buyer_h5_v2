import React from 'react'

class AttentionMessage extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    let attentionMessage = null
    if(this.props.attetionMessage.isAttentionMessageVisible){
      attentionMessage = (
        <div className="attention_message">
          <p className="message_box">{this.props.attetionMessage.attentionMessageText}</p>
        </div>
      )
    }
    return attentionMessage
  }
}

export default AttentionMessage
