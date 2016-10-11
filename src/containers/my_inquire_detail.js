import React, { PropTypes } from 'react'
import { hashHistory } from 'react-router'
import TopBar from '../components/common/top_bar'
import MyInquireDetailContent from '../components/myinquire/my_inquire_detail_content'
import { GetGlobalConfig, GetLoginInfo } from '../common'
import { CollectClickData } from '../data_collection'
import 'whatwg-fetch'


class ServiceMember extends React.Component {
  constructor(props){
    super(props)

  }
  render(){
    if(!this.props.isServiceMemberVisible){
      return null
    }
    return (
      <div className="continuePrice">
        <div className="continueContent">
          <div className="continueImg">
            <img src={require('../../images/user_center/servicePic.png')}/>
          </div>
          <div className="continueText">
            <p>我是您的砍价顾问小朱：<span>18512111384</span></p>
            <p>已收到您的需求，30分钟内将与您联系，</p>
            <p>请保持手机畅通！</p>
            <button onClick={this.props.hideServiceMember.bind(this)}>关闭</button>
          </div>
        </div>
      </div>
    )
  }
}

class MyInquireDetail extends React.Component {
  constructor() {
    super()
    this.state = {
      myInquireDetailList:[],
      myInquireDetailCarMap: {},
      current: '',
      isServiceMemberVisible:false
    }
  }

  showServiceMember(){
    this.setState({
      isServiceMemberVisible:true
    })
  }

  hideServiceMember(){
    this.setState({
      isServiceMemberVisible:false
    })
  }


  toggleTab(index) {
    CollectClickData({poicode: 'MPB11'})
    this.setState({
      current: index
    })
  }

  async componentDidMount() {
    let access_token = GetLoginInfo().accessToken
    const Response = await fetch(GetGlobalConfig().env + '/hybrid/ask/getRespondDetailList',{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'access_token': access_token
      },
      body: 'askpId=' + this.props.params.askpid,
      method: 'POST'
    })

    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    const Status = await ResponseJSON.status
    if (ResponseOK && Status === 1) {
      this.setState({
        myInquireDetailList: ResponseJSON.data.list,
        myInquireDetailCarMap: ResponseJSON.data,
        current: 0
      })

    } else if (Status === 101) {
      hashHistory.replace('/loginAndReg/my_inquire')
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

  render() {
    return (
      <div className="my_inquire_detail">
        <TopBar pageTitle="报价详情"/>
        <MyInquireDetailContent
          lists={this.state.myInquireDetailList}
          item={this.state.myInquireDetailCarMap}
          current={this.state.current}
          callback={this.toggleTab.bind(this)}
          askpid={this.props.params.askpid}
          isServiceMemberVisible={this.state.isServiceMemberVisible}
          showLoading={this.showLoading.bind(this)}
          hideLoading={this.hideLoading.bind(this)}
          showServiceMember={this.showServiceMember.bind(this)}
          hideServiceMember={this.hideServiceMember.bind(this)}
        />
        <ServiceMember
        isServiceMemberVisible={this.state.isServiceMemberVisible}
        showServiceMember={this.showServiceMember.bind(this)}
        hideServiceMember={this.hideServiceMember.bind(this)}
        />
      </div>
    )
  }
}

export default MyInquireDetail
