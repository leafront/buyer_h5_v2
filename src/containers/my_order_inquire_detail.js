import React from 'react'
import { hashHistory } from 'react-router'
import { GetGlobalConfig, GetLoginInfo } from '../common'
import TopBar from '../components/common/top_bar'
import ImChatButton from '../components/common/im_chat_button'
import FourSafeguards from '../components/common/four_safeguards'
import MyOrderInquireDetailContent from '../components/my_order/my_order_inquire_detail_content'

class MyOrderInquireDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      //directSaleOrderList: []
    }
  }

  async componentDidMount() {
    let access_token = GetLoginInfo().accessToken
    const Response = await fetch(GetGlobalConfig().env + '/hybrid/ds/dsPurchaseIntentList', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'access_token': access_token
      },
      method: 'POST'
    })
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    const Status = await ResponseJSON.status
    if (ResponseOK && Status === 1) {
      //console.log(ResponseJSON)
      this.setState({
        //directSaleOrderList: ResponseJSON.data
      })
    } else if (Status === 101) {
      hashHistory.replace('/login_and_reg/my_order')
    }
  }

  render() {
    return (
      <div className="direct_sale_order">
        <TopBar pageTitle="详情" />
        <ImChatButton />
        <FourSafeguards />
        <MyOrderInquireDetailContent />
      </div>
    )
  }
}

export default MyOrderInquireDetail
