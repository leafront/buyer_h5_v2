import React from 'react'
import { hashHistory , Link } from 'react-router'
import TopBar from '../components/common/top_bar'
import AttentionMessage from '../components/common/attention_message'
import UserForm from '../components/login_and_reg/user_form'
import GlobalLoading from '../components/common/global_loading'
import { SaveLoginInfo , CheckLogin , GetGlobalConfig , GetAccessToken, GetHighLevelAccessToken , GetLocalStorageInfo} from '../common'
import { CollectClickData } from '../data_collection'

class BottomProtocol extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isProtocolChecked: false
    }
  }
  switchProtocolChecked(){
    this.setState({
      isProtocolChecked:!this.state.isProtocolChecked
    })
    CollectClickData({poicode:'MD21'})
  }
  render(){
    let protocolCheckedClass = ''
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    if(this.state.isProtocolChecked){
      protocolCheckedClass = 'active'
    }
    return (
      <div className="bottom_protocol">
        <div className="login_contact_call fr">
          { CityCode == '310000' ?
            <a href="tel:4008798779"></a>
            :<a href="tel:4008881822"></a>
          }
        </div>
        <div className="login_protocol_text">
          <p className={"login_protocol_content " + protocolCheckedClass }>
            <label onClick={this.switchProtocolChecked.bind(this)}>我已阅读并同意</label><span>好买车服务协议</span>
          </p>
          <p className="phone_call">
            { CityCode == '310000' ?
              <a href="tel:4008798779" onClick={CollectClickData.bind(null,{poicode:'MD20'})}>好买车客服热线<span>400-879-8779</span></a>
              :<a href="tel:4008881822" onClick={CollectClickData.bind(null,{poicode:'MD20'})}>好买车客服热线<span>400-888-1822</span></a>
            }
          </p>
        </div>
      </div>
    )
  }
}

class LoginAndReg extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // currentUserId:props.params.userName
      fromPage:props.params.fromPage || "",
      orderNo: props.params.orderNo || '',
      /* Attention Message setting */
      attetionMessage:{
        isAttentionMessageVisible:false,
        attentionMessageText:null
      },
      dataLoading:false
      /* Attention Message setting */
    }
  }
  componentDidMount() {

  }
  /* Attention Message method */
  async showAttentionMessage(message = null){
    if(this.state.attetionMessage.isAttentionMessageVisible){
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
        attetionMessage:{
          isAttentionMessageVisible: false,
          attentionMessageText: null
        }
      })
    },1500)
  }
  /* Attention Message method */
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
    let pageTitle = '登录'
    if(this.state.fromPage == 'car_shop'){
      pageTitle = '开始比价'
    }

    return (
      <div className="login_and_reg">
        <TopBar pageTitle={pageTitle}/>
        <UserForm
          showLoading={this.showLoading.bind(this)}
          hideLoading={this.hideLoading.bind(this)}
          showAttentionMessage={this.showAttentionMessage.bind(this)}
          fromPage={this.state.fromPage}
          orderNo={this.state.orderNo}
        />
        <BottomProtocol/>
        <AttentionMessage attetionMessage={this.state.attetionMessage}/>
        {
          this.state.dataLoading ?
            <GlobalLoading/> : null
        }
      </div>
    )
  }
}
export default LoginAndReg
