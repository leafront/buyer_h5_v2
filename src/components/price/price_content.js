import React from 'react'
import { Link, hashHistory } from 'react-router'
import PopupGifts from '../../components/direct_sale_detail/popup_gifts'
import { ImChatButtonTwo } from '../common/im_chat_button'
import { GetGlobalConfig, ConvertPriceToTenThousand, convertNum, ConvertPriceToLargerNumber, ConvertObjectToQueryString, FormatNumberWithComma, GetLocalStorageInfo, GetLoginInfo} from '../../common'
import $ from 'jquery'

import { CollectClickData } from '../../data_collection'



class PriceContent extends React.Component {
  constructor(props) {
    super(props)
  }

  isLoan() {
    return this.props.currentCarInfo.payMethod == '贷款+置换' || this.props.currentCarInfo.payMethod == '贷款'
  }

  getPurchaseTax() {
    const ModelTaxPolicy = this.props.priceOptions.modelTaxPolicy
    let purchaseTax// = parseInt(this.props.currentCarInfo.carDSRP / 11.7)
    // console.log(this.props.priceOptions.modelTaxPolicy == "1")
    switch(ModelTaxPolicy){
      case "2":
        purchaseTax = parseInt(this.props.currentCarInfo.carDSRP / 11.7 / 2)
        break
      case "3":
        purchaseTax = 0
        break
      default:
        purchaseTax = parseInt(this.props.currentCarInfo.carDSRP / 11.7)
    }
    // console.log(purchaseTax)
    // if (this.props.priceOptions.disp > 1.6) {
    //     purchaseTax = parseInt(this.props.currentCarInfo.carDSRP / 11.7)
    // } else {
    //     purchaseTax = parseInt(this.props.currentCarInfo.carDSRP / 11.7 / 2)
    // }
    return purchaseTax
  }

  getLicenseLocation() {
    let licenseLocation
    if (this.props.currentCarInfo.licenseType == '沪牌') {
      licenseLocation = this.props.priceOptions.licenses[this.props.currentLicenseIndex].type
    } else {
      licenseLocation = this.props.priceOptions.licenses[this.props.currentLicenseIndex].locations[this.props.currentLicenseCityIndex].location + '/' + this.props.priceOptions.licenses[this.props.currentLicenseIndex].locations[this.props.currentLicenseCityIndex].license
    }
    return licenseLocation
  }

  getSaveMoney() {
    let saveMoney
    let loanYear = this.props.loanList[this.props.currentLoanTypeIndex].stage / 12
    let giftPrice=4598
    let temporaryLicense=50
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    if(CityCode=='330100'){
      if (this.props.currentCarInfo.payMethod == '贷款+置换' || this.props.currentCarInfo.payMethod == '贷款') {
        saveMoney = this.props.currentCarInfo.carMSRP - this.props.currentCarInfo.carDSRP// + (loanYear * 1000)
      } else {
        saveMoney = this.props.currentCarInfo.carMSRP - this.props.currentCarInfo.carDSRP
      }
    }else{
      if (this.props.currentCarInfo.payMethod == '贷款+置换' || this.props.currentCarInfo.payMethod == '贷款') {
        saveMoney = this.props.currentCarInfo.carMSRP - this.props.currentCarInfo.carDSRP + giftPrice + temporaryLicense// + (loanYear * 1000)
      } else {
        saveMoney = this.props.currentCarInfo.carMSRP - this.props.currentCarInfo.carDSRP + giftPrice + temporaryLicense
      }
    }

    return saveMoney
  }

  getSumMoney() {
    let carDSRP = this.props.currentCarInfo.carDSRP
    let purchaseTax = this.getPurchaseTax()
    let servicePrice = this.props.priceOptions.servicePrice
    let insurancePay = this.props.insurancePay
    let licensePrice = this.props.priceOptions.licenses[this.props.currentLicenseIndex].locations[this.props.currentLicenseCityIndex].price
    let loanYear = this.props.loanList[this.props.currentLoanTypeIndex].stage / 12
    let payPercent = this.props.loanList[this.props.currentLoanTypeIndex].payPercent
    let totalInterest = carDSRP * (1 - payPercent / 100) * (loanYear * 0.04)
    let sumMoney = carDSRP + purchaseTax + servicePrice + insurancePay + licensePrice
    let isLoan = this.isLoan()
    if (isLoan) {
      sumMoney = sumMoney + totalInterest
    }
    return sumMoney
  }

