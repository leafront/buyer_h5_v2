import React,{ PropTypes } from 'react'
import { hashHistory , Link } from 'react-router'
import TopBar from '../components/common/top_bar'
import AttentionMessage from '../components/common/attention_message'

import 'whatwg-fetch'

import { GetLoginInfo , SaveLoginInfo , GetGlobalConfig , SaveAccessToken , SaveHighLevelAccessToken , ConvertObjectToQueryString , GetLocalStorageInfo } from '../common'

class Auth extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      inputSMSCode:null,
      verifyCodeText:'免费验证码',
      countRequestVerifyCode:0,
      phoneNumber:null,
      attetionMessage:{
        isAttentionMessageVisible:false,
        attentionMessageText:null
      }
    }

    this.defaultProps = {
      verifyCodeAgainText:'重新获取',
      totalTimeCountRequestValidateCode:60
    }
  }
  componentWillMount(){
    const PhoneNumber = GetLoginInfo().phoneNumber
    if(!PhoneNumber){
      hashHistory.replace('/loginAndReg/auth')
    }
    this.setState({
      phoneNumber: PhoneNumber
    })
  }
  componentWillUnmount(){
    clearInterval(window.requestVerifyCodeCounter)
  }
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
  startCountWhenToGetNextCode(){
    this.initRequestVerifyCodeTime()

    window.requestVerifyCodeCounter = setInterval(() => {
      if(this.state.countRequestVerifyCode > 0){
        this.setState({
          countRequestVerifyCode:this.state.countRequestVerifyCode - 1,
          verifyCodeText:(this.state.countRequestVerifyCode - 1) + 's'
        })
      }else{
        clearInterval(window.requestVerifyCodeCounter)
        this.setState({
          countRequestVerifyCode:0,
          verifyCodeText:this.defaultProps.verifyCodeAgainText
        })
      }
    },1000)
  }
  initRequestVerifyCodeTime(){
    this.setState({
      countRequestVerifyCode:this.defaultProps.totalTimeCountRequestValidateCode
    })
  }
  async getSMSCode(){

    if(this.state.countRequestVerifyCode > 0){
      return
    }

    const PhoneNumber = GetLoginInfo().phoneNumber
    const RequestData = ConvertObjectToQueryString({
      phone_num:PhoneNumber,
      type:1,
      ts:new Date().getTime()
    })
    const Response = await fetch(
      GetGlobalConfig().env + '/login/requestValidateCode',
      {
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        method:"POST",
        body:RequestData
      }
    )

    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    if(ResponseOK && ResponseJSON.status === 1){
      this.startCountWhenToGetNextCode()
      // this.setState({
      //   responseSMSCode:ResponseJSON.data.validation_code
      // })
    }
  }
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
  async confirmSMSCode(){

    if(this.state.inputSMSCode == null){
      //show message
      this.showAttentionMessage('验证码不能为空！')
      return false
    }

    const LoginInfo = GetLoginInfo()
    const PhoneNumber = LoginInfo.phoneNumber
    const RefreshToken = LoginInfo.refreshToken
    const RequestData = ConvertObjectToQueryString({
      phone_num:PhoneNumber,
      refresh_token:RefreshToken,
      validation_code:this.state.inputSMSCode,
      ts:new Date().getTime()
    })
    const Response = await fetch(
      GetGlobalConfig().env + '/auth/requestAccessTokenHighLevel',
      {
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        method:"POST",
        body:RequestData
      }
    )

    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()

    // const LoginInfo = GetLoginInfo()
    // const PhoneNumber = LoginInfo.phoneNumber
    // const RefreshToken = LoginInfo.refreshToken
    // const Response = await $.ajax({
    //   url:GetGlobalConfig().env + '/auth/requestAccessTokenHighLevel',
    //   method:"post",
    //   data:{
    //     phone_num:PhoneNumber,
    //     refresh_token:RefreshToken,
    //     validation_code:this.state.inputSMSCode,
    //     ts:new Date().getTime()
    //   }
    // })

    if(ResponseOK && ResponseJSON.status !== 1) {
      this.showAttentionMessage(ResponseJSON.msg)
    }
    //set higher level access token here
    if(ResponseOK && ResponseJSON.status === 1){
      SaveAccessToken({
        accessToken:ResponseJSON.data.access_token,
        accessTokenExpiresIn:ResponseJSON.data.access_token_expires_in

      })
      SaveHighLevelAccessToken({
        highLevelAccessToken:ResponseJSON.data.access_token_high_level,
        highLevelAccessTokenExpiresIn:ResponseJSON.data.access_token_high_level_expires_in
      })

      // SaveLoginInfo({
      //   accessToken:Response.data.access_token,
      //   accessTokenExpiresIn:Response.data.access_token_expires_in,
      //   refreshToken:Response.data.refresh_token,
      //   refreshTokenExpiresIn:Response.data.refresh_token_expires_in,
      //   phoneNumber:PhoneNumber,
      //   userName:Response.data.user.user_name
      // })

      if (this.props.params.orderNo) {
        hashHistory.replace('/' + this.props.params.fromPage + '/' + this.props.params.orderNo)
      } else {
        hashHistory.replace('/' + this.props.params.fromPage)
      }
    }
  }
  onInputSMSCode(e){
    const InputSMSCode = e.target.value
    this.setState({
      inputSMSCode:InputSMSCode
    })
  }
  async getVoiceVerify(e){
    const PhoneNumber = this.state.phoneNumber
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const Response = await fetch(
      GetGlobalConfig().env + '/login/requestValidateCode',
      {
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:'phone_num=' + PhoneNumber + '&' + 'type=2' + '&' + 'ts=' + new Date().getTime() + '&' + 'cityCode=' + CityCode,
        method:'POST'
      }
    )
  }
  render(){
    let getVerifyCodeButtonClass = ''
    if(this.state.countRequestVerifyCode > 0){
      getVerifyCodeButtonClass = 'disable'
    }

    return (
      <div className="auth">
        <TopBar/>
        <div>
          <div className="logo"><img width="135" src={require('../../images/login_reg/logo.png')}/></div>
          <div className="attention_msg">
            <p>您正在进行重要操作，可能涉及重要信息或隐私，请通过<b>短信验证（验证手机：{this.state.phoneNumber})确认是本人操作！</b></p>
          </div>
          <div className="group_sms">
            <input className="sms_input" onInput={this.onInputSMSCode.bind(this)} type="number" name="smCode" placeholder="请输入短信验证码"/>
            <button className={"send_sms_button " + getVerifyCodeButtonClass} onClick={this.getSMSCode.bind(this)}>{this.state.verifyCodeText}</button>
          </div>
          <div className="group_voice">
            <span>收不到验证码请获取 </span><button className="send_voice_button" onClick={this.getVoiceVerify.bind(this)}>语音验证码</button>
          </div>
          <div className="submit_smscode">
            <button onClick={this.confirmSMSCode.bind(this)}>确定</button>
          </div>
        </div>
        <AttentionMessage attetionMessage={this.state.attetionMessage}/>
      </div>
    )
  }
}

export default Auth
