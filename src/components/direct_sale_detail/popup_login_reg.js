import React from 'react'
import AttentionMessage from '../../components/common/attention_message'
import GlobalLoading from '../../components/common/global_loading'
import $ from 'jquery'

import { GetGlobalConfig , SaveLoginInfo , GetLocalStorageInfo , CheckGUIDIsSet , GetQueryStringFromSearchByName } from '../../common'

import { CollectClickData } from '../../data_collection'

class PopupLoginAndReg extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      phoneNumber: "",
      nickName:"",
      isOldUser:true,
      attetionMessage:{
        isAttentionMessageVisible:false,
        attentionMessageText:''
      },
      validationCode:"",
      verifyCodeText:'免费验证码',
      countRequestVerifyCode:0
    }

    this.defaultProps = {
      verifyCodeAgainText:'重新获取',
      totalTimeCountRequestValidateCode:60
    }
  }
  componentWillUnmount(){
    clearInterval(window.requestVerifyCodeCounter)
  }
  doRegOrDoLogin(e){
    // console.log(this.state.isOldUser === true)
    if(this.state.isOldUser){
      this.doLogin(e)
    }else{
      this.doReg(e)
    }
  }
  async doReg(e){
    const PhoneNumber = this.state.phoneNumber
    const Platform = GetGlobalConfig().platform
    const FromPage = this.props.fromPage

    const UserGUID = CheckGUIDIsSet()
    const UserSelectedParityOptions = JSON.parse(sessionStorage.getItem('USER_SELECTED_PARITY_OPTIONS'))
    const UserSelectedModelId = UserSelectedParityOptions && UserSelectedParityOptions.modelId
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    let businessSourceAttr = 1
    let businessRemarkAttr = this.props.carDetailList[this.props.currentCarModelIndex].modelId

    let marketOrigin = decodeURI(GetQueryStringFromSearchByName('bk')) || ''
    let marketKeyWord = decodeURI(GetQueryStringFromSearchByName('kw')) || ''

    if(this.state.validationCode == ''){
      this.showAttentionMessage('验证码不能为空')
      return
    }
    if(this.state.nickName == ''){
      this.showAttentionMessage('请输入您的称呼')
      return
    }

    this.props.showLoading()

    const Response = await $.ajax({
      url:GetGlobalConfig().env + '/login/v2/signup',
      data:{
        phone_num:PhoneNumber,
        validation_code:this.state.validationCode,
        user_name:this.state.nickName,
        sys_type:Platform,
        business_source:businessSourceAttr,
        business_remark:businessRemarkAttr,
        market_origin:marketOrigin,
        market_keyWord:marketKeyWord,
        cityCode:CityCode,
        ts:new Date().getTime()
      },
      method:'post',
      dataType:'json'
    })

    this.props.hideLoading()

    if(Response && Response.status !== 1){
      this.showAttentionMessage(Response.msg)
      return
    }
    if(Response && Response.status === 1){
      SaveLoginInfo({
        accessToken:Response.data.access_token,
        accessTokenExpiresIn:Response.data.access_token_expires_in,
        refreshToken:Response.data.refresh_token,
        refreshTokenExpiresIn:Response.data.refresh_token_expires_in,
        phoneNumber:PhoneNumber,
        userName:Response.data.user.user_name
      })

      this.showAttentionMessage('注册成功')

      // setTimeout(() => {
      //   hashHistory.replace('/' + FromPage)
      // },1500)
      this.props.hidePopupLoginAndReg()

      this.props.goCarTotalPrice()
    }
  }
  validatePhoneIsEmpty(phoneNumber) {
    return phoneNumber == ""
  }
  validatePhoneFormat(phoneNumber) {
    const PhoneNumberPattern = /^0?1[123456789]\d{9}$/;
    return PhoneNumberPattern.test(phoneNumber)
  }
  showAttentionMessageWhenPhoneInvalid(){
    const PhoneNumber = this.state.phoneNumber
    const PhoneNumberValid = this.validatePhoneFormat(PhoneNumber)
    const PhoneNumberIsEmpty = this.validatePhoneIsEmpty(PhoneNumber)
    // console.log(PhoneNumberIsEmpty)
    if(PhoneNumberIsEmpty){
      this.showAttentionMessage('手机号不能为空')
      return false
    }else if(!PhoneNumberValid){
      this.showAttentionMessage('手机号格式不正确')
      return false
    }
    return true
  }
  async doLogin(e){
    const PhoneNumber = this.state.phoneNumber
    const Platform = GetGlobalConfig().platform
    // console.log(this.showAttentionMessageWhenPhoneInvalid())
    if(!this.showAttentionMessageWhenPhoneInvalid()){
      return
    }

    this.props.showLoading()

    const Response = await $.ajax({
      url:GetGlobalConfig().env + '/login/v2/login',
      data:{
        phone_num:PhoneNumber,
        sys_type:Platform,
        device_id:null,
        ts:new Date().getTime()
      },
      method:'post',
      dataType:'json'
    })

    if(Response && Response.status === 1){
      SaveLoginInfo({
        accessToken:Response.data.access_token,
        accessTokenExpiresIn:Response.data.access_token_expires_in,
        refreshToken:Response.data.refresh_token,
        refreshTokenExpiresIn:Response.data.refresh_token_expires_in,
        phoneNumber:PhoneNumber,
        userName:Response.data.user.user_name
      })

      this.props.hideLoading()

      this.showAttentionMessage('登录成功')

      this.props.hidePopupLoginAndReg()
      // setTimeout(() => {
      //   hashHistory.replace('/' + FromPage)
      // },1500)
      this.props.goCarTotalPrice()
    }
  }
  onInputPhoneNumber(e){
    const PhoneNumber = e.target.value

    this.setState({
      phoneNumber:PhoneNumber
    })

    if(PhoneNumber.length === 11){
      CollectClickData({poicode:'MDZ1'})
    }

    if(this.validatePhoneFormat(PhoneNumber)){
      this.checkIsOldUser(PhoneNumber)
    }else{
      if(PhoneNumber.length === 11){
        this.showAttentionMessage('手机号格式不正确')
        return false
      }
    }
  }
  async checkIsOldUser(PhoneNumber) {
    const Platform = GetGlobalConfig().platform
    // const PhoneNumber = e.target.value
    const PhoneNumberValid = this.validatePhoneFormat(PhoneNumber)
    const PhoneNumberIsEmpty = this.validatePhoneIsEmpty(PhoneNumber)

    await this.setState({
      phoneNumber:PhoneNumber
    })
    if(PhoneNumber.length !== 11){
      return false
    }

    if(!PhoneNumberValid){
      this.props.showAttentionMessage('手机号格式不正确')
      return false
    }

    this.props.showLoading()

    const Response = await $.ajax({
      url:GetGlobalConfig().env + '/login/v2/isOldUser',
      method:'post',
      data:{
        phone_num:PhoneNumber,
        sys_type:Platform,
        device_id:null,
        ts:new Date().getTime()
      },
      dataType:'json'
    })

    if(Response && Response.status === 1){
      this.setState({
        isOldUser:Response.data.is_old_user,
        // userAttentionMessage:this.getUserAttentionMessage(Response.data.is_old_user)
      })

      if(!this.state.isOldUser){
        let loginButtonText = '注册'
        if(this.props.fromPage == 'car_shop'){
          loginButtonText = '开始比价'
        }
        this.setState({
          isVerifyCodeInputVisible:true,
          loginButtonText:loginButtonText
        })
      }else{
        this.setState({
          isVerifyCodeInputVisible:false
        })
      }
    }

    this.props.hideLoading()
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
  clickLoginButton(){
    if(!this.showAttentionMessageWhenPhoneInvalid()){
      return
    }
    this.doRegOrDoLogin()

    CollectClickData({poicode:'MDZZ'})
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
  async getVerifyCode(){

    const PhoneNumber = this.state.phoneNumber
    const PhoneNumberValid = this.validatePhoneFormat(PhoneNumber)
    const PhoneNumberIsEmpty = this.validatePhoneIsEmpty(PhoneNumber)

    if(this.state.countRequestVerifyCode > 0){
      return false
    }

    if(PhoneNumberIsEmpty){
      this.showAttentionMessage('手机号不能为空')
      return false
    }
    if(!PhoneNumberValid){
      this.showAttentionMessage('手机号格式不正确')
      return false
    }

    CollectClickData({poicode:'MDZ2'})

    this.startCountWhenToGetNextCode()

    this.props.showLoading()

    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const Response = await fetch(
      GetGlobalConfig().env + '/login/requestValidateCode',
      {
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:'phone_num=' + PhoneNumber + '&' + 'type=1' + '&' + 'ts=' + new Date().getTime() + '&' + 'cityCode=' + CityCode,
        method:'POST'
      }
    )

    this.props.hideLoading()
  }
  inputValidationCode(e){
    this.setState({
      validationCode:e.target.value
    })

    CollectClickData({poicode:'MDZ3'})
  }
  inputNickName(e){
    this.setState({
      nickName:e.target.value
    })
  }
  checkUserNameIsEmpty(){
    return this.state.nickName == ""
  }
  onHidePopupLoginAndRegClick(){
    this.props.hidePopupLoginAndReg()
    CollectClickData({poicode:'MDZX'})
  }
  render(){
    if(!this.props.isPopupLoginAndRegVisible){
      return null
    }
    let getVerifyCodeButtonClass = ''
    if(this.state.countRequestVerifyCode > 0){
      getVerifyCodeButtonClass = 'disable'
    }
    // console.log(this.state.isOldUser)
    return (
      <div className="popup_login_and_reg">
        <div className="login_and_reg_wrapper">
          <button className="close_btn" onClick={this.onHidePopupLoginAndRegClick.bind(this)}></button>
          <div className="avatar">
            <div><img width="62" src={require('../../../images/direct_sale_detail/login_reg_avatar.jpg')}/></div>
            <div className="avatar_desc">好买车服务经理 罗建荣</div>
          </div>
          <div className="title">
            <h2>得到<span>落地价</span>仅剩一步！</h2>
          </div>
          <div className="">
            <div className="input_phone_num"><input onInput={this.onInputPhoneNumber.bind(this)} placeholder="手机号码" maxLength="11"/></div>
            {
              !this.state.isOldUser ?
              <div><div className="input_validation_code"><input placeholder="验证码" maxLength="6" onInput={this.inputValidationCode.bind(this)}/><button className={getVerifyCodeButtonClass} onClick={this.getVerifyCode.bind(this)}>{this.state.verifyCodeText}</button></div><div className="input_user_nickname"><input placeholder="用户名" onInput={this.inputNickName.bind(this)}/></div></div> : null
            }
          </div>
          <div className="login_btn">
            <button onClick={this.clickLoginButton.bind(this)}>查看落地价</button>
          </div>
        </div>
        <AttentionMessage showAttentionMessage={this.showAttentionMessage.bind(this)} attetionMessage={this.state.attetionMessage}/>
      </div>
    )
  }
}

export default PopupLoginAndReg