  isLocalPerson() {
    let piHukou = 0
    let location = this.props.priceOptions.licenses[this.props.currentLicenseIndex].type
    if (this.props.currentCarInfo.licenseType == '沪牌') {
      piHukou = 1
    }
    if (this.props.currentCarInfo.licenseType == '外牌' && location == '上海籍上外牌') {
      piHukou = 1
    }
    return piHukou
  }

  async submitDirectSaleInfo(method){
    const access_token = GetLoginInfo().accessToken
    const CurrentCarInfo = this.props.currentCarInfo
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const Platform = GetGlobalConfig().platform
    let isPay = 1
    if (method === 'to_pay') {
      isPay = 1
      CollectClickData({poicode:'MZ4Y'})
    } else {
      CollectClickData({poicode:'MZ4Z'})
    }
    const RequestData = ConvertObjectToQueryString({
      carModelId:this.props.currentCarInfo.carModelId,
      piHukou:this.isLocalPerson(),//是否本地户口
      piSaveMoney:this.getSaveMoney(),//总节省金额
      downpaymentPercent:this.props.loanList[this.props.currentLoanTypeIndex].payPercent,//首付比例
      loanInstallmentNum:this.props.loanList[this.props.currentLoanTypeIndex].stage / 12,//贷款年限
      piLoan:this.isLoan(),//是否贷款
      loanBankName:this.props.priceOptions.banks[this.props.currentLoanBankIndex],//贷款银行名称
      autoReplaceCar:this.refs.changeInput && this.refs.changeInput.value || '',//置换车型
      carInsuranceOption:'1',//保险方案 基本组合
      carInsuranceCompanyName:this.props.priceOptions.insureCompanys[this.props.currentInsuranceCompanyIndex].name,//保险公司名称
      carInsureancePrice:this.props.insurancePay,//保险费用
      licenseLocation:this.getLicenseLocation(),//上牌地点
      licensePrice:this.props.priceOptions.licenses[this.props.currentLicenseIndex].locations[this.props.currentLicenseCityIndex].price,//牌照价格
      servicePrice:'1000',//服务费
      taxPrice:this.getPurchaseTax(),//购置税
      dsrp:this.props.currentCarInfo.carDSRP,//dsrp
      sumPrice:this.getSumMoney(),//总价
      piColorName:this.props.currentCarInfo.carColorName,//款型颜色名称
      piColorValue:this.props.currentCarInfo.carColorValue,//颜色色值
      piOrigin:Platform,
      isPay:isPay,//0:意向单,1:订单
      cityCode:CityCode
    })
    // console.log(RequestData, this.props.priceOptions.licenses[this.props.currentLicenseIndex])
    /*const Response = await fetch(GetGlobalConfig().env + '/hybrid/ds/savePurchaseIntent', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'access_token': access_token },
      body:RequestData,
      method: 'POST'
    })*/

    const Response = await $.ajax({
      url:GetGlobalConfig().env + '/hybrid/ds/savePurchaseIntent',
      data:RequestData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'access_token': access_token },
      method:'post',
      dataType:'json'
    })

    //const ResponseOK = await Response.ok
    //const ResponseJSON = await Response.json()

