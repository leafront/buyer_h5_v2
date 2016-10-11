import React from 'react'
import { hashHistory } from 'react-router'
import { GetGlobalConfig, GetLoginInfo, CheckLogin , CheckHighLevelLogin } from '../common'
import TopBar from '../components/common/top_bar'
import ImChatButton from '../components/common/im_chat_button'
import FourSafeguards from '../components/common/four_safeguards'
import MyOrderList from '../components/my_order/my_order_list'

class MyOrder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataLoading:false,
      myOrderInquireList: [],
      myOrderBuyList: []
    }
  }

  showLoading() {
    this.setState({
      dataLoading: true
    })
  }

  hideLoading() {
    this.setState({
      dataLoading: false
    })
  }

  async getUserOrder() {
    const LoginState = CheckLogin()
    const HighLevelLoginState = CheckHighLevelLogin()

    if (!LoginState) {
      hashHistory.replace('/login_and_reg/my_order')
      return
    }

    if (!HighLevelLoginState) {
      //hashHistory.replace('/auth/my_order')
      //return
    }

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
      //console.log(ResponseJSON.data)
      this.setState({
        myOrderBuyList: ResponseJSON.data
      })
    } else if (Status === 101) {
      hashHistory.replace('/login_and_reg/my_order')
    }
  }

  async componentDidMount() {
    this.showLoading()
    this.getUserOrder()
    this.hideLoading()
  }

  render() {
    return (
      <div className="my_order">
        <TopBar pageTitle="订单" />
        <FourSafeguards />
        <MyOrderList
          myOrderInquireList={ this.state.myOrderInquireList }
          myOrderBuyList={ this.state.myOrderBuyList }
        />
      </div>
    )
  }
}

export default MyOrder
