import React, { PropTypes } from 'react'
import { Link, hashHistory } from 'react-router'
import TopBar from '../components/common/top_bar'
import GlobalLoading from '../components/common/global_loading'
import 'whatwg-fetch'

import { GetGlobalConfig, GetLoginInfo , CheckLogin , CheckHighLevelLogin } from '../common'

class AccountList extends React.Component {
  constructor() {
    super()
  }
  render() {
    return (
      <div className="account_list">
        <ul>
          <li>
            <span>账户余额</span><span><i>￥{this.props.userAccount}</i></span>
          </li>
        </ul>
        <button className="apply_back" style={{display:'none'}}>申请退款(可退金额:￥1000)</button>
      </div>
    )
  }
}

class Account extends React.Component {
  constructor() {
    super()

    this.state = {
      dataLoading:false,
      userAccount: ''
    }
  }
  showLoading(){
    this.setState({
      dataLoading:true
    })
  }
  hideLoading(){
    this.setState({
      dataLoading:false
    })
  }
  async componentDidMount() {
    this.showLoading()

    await this.getUserAccount()

    this.hideLoading()
  }
  async getUserAccount(){
    //check token is set if not return then redirect to login
    const LoginState = CheckLogin()
    const HighLevelLoginState = CheckHighLevelLogin()
    if(!LoginState) {
      hashHistory.replace('/login_and_reg/account')
      return
    }
    if(!HighLevelLoginState){
      hashHistory.replace('/auth/account')
      return
    }

    let access_token = GetLoginInfo().accessToken

    const Response = await fetch(GetGlobalConfig().env + '/hybrid/user/getUserAccount', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'access_token': access_token
      },
      method: 'POST'
    })
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    const Status = ResponseJSON.status
    if (ResponseOK && Status === 1) {
      this.setState({
        userAccount: ResponseJSON.data.userAccount
      })
    } else if (Status === 101) {
      hashHistory.replace('/login_and_reg/account')
    }
  }
  render() {
    return (
      <div className="account">
        <TopBar pageTitle="账户"/>
        <AccountList userAccount={this.state.userAccount}/>
        {
          this.state.dataLoading ?
            <GlobalLoading/> : null
        }
      </div>
    )
  }
}

export default Account
