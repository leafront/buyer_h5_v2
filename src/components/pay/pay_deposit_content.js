import React from 'react'
import { hashHistory } from 'react-router'
import { GetGlobalConfig, GetLocalStorageInfo, GetLoginInfo, CheckLogin, CheckHighLevelLogin, ConvertObjectToQueryString } from '../../common'
import GlobalLoading from '../common/global_loading'

class PayDepositContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataLoading: false
    }
    this.goPay = this.goPay.bind(this)
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

  componentDidMount() {
    this.regNativePay()
  }

  componentDidUpdate() {
    this.regNativePay()
  }

  regNativePay() {
    let isHybird = window.WebViewJavascriptBridge ? true : false
    let orderNo = this.props.orderNo || ''

    if (isHybird) {
      window.WebViewJavascriptBridge.registerHandler('payResponse', function(response){
        if (response.code == 0) { window.location.href = window.location.href.split("#")[0] + '#pay_success/' + order_no }
        if (response.code == 8) { this.props.showAttentionMessage('支付请求失败, 请重试!') }
        if (response.code == 5) { this.props.showAttentionMessage('支付已取消！') }
      })
    }
  }

  //去支付
  goPay() {
    let money = 500
    let orderNo = this.props.orderNo || ''

    if (orderNo == '') {
      this.props.showAttentionMessage('支付参数获取失败!')
      return
    }
    this.doCreatePayRequest(money, orderNo)
  }

  //发送支付请求
  async doCreatePayRequest(money, orderNo) {
    let isHybird = window.WebViewJavascriptBridge ? true : false
    let access_token = ''
    let access_token_high_level = ''
    let order_no = orderNo || ''
    let channel = 'alipay_wap'
    let amount = money || ''
    let subject = '直销车订金'
    let successUrl = window.location.href.split("#")[0] + '#/pay_success/' + order_no
    let cancelUrl = window.location.href.split("#")[0] + '#/pay_deposit/' + order_no
    let body = '直销车订金'
    let time_expire = 30
    let bodyObjectString

    //console.log(order_no, 'order_no')

    if (isHybird) {
      channel = 'alipay'
      //channel = 'wx'
    }

    if (CheckLogin()) {
      access_token = GetLoginInfo().accessToken
    } else {
      hashHistory.replace('/login_and_reg/pay_deposit/' + order_no)
      return
    }

    if (CheckHighLevelLogin()) {
      access_token_high_level = GetLoginInfo().highLevelAccessToken
    } else {
      hashHistory.replace('/auth/pay_deposit/' + order_no)
      return
    }

    bodyObjectString = ConvertObjectToQueryString({
      access_token_high_level: access_token_high_level,
      order_no: order_no,
      channel: channel,
      amount: amount,
      subject: subject,
      successUrl: successUrl,
      cancelUrl: cancelUrl,
      body: body,
      time_expire: time_expire
    })

    this.showLoading()

    const Response = await fetch(GetGlobalConfig().env + '/hybrid/pay_url/createPayRequest', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'access_token': access_token
      },
      body: bodyObjectString,
      method: 'POST'
    })
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    const Status = await ResponseJSON.status
    //console.log(ResponseJSON, ResponseOK, Response)
    if (ResponseOK) {
      this.hideLoading()
      if (Status === 1) {
        if (isHybird) {
            //Native支付
            let data = ResponseJSON.data
            //data.successUrl = successUrl
            //data.cancelUrl = cancelUrl
            let obj = {
              ping: data,
              successUrl: successUrl,
              cancelUrl: cancelUrl
            }
            window.WebViewJavascriptBridge.callHandler('pay', window.encodeURIComponent(JSON.stringify(obj)), function(response) {})
        } else {
            //H5支付,使用ping++
            //console.log(ResponseJSON.data)
            pingpp.createPayment(ResponseJSON.data, function(result, err){
                // 处理错误信息
            })
        }
      } else if (Status === 101 || Status === 107) {
        hashHistory.replace('/auth/pay_deposit' + order_no)
      } else {
        this.props.showAttentionMessage(ResponseJSON.msg || '支付请求失败, 请稍后尝试!')
      }
    } else {
      this.hideLoading()
      this.props.showAttentionMessage('服务器出现异常, 请稍后尝试!')
    }
  }

  getPayDepositContent() {
    let onlinePayClass, offlinePayClass, isOnlinePay
    let directSaleCarInfo = GetLocalStorageInfo('HMC_DIRECT_SALE_CAR_INFO')
    let orderName = directSaleCarInfo.carBrandName + ' ' + directSaleCarInfo.carModelTypeName + ' ' + directSaleCarInfo.carModelName

    if (this.props.payMethod == 'online') {
      onlinePayClass = 'current'
      offlinePayClass = ''
      isOnlinePay = true
    } else {
      onlinePayClass = ''
      offlinePayClass = 'current'
      isOnlinePay = false
    }

    return (
      <div className="pay_deposit">
          <div className="view_orders">
              <p>订单名称：<span> { this.props.orderNo } </span></p>
              <p>订单金额：<em> 500元</em></p>
          </div>
          <div className="pay_online">
              <h2>网上支付</h2>
              <p className="js_choose" data-poicode="MPB21">
                 <img src={require('../../../images/pay/pay_zhifu.png')} />
                 <i>支付宝支付</i>
                 <span>使用支付宝完成快捷支付</span>
                 <em onClick={ this.props.onChangePayMethod.bind(null, 'online') }><button className={ onlinePayClass }></button></em>
              </p>
          </div>
          <div className="pay_online">
              <h2>线下支付</h2>
              <p className="js_choice" data-poicode="MPB22">
                 <img src={require('../../../images/pay/unionPay.png')} />
                 <i>银行转帐</i>
                 <span>通过线下转帐到官方账号完成支付</span>
                 <em onClick={ this.props.onChangePayMethod.bind(null, 'offline') }><button className={ offlinePayClass }></button></em>
              </p>
          </div>
          <div className="pay_info">
              <span>帐号：<i>4351-7058-1040</i></span>
              <span>名称：上海互言汽车服务有限公司</span>
              <span>开户行：中国银行上海市闸北支行</span>
              <p>完成支付后，客服将会电话联系您 ，请注意接听。</p>
          </div>
          <div className="pay_protocol active" style={{display:'none'}}>
              <button className="pay_protocol_agree_btn" type="button">阅读并同意</button>
              <button className="pay_protocol_show_protocol" type="button">《好买车保价支付须知》</button>
          </div>
          <div className="popup_protocol_wrapper">
              <button className="popup_protocol_close_btn"></button>
              <div className="popup_protocol_content">
                  <h2>好买车“保价金”支付须知</h2>
                  <p>款项名称：保价金；</p>
                  <p>款项金额：500元；</p>
                  <p>款项用途：线上4S店报价的价格担保，确保线上4S店的报价与线下签订订车合同时价格统一、真实、有效；</p>
                  <p>款项赔付：在您支付500元保价金后，好买车承诺保价相应4S店的报价真实有效，如在签订订车合同时，价格发生差异的，好买车承诺实行“退一赔二”的原则，按照500元的保价金金额，退换全额保价金500元，另赔付1000元，总计1500元；</p>
                  <p>款项流向：</p>
                  <p className="popup_protocol_content_list_text_indent">Ø  您支付500元保价后，好买车平台仅作为第三方，承担保管义务，确保款型的安全性；</p>
                  <p className="popup_protocol_content_list_text_indent">Ø  您付款后的半小时内，好买车服务顾问会主动与您联系，并再次与您核实您的购车意向及4S店报价信息，在征得您同意的前提下，将500元保价金转账至报价4S店（付款后的24小时内），以确保价格的真实有效，你也必须在付款后的24小时内，到为您提供报价的4S店签订线下订车合同，</p>
                  <p className="popup_protocol_content_list_text_indent">Ø  付款后截止24小时，还未与报价4S店签订线下订车合同的，500元保价金将作为违约金支付给4S店；</p>
                  <p className="popup_protocol_content_list_text_indent">Ø  当您至线下4S店签订订车合同时，500元保价金全额抵充购车款；</p>
                  <p className="popup_protocol_content_list_text_indent">Ø  保价金转账至4S店后，款项的安全等相关事宜由接受款项的4S店承担，如发生投诉事宜，好买车必须协助双方进行调解，如有疑问的，好买车可义务提供举证材料；</p>
                  <p>如何退款：</p>
                  <p className="popup_protocol_content_list_text_indent">Ø  24小时内，在您未与报价4S店签订线下订车合同前，无理由随时全额退款；</p>
                  <p className="popup_protocol_content_list_text_indent">Ø  在您与线下4S店签订订车合同后，退款事宜请与订车4S店协商处理，好买车义务协助双方调解；</p>
                  <p className="popup_protocol_content_list_text_indent">Ø  作为违约金支付给4S店的，好买车义务协助双方调解，如产生民事纠纷的，好买车可义务提供举证材料；</p>
              </div>
          </div>
          {
            isOnlinePay ?
              <div className="go_pay" data-poicode="MPB23" onClick={ this.goPay }>去支付</div> : ''
          }
      </div>
    )
  }

  render() {
    let payDepositContent = this.getPayDepositContent()

    return (
      <div className="pay_deposit_content">
        { payDepositContent }
        {
          this.state.dataLoading ?
            <GlobalLoading />
            : null
        }
      </div>
    )
  }
}

export default PayDepositContent
