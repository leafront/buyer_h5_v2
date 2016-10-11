import React, { PropTypes } from 'react'
import { hashHistory } from 'react-router'
import TopBar from '../components/common/top_bar'
import ImChatButton from '../components/common/im_chat_button'
import MyInquireList from '../components/myinquire/my_inquire_list'
import { GetGlobalConfig, GetLoginInfo } from '../common'
import { GlobalLoading } from '../components/common/global_loading'
import 'whatwg-fetch'

class MyInquire extends React.Component {
  constructor() {
    super()
    this.state = {
      myInquireList: [],
      now: null,
      elapsedTime: 0,
      dataLoading:false
    }
  }

  async componentDidMount() {
    let access_token = GetLoginInfo().accessToken
    const Response = await fetch(GetGlobalConfig().env + '/hybrid/ask/getAskList', {
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
      this.setState({
        myInquireList: ResponseJSON.data.list,
        now: ResponseJSON.data.now
      })
    } else if (Status === 101) {
      hashHistory.replace('/login_and_reg/my_inquire')
    }
  }

  async timeCounterInterval() {
    await setInterval(() => {
      this.setState({
        elapsedTime: this.state.elapsedTime + 1
      })
    }, 1000)
  }

  render() {
    return (
      <div className="my_inquire">
        <TopBar pageTitle="比价购车单"/>
        <ImChatButton/>
        <MyInquireList
          lists={this.state.myInquireList}
          now={this.state.now}
          elapsedTime={this.state.elapsedTime}
        />
        {
          this.state.dataLoading ?
          <GlobalLoading/> : null
        }
      </div>
    )
  }
}

export default MyInquire
