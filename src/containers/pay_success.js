import React from 'react'
import { GetGlobalConfig, GetLoginInfo } from '../common'
import TopBar from '../components/common/top_bar'
import PaySuccessContent from '../components/pay/pay_success_content'

class PaySuccess extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      paySuccessInfo: {}
    }
  }

  async componentDidMount() {
    let access_token = GetLoginInfo().accessToken
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
        paySuccessInfo: ResponseJSON.data
      })
    } else if (Status === 101) {
      hashHistory.replace('/login_and_reg/my_order')
    }
  }

  render() {
    return (
      <div className="pay_success">
        <TopBar pageTitle="支付成功" />
        <PaySuccessContent
          paySuccessInfo={this.state.paySuccessInfo}
        />
      </div>
    )
  }
}

export default PaySuccess