    if(Response && Response.status === 1){
      if (method !== 'to_pay') {
        hashHistory.push('/direct_sale_inquire/' + this.props.currentCarInfo.carDSRP)
      } else {
        hashHistory.push('/pay_deposit/' + Response.data.piId)
      }
    }
    if(Response){
      if(Response.status === 101 || Response.status === 107){
        // await this.props.showAttentionMessage('登录信息过期或未登录!')
        hashHistory.replace('/login_and_reg')
      }
    }
  }

  onShowPopupLoanOptionsClick(){
    this.props.onShowPopupLoanOptions()
    CollectClickData({poicode:'MZ41'})
  }

  onShowPopupLicenseOptionsClick(){
    this.props.onShowPopupLicenseOptions()
    CollectClickData({poicode:'MZ42'})
  }

  onShowPopupInsuranceOptionsClick(){
    this.props.onShowPopupInsuranceOptions()
    CollectClickData({poicode:'MZ43'})
  }

  render() {
    if (this.props.loanList.length === 0) {
      return null
    }

    let imChatBtn = ImChatButtonTwo()
    //let insurePrice = null
    let licensePrice = null
    let tagItems
    let purchaseTax //购置税
    let carDSRP = this.props.currentCarInfo.carDSRP
    let saveMoney = this.getSaveMoney()
    let servicePrice = this.props.priceOptions.servicePrice
    let insurancePay = this.props.insurancePay
    let payPercent = this.props.loanList[this.props.currentLoanTypeIndex].payPercent
    let loanYear = this.props.loanList[this.props.currentLoanTypeIndex].stage / 12
    let totalInterest = carDSRP * (1 - payPercent / 100) * (loanYear * 0.04)
    let totalPrice = 0
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode

    purchaseTax = this.getPurchaseTax()

    if(Object.keys(this.props.priceOptions).length > 0){
      //insurePrice = this.props.priceOptions.insureCompanys[this.props.currentInsureIndex].types[this.props.currentInsureType].price
      licensePrice = this.props.priceOptions.licenses[this.props.currentLicenseIndex].locations[this.props.currentLicenseCityIndex].price

      if (this.props.currentCarInfo.tagList.length > 0) {
        tagItems = this.props.currentCarInfo.tagList.map((item, index) => {
          return (
            <span>{ item }</span>
          )
        })
      }
    }

    totalPrice = this.getSumMoney()
    return (
      <div className="price_content">
        <div className="car_info clearfix">
          <h3>{(this.props.currentCarInfo.carDSRP / this.props.currentCarInfo.carMSRP * 10).toFixed(1)}折</h3>
          <img src={this.props.currentCarInfo.carPhotoLink}/>
          <div className="tags">
            { tagItems }
          </div>
          <div className="car_text">
            <h2>{this.props.currentCarInfo.carBrandName} {this.props.currentCarInfo.carModelTypeName}</h2>
            <p className="car_name">{this.props.currentCarInfo.carModelName}</p>
            <p className="guide_price">
              <i>指导价 ￥{ ConvertPriceToLargerNumber(this.props.currentCarInfo.carMSRP) }万</i>
              <span><em>{ ConvertPriceToLargerNumber(this.props.currentCarInfo.carDSRP) }万</em></span>
            </p>
          </div>
        </div>
        <div className="fee_info clearfix">
          <ul>
            {
              this.props.currentCarInfo.payMethod == '贷款+置换' || this.props.currentCarInfo.payMethod == '贷款' ?
                <li className="hasOptions" onClick={this.onShowPopupLoanOptionsClick.bind(this)}>
                  <span className="label">贷<i></i>款：</span>
                  <span className="money">￥{ convertNum(this.props.loanList[this.props.currentLoanTypeIndex].firstPay) }</span>
                  <span className="extra_gift">(贷款手续费用按实收取)</span>
                </li>
                : null
            }
            {
              CityCode != '330100' ?
              <li className="hasOptions" onClick={this.onShowPopupLicenseOptionsClick.bind(this)}>
                <span className="label">牌<i></i>照：</span>
                <span className="money">￥{ convertNum(licensePrice) }</span>
                <span className="extra_gift">(好买车赠送￥50临时牌照)</span>
              </li>
              : null
            }

            <li className="hasOptions" onClick={this.onShowPopupInsuranceOptionsClick.bind(this)}>
              <span className="label">保<i></i>险：</span>
              <span className="money">￥{ convertNum(this.props.insurancePay) }</span>
            </li>
            <li>
              <span className="label">服务费：</span>
              <span className="money">￥{ convertNum(this.props.priceOptions.servicePrice) }</span>
            </li>
            <li>
              <span className="label">购置税：</span>
              <span className="money">￥{ convertNum(purchaseTax) }</span>
            </li>
          </ul>
        </div>
        {
          this.props.currentCarInfo.payMethod == '全款+置换' || this.props.currentCarInfo.payMethod == '贷款+置换' ?
          <div className="other_info clearfix">
            <ul>
              <li>
                <span className="label">置<i></i>换：</span>
                <input type="text" className="totalPrice-replace-txt" placeholder="请输入您要置换的品牌+车型" ref="changeInput" onFocus={CollectClickData.bind(null,{poicode:'MZ44'})}/>
              </li>
            </ul>
          </div> : null
        }
        <div className="extra_info clearfix">
          <p onClick={CollectClickData.bind(null,{poicode:'MZ45'})}>
            <PopupGifts/>
          </p>
          <div className="land_price">
            <p>落地价：<em>{ convertNum(parseInt(totalPrice)) }</em><span> 元 (节省了{ convertNum(saveMoney) }元)</span></p>
            <p style={{fontSize:'1.2rem',lineHeight:'1.2rem'}}>购置税、保险和按揭相关费用按实结算</p>
          </div>
        </div>
        <div className="Contact_Cus">
          <p className="contact_us_btn">{ imChatBtn }</p>
          <button onClick={this.submitDirectSaleInfo.bind(this, 'to_pay')} className="online_pay">立即预订</button>
          <button onClick={this.submitDirectSaleInfo.bind(this, 'to_inquire')} className="free_submit_inquire">暂时保存</button>
        </div>
      </div>
    )
  }
}

export default PriceContent
