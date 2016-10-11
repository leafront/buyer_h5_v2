import React from 'react'
import { hashHistory } from 'react-router'
import CarShopHeader from '../../components/login_and_reg/car_shop_header'
import $ from 'jquery'

import { GetGlobalConfig , SaveLoginInfo , CheckGUIDIsSet , GetUserLocation , GetLoginInfo , GetLocalStorageInfo , GetQueryStringByName , ConvertObjectToQueryString , GetQueryStringFromSearchByName } from '../../common'
import { CollectClickData } from '../../data_collection'

import 'whatwg-fetch'

class VerifyCode extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // defaultVerifyCodeText:'重新获取',
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

    const PhoneNumber = this.props.phoneNumber
    const PhoneNumberValid = this.props.validatePhoneFormat(PhoneNumber)
    const PhoneNumberIsEmpty = this.props.validatePhoneIsEmpty(PhoneNumber)

    if(this.state.countRequestVerifyCode > 0){
      return false
    }

    if(PhoneNumberIsEmpty){
      this.props.showAttentionMessage('手机号不能为空')
      return false
    }
    if(!PhoneNumberValid){
      this.props.showAttentionMessage('手机号格式不正确')
      return false
    }

    CollectClickData({poicode:'MD12'})

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
    // const ResponseOK = await Response.ok
    // const ResponseJSON = await Response.json()
    // console.log(ResponseJSON)
    // if(ResponseOK){
    //   console.log(11)
    // }

    // const Response = await $.ajax({
    //   url:GetGlobalConfig().env + '/login/requestValidateCode',
    //   data:{
    //     phone_num:PhoneNumber,
    //     type:1,
    //     ts:new Date().getTime()
    //   },
    //   method:'post',
    //   dataType:'json'
    // })

    this.props.hideLoading()

    //error handler

    // console.log(Response)
    // if(Response && Response.status === 1){
      // console.log(Response.data.validation_code)
      // this.setState({
      //   validationCode:Response.data.validation_code
      // })
    // }
  }
  async getVoiceVerify(e){

    CollectClickData({poicode:'MD19'})

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
      <div className="verifycode">
        <div className="sms">
          <input name="verifycode" type="text" placeholder="请输入短信验证码" onInput={this.props.inputValidationCode.bind(this)}/>
          <button className={getVerifyCodeButtonClass} type="button" onClick={this.getVerifyCode.bind(this)}>{this.state.verifyCodeText}</button>
        </div>
        <div className="voice">
          <p>收不到验证码请获取 <button onClick={this.getVoiceVerify.bind(this)}>语音验证码</button></p>
        </div>
        <div className="nick_name">
          <input type="text" placeholder="请输入您的称呼" onInput={this.props.setNickNameInput.bind(this)}/>
        </div>
      </div>
    )
  }
}

class UserForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      phoneNumber:'',
      nickName:'',
      isOldUser:true,
      validationCode:'',
      isVerifyCodeInputVisible:false,
      loginInputPlaceholder:'请输入手机号',
      loginButtonText:'登录',
      isCarShopHeaderVisible:false,
      userAttentionMessage:''
    }
  }
  getUserAttentionMessage(isOldUser){
    if(isOldUser){
      return '欢迎回来，尊敬的好买车用户！'
    }else{
      return '为了确保比价结果真实可靠，请您如实填写以下信息'
    }
  }
  componentWillMount(){
    if(this.props.fromPage == 'car_shop'){
      this.setCarShopHeader()
    }
  }
  componentDidMount(){

  }
  setCarShopHeader(){
    this.setState({
      isCarShopHeaderVisible: true,
      loginInputPlaceholder: '输入手机号，短信接收报价单',
      loginButtonText: '开始比价'
    })
  }
  validatePhoneFormat(phoneNumber) {
    const PhoneNumberPattern = /^0?1[123456789]\d{9}$/;
    return PhoneNumberPattern.test(phoneNumber)
  }
  validatePhoneIsEmpty(phoneNumber) {
    return phoneNumber == ""
  }
  doRegOrDoLogin(e){
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
    const orderNo = this.props.orderNo
    const UserGUID = CheckGUIDIsSet()
    const UserSelectedParityOptions = JSON.parse(sessionStorage.getItem('USER_SELECTED_PARITY_OPTIONS'))
    const UserSelectedModelId = UserSelectedParityOptions && UserSelectedParityOptions.modelId
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    let businessSourceAttr = ''
    let businessRemarkAttr = ''

    let marketOrigin = decodeURI(GetQueryStringFromSearchByName('bk')) || ''
    let marketKeyWord = decodeURI(GetQueryStringFromSearchByName('kw')) || ''

    if(this.state.validationCode == ''){
      this.props.showAttentionMessage('验证码不能为空')
      return
    }
    if(this.state.nickName == ''){
      this.props.showAttentionMessage('请输入您的称呼')
      return
    }

    this.props.showLoading()

    CollectClickData({poicode:'MD14'})

    if(FromPage == 'car_shop'){
      businessSourceAttr = 2
      businessRemarkAttr = UserSelectedModelId
    }

    // const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    // const RequestData = ConvertObjectToQueryString({
    //   phone_num:PhoneNumber,
    //   validation_code:this.state.validationCode,
    //   user_name:this.state.nickName,
    //   sysType:Platform,
    //   cityCode:CityCode,
    //   ts:new Date().getTime()
    // })
    //
    // // @todo replace with fetch
    // const Response = await fetch(
    //   GetGlobalConfig().env + '/login/v2/signup',
    //   {
    //     headers:{'Content-Type':'application/x-www-form-urlencoded'},
    //     body:RequestData,
    //     method:'POST'
    //   }
    // )
    const Response = await $.ajax({
      url:GetGlobalConfig().env + '/login/v2/signup',
      data:{
        phone_num:PhoneNumber,
        validation_code:this.state.validationCode,
        user_name:this.state.nickName,
        sys_type:Platform,
        device_id:' ',
        guid:UserGUID,
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

    // const ResponseOK = await Response.ok
    // const ResponseJSON = await Response.json()

    if(Response && Response.status !== 1){
      this.props.showAttentionMessage(Response.msg)
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

      this.props.showAttentionMessage('注册成功')

      switch (this.props.fromPage) {
        case 'car_shop':
          CollectClickData({poicode:'MD01'})
          break
        case 'user_center':
          CollectClickData({poicode:'MD03'})
          break
        default:
      }

      setTimeout(() => {
        if(FromPage == 'car_shop'){
          this.submitAskPriceAfterLogin()
          return
        }
        if (orderNo) {
          hashHistory.replace('/' + FromPage + '/' + orderNo)
        } else {
          hashHistory.replace('/' + FromPage)
        }
      },1500)
    }
  }
  async doLogin(e){
    const PhoneNumber = this.state.phoneNumber
    const Platform = GetGlobalConfig().platform
    const FromPage = this.props.fromPage
    const UserGUID = CheckGUIDIsSet()
    const UserSelectedParityOptions = JSON.parse(sessionStorage.getItem('USER_SELECTED_PARITY_OPTIONS'))
    const UserSelectedModelId = UserSelectedParityOptions && UserSelectedParityOptions.modelId
    let businessSourceAttr = ''
    let businessRemarkAttr = ''

    CollectClickData({poicode:'MD18'})

    if(!this.showAttentionMessageWhenPhoneInvalid()){
      return
    }

    this.props.showLoading()

    if(FromPage == 'car_shop'){
      businessSourceAttr = 2
      businessRemarkAttr = UserSelectedModelId
    }

    const Response = await $.ajax({
      url:GetGlobalConfig().env + '/login/v2/login',
      data:{
        phone_num:PhoneNumber,
        sys_type:Platform,
        device_id:' ',
        guid:UserGUID,
        business_source:businessSourceAttr,//or2
        business_remark:businessRemarkAttr,//carmodelid  USER_SELECTED_PARITY_OPTIONS
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

      this.props.showAttentionMessage('登录成功')

      switch (this.props.fromPage) {
        case 'car_shop':
          CollectClickData({poicode:'MD04'})
          break
        case 'user_center':
          CollectClickData({poicode:'MD06'})
          break
        default:
      }

      setTimeout(() => {
        if(FromPage == 'car_shop'){
          this.submitAskPriceAfterLogin()
          return
        }
        if(FromPage == 'account'){
          hashHistory.replace('/auth/' + FromPage)
          return
        }
        hashHistory.replace('/' + FromPage)
      },1500)
    }
  }
  async submitAskPriceAfterLogin(){
    // const CurrentUserOptions = JSON.parse(sessionStorage.USER_SELECTED_PARITY_OPTIONS)
    // const SelectedShopData = JSON.parse(sessionStorage.USER_SELECTED_SHOP_INFO)
    let userSelectedAllOptions = JSON.parse(sessionStorage.USER_SELECTED_ALL_OPTIONS_INFO)
    //@todo city
    // const CurrentCity = "上海市"
    this.props.showLoading()

    const Response = await $.ajax({
      url:GetGlobalConfig().env + '/hybrid/ask/addAskPrice',
      headers:{
        access_token:GetLoginInfo().accessToken
      },
      data:userSelectedAllOptions,
      method:'post',
      dataType:'json'
    })

    // checkResponseStatus(Response)
    //
    // function checkResponseStatus(Response){
    //   console.log(Response.status)
      switch (Response.status) {
        case 1:
          removeAllSelectedOptions()
          hashHistory.replace('/inquire/' + Response.data.respondTime)
          break
        case 2:
          this.props.showAttentionMessage(Response.msg)
          setTimeout(() => {
            hashHistory.replace('/')
          },1500)
        default:
      }
    // }

    function removeAllSelectedOptions(){
      sessionStorage.removeItem('USER_SELECTED_ALL_OPTIONS_INFO')
    }
    // function removeSelectedShop(){
    //   sessionStorage.removeItem('USER_SELECTED_SHOP_INFO')
    // }
    // function removeUserSelectedParityOptions(){
    //   sessionStorage.removeItem('USER_SELECTED_PARITY_OPTIONS')
    // }
  }
  async checkIsOldUser(e) {
    const Platform = GetGlobalConfig().platform
    const PhoneNumber = e.target.value
    const PhoneNumberValid = this.validatePhoneFormat(PhoneNumber)
    const PhoneNumberIsEmpty = this.validatePhoneIsEmpty(PhoneNumber)
    const UserGUID = CheckGUIDIsSet()

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
    // GetAccessToken
    // GetHighLevelAccessToken
    const Response = await $.ajax({
      url:GetGlobalConfig().env + '/login/v2/isOldUser',
      method:'post',
      data:{
        phone_num:PhoneNumber,
        sys_type:Platform,
        device_id:' ',
        guid:UserGUID,
        ts:new Date().getTime()
      },
      dataType:'json'
    })

    if(Response && Response.status === 1){
      this.setState({
        isOldUser:Response.data.is_old_user,
        userAttentionMessage:this.getUserAttentionMessage(Response.data.is_old_user)
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

        CollectClickData({poicode:'MD11'})

        // if(this.props.fromPage == 'carShop'){
        //   CollectClickData({poicode:'MD01'})
        // }
        // switch (this.props.fromPage) {
        //   case 'carShop':
        //     CollectClickData({poicode:'MD01'})
        //     break
        //   case 'userCenter':
        //     CollectClickData({poicode:'MD03'})
        //     break
        //   default:
        // }

      }else{
        this.setState({
          isVerifyCodeInputVisible:false
        })

        CollectClickData({poicode:'MD15'})

      }
    }

    this.props.hideLoading()

  }
  showAttentionMessageWhenPhoneInvalid(){
    const PhoneNumber = this.state.phoneNumber
    const PhoneNumberValid = this.validatePhoneFormat(PhoneNumber)
    const PhoneNumberIsEmpty = this.validatePhoneIsEmpty(PhoneNumber)

    if(PhoneNumber == ""){
      this.props.showAttentionMessage('手机号不能为空')
      return false
    }else if(!PhoneNumberValid){
      this.props.showAttentionMessage('手机号格式不正确')
      return false
    }
    return true
  }

  setNickNameInput(e){
    this.setState({
      nickName:e.target.value
    })
  }
  inputValidationCode(e) {
    this.setState({
      validationCode:e.target.value
    })

    CollectClickData({poicode:'MD13'})
  }
  render() {


    // let logoComponent = (
    //
    // )
    // if(){
    //   logoComponent = null
    // }

    // let oldUserMessage = ''
    // if(this.state.isOldUser === null){
    //   oldUserMessage = ''
    // }else if(this.state.isOldUser){
    //   oldUserMessage = '欢迎回来，尊敬的好买车用户！'
    // }else{
    //   oldUserMessage = '为了确保比价结果真实可靠，请您如实填写以下信息'
    // }

    return (
      <div className="login">
        {
          this.state.isCarShopHeaderVisible ?
            <CarShopHeader isCarShopHeaderVisible={this.state.isCarShopHeaderVisible}/>
            : null
        }
        {
          !this.state.isCarShopHeaderVisible ?
            <div className="logo"><img width="135" src={require('../../../images/login_reg/logo.png')}/></div>
            : null
        }
        <div className={"attention_msg"}>{this.state.userAttentionMessage}</div>
        <div className="login_form">
          <div className="phone">
            <input name="phoneNumber" onInput={this.checkIsOldUser.bind(this)} type="text" placeholder={this.state.loginInputPlaceholder}/>
          </div>
          {
            this.state.isVerifyCodeInputVisible ?
              <VerifyCode
                inputValidationCode={this.inputValidationCode.bind(this)}
                setNickNameInput={this.setNickNameInput.bind(this)}
                showLoading={this.props.showLoading.bind(this)}
                hideLoading={this.props.hideLoading.bind(this)}
                showAttentionMessageWhenPhoneInvalid={this.showAttentionMessageWhenPhoneInvalid.bind(this)}
                showAttentionMessage={this.props.showAttentionMessage.bind(this)}
                validatePhoneFormat={this.validatePhoneFormat.bind(this)}
                validatePhoneIsEmpty={this.validatePhoneIsEmpty.bind(this)}
                phoneNumber={this.state.phoneNumber}
              />
              : null
          }
          <div className="submit">
            <button onClick={this.doRegOrDoLogin.bind(this)}>{this.state.loginButtonText}</button>
          </div>
        </div>
      </div>
    )
  }
}

export default UserForm
