import React from 'react'
import { hashHistory } from 'react-router'
import { GetGlobalConfig, GetLoginInfo } from '../common'
import AttentionMessage from '../components/common/attention_message'
import TopBar from '../components/common/top_bar'
import PayDepositContent from '../components/pay/pay_deposit_content'

class PayDeposit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      payDepositInfo: {},
      payMethod: 'online',
      attetionMessage: {
        isAttentionMessageVisible: false,
        attentionMessageText: null
      }
    }
    this.changePayMethod = this.changePayMethod.bind(this)
    this.showAttentionMessage = this.showAttentionMessage.bind(this)
  }

  changePayMethod(method) {
    this.setState({
      payMethod: method
    })
  }

  async showAttentionMessage(message = null) {
    if (this.state.attetionMessage.isAttentionMessageVisible) {
      return false
    }
    this.setState({
      attetionMessage:{
        isAttentionMessageVisible: true,
        attentionMessageText: message
      }
    })
    await setTimeout(() => {
      this.setState({
        attetionMessage: {
          isAttentionMessageVisible: false,
          attentionMessageText: null
        }
      })
    }, 1500)
  }

  async componentDidMount() {
    /*let access_token = GetLoginInfo().accessToken
    const Response = await fetch(GetGlobalConfig().env + '/hybrid/pay_url/paySuccess', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'access_token': access_token
      },
      body: 'order_no=' + this.props.params.piId + '&subject=直销车订金',
      method: 'POST'
    })
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    const Status = await ResponseJSON.status
    //console.log(ResponseJSON, ResponseOK, Response)
    if (ResponseOK && Status === 1) {
      this.setState({
        payDepositInfo: ResponseJSON.data
      })
    } else if (Status === 101) {
      hashHistory.replace('/login_and_reg/my_order')
    }*/
  }

  render() {
    return (
      <div className="pay_request">
        <TopBar pageTitle="订金支付" />
        <PayDepositContent
          payMethod={ this.state.payMethod }
          onChangePayMethod={ this.changePayMethod }
          orderNo={ this.props.params.piId }
          showAttentionMessage={ this.showAttentionMessage }
        />
        <AttentionMessage attetionMessage={this.state.attetionMessage}/>
      </div>
    )
  }
}

export default PayDeposit
