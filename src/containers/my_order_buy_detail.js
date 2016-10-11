import React from 'react'
import { hashHistory } from 'react-router'
import { GetGlobalConfig, GetLoginInfo } from '../common'
import TopBar from '../components/common/top_bar'
import ImChatButton from '../components/common/im_chat_button'
import FourSafeguards from '../components/common/four_safeguards'
import MyOrderBuyDetailContent from '../components/my_order/my_order_buy_detail_content'

import { CollectClickData } from '../data_collection'

class MyOrderBuyDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dsCarModel: {},
      dsPurchaseIntent: {}
    }
  }

  async componentDidMount() {
    let access_token = GetLoginInfo().accessToken
    const Response = await fetch(GetGlobalConfig().env + '/hybrid/ds/getPurintentDetails', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'access_token': access_token
      },
      body: 'piId=' + this.props.params.piId,
      method: 'POST'
    })
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    const Status = await ResponseJSON.status
    if (ResponseOK && Status === 1) {
      //console.log(ResponseJSON)
      this.setState({
        dsCarModel: ResponseJSON.data.dsCarModel,
        dsPurchaseIntent: ResponseJSON.data.dsPurchaseIntent
      })
    } else if (Status === 101) {
      hashHistory.replace('/login_and_reg/my_order')
    }
  }

  render() {
    let pageTitle = '意向单详情'

    if (this.state.dsPurchaseIntent.piIsPay != 0) {
      pageTitle = '订单详情'
    }

    return (
      <div className="my_order_buy_detail">
        <TopBar pageTitle={pageTitle} />
        <FourSafeguards />
        <ImChatButton />
        <MyOrderBuyDetailContent
          dsCarModel={this.state.dsCarModel}
          dsPurchaseIntent={this.state.dsPurchaseIntent}
        />
      </div>
    )
  }
}

export default MyOrderBuyDetail
