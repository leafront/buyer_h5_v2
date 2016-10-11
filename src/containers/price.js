import React from 'react'
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TopBar from '../components/common/top_bar'
import { ImChatButtonTwo } from '../components/common/im_chat_button'
import { GetLocalStorageInfo , ConvertObjectToQueryString , GetGlobalConfig } from '../common'
import * as PriceActions from '../actions/priceAction'
import * as CommonActions from '../actions/commonAction'
import PriceContent from '../components/price/price_content'
import PopupLoanOptions from '../components/price/popup_loan_options'
import PopupLicenseOptions from '../components/price/popup_license_options'
import PopupInsuranceOptions from '../components/price/popup_insurance_options'
import AttentionMessage from '../components/common/attention_message'

class Price extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      priceOptions: {},
      currentCarInfo: {},
      currentInsureIndex: 0,
      currentInsureType: 0,
      isPopupLoanOptionsVisible: false,
      isPopupLicenseOptionsVisible: false,
      isPopupInsuranceOptionsVisible: false,
      currentLoanBankIndex:0,
      currentLicenseIndex:0,
      currentLicenseCityIndex:0,
      currentInsuranceCompanyIndex:0,
      priceOptions: {},
      currentLoanTypeIndex:0,
      totalPrice: 0,
      insurancePay: 0,
      firstPay:0,
      loanList: [],
      attetionMessage: {
        isAttentionMessageVisible: false,
        attentionMessageText: ''
      }
    }
  }
  async showAttentionMessage(message = null) {
    if (this.state.attetionMessage.isAttentionMessageVisible) {
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
        attetionMessage: {
          isAttentionMessageVisible: false,
          attentionMessageText: null
        }
      })
    }, 1500)
  }

  getInsurancePay(carDSRP) {
    let jiaoqiang = 950 //交强险
    let chesun = 593 + carDSRP * 0.0141 //车损险
    let zeren = 1516 //第三方责任险
    //let n = carDSRP / 10000
    let insurancePay = parseInt((jiaoqiang + ((chesun + zeren) * 1.15) * 0.855) * 1.1)
    this.setState({
      insurancePay: insurancePay
    })
  }

  getLoanList(carDSRP) {
    let payPercents = [30, 40, 50, 60, 70] //首付比例
    let stages = [12, 24, 36] //分期几个月
    let loanList = []
    for(var i in payPercents) {
      for(var j in stages) {
        let firstPay = parseInt(carDSRP * payPercents[i] / 100)
        let loanNum = parseInt(carDSRP * (1 - (payPercents[i] / 100)))
        let monthPay = parseInt((carDSRP - firstPay) * (1 + stages[j] / 12 * 0.04) / stages[j])
        loanList.push({firstPay: firstPay, loanNum: loanNum, monthPay: monthPay, payPercent: payPercents[i], stage: stages[j]})
      }
    }
    this.setState({
      loanList: loanList
    })
  }
  showPopupLoanOptions(){
    this.setState({
      isPopupLoanOptionsVisible:true
    })
  }

  hidePopupLoanOptions(){
    this.setState({
      isPopupLoanOptionsVisible:false
    })
  }

  showPopupLicenseOptions(){
    this.setState({
      isPopupLicenseOptionsVisible:true
    })
  }

  hidePopupLicenseOptions(){
    this.setState({
      isPopupLicenseOptionsVisible:false
    })
  }

  showPopupInsuranceOptions(){
    this.setState({
      isPopupInsuranceOptionsVisible:true
    })
  }

  hidePopupInsuranceOptions(){
    this.setState({
      isPopupInsuranceOptionsVisible:false
    })
  }

  selectLoanBank(optionIndex){
    this.setState({
      currentLoanBankIndex: optionIndex
    })
  }

  selectLicense(optionIndex){
    this.setState({
      currentLicenseIndex: optionIndex,
      currentLicenseCityIndex: 0
    })
  }

  selectLicenseCity(optionIndex){
    this.setState({
      currentLicenseCityIndex: optionIndex
    })
  }

  selectInsuranceCompany(optionIndex){
    this.setState({
      currentInsuranceCompanyIndex: optionIndex
    })
  }

  selectLoan(index, money) {
    this.setState({
      currentLoanTypeIndex: index,
      firstPay: money
    })
  }

  async componentDidMount() {
    this.props.actions.showLoading()

    await this.getCurrentCarInfo()

    this.checkCarModelIdIsEqualToLocalStorageInfo()

    await this.getDirectSaleCarPurchaseIntent()

    this.getInsurancePay(this.state.currentCarInfo.carDSRP)
    this.getLoanList(this.state.currentCarInfo.carDSRP)

    this.props.actions.hideLoading()
  }

  checkCarModelIdIsEqualToLocalStorageInfo() {
    if(this.props.params.carModelId != this.state.currentCarInfo.carModelId && this.state.currentCarInfo.carModelId){
      hashHistory.replace('/direct_sale_list')
    }
  }

  getCurrentCarInfo() {
    this.setState({
      currentCarInfo:GetLocalStorageInfo('HMC_DIRECT_SALE_CAR_INFO')
    })
  }

  async getDirectSaleCarPurchaseIntent() {
    const CurrentCarInfo = this.state.currentCarInfo
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const RequestData = ConvertObjectToQueryString({
      carModelId:this.props.params.carModelId,
      isOutLicense:CurrentCarInfo.licenseType === '沪牌' ? 0 : 1,
      cityCode:CityCode
    })

    const Response = await fetch(GetGlobalConfig().env + '/hybrid/ds/getPurchaseIntent', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:RequestData,
      method: 'POST'
    })

    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    if(ResponseOK && ResponseJSON.status === 1){
      this.setState({
        priceOptions:ResponseJSON.data
      })
    }
  }

  render() {
    return (
      <div className="price">
        <TopBar pageTitle="查看落地价"/>
        {
          this.state.isPopupLoanOptionsVisible ?
          <PopupLoanOptions
            onHidePopupLoanOptions={this.hidePopupLoanOptions.bind(this)}
            onSelectLoanBank={this.selectLoanBank.bind(this)}
            currentLoanBankIndex={this.state.currentLoanBankIndex}
            priceOptions={this.state.priceOptions}
            currentCarInfo={this.state.currentCarInfo}
            currentLoanTypeIndex={this.state.currentLoanTypeIndex}
            onSelectLoan={this.selectLoan.bind(this)}
            firstPay={this.state.firstPay}
            loanList={this.state.loanList}
          />
          : ''
        }
        {
          this.state.isPopupLicenseOptionsVisible ?
          <PopupLicenseOptions
            onHidePopupLicenseOptions={this.hidePopupLicenseOptions.bind(this)}
            onSelectLicense={this.selectLicense.bind(this)}
            onSelectLicenseCity={this.selectLicenseCity.bind(this)}
            currentLicenseIndex={this.state.currentLicenseIndex}
            currentLicenseCityIndex={this.state.currentLicenseCityIndex}
            priceOptions={this.state.priceOptions}
            currentCarInfo={this.state.currentCarInfo}
          />
          : ''
        }
        {
          this.state.isPopupInsuranceOptionsVisible ?
          <PopupInsuranceOptions
            onHidePopupInsuranceOptions={this.hidePopupInsuranceOptions.bind(this)}
            onSelectInsuranceCompany={this.selectInsuranceCompany.bind(this)}
            currentInsuranceCompanyIndex={this.state.currentInsuranceCompanyIndex}
            priceOptions={this.state.priceOptions}
            insurancePay={this.state.insurancePay}
          />
          : ''
        }
        <PriceContent
          price={this.props.price}
          totalPrice={this.state.totalPrice}
          actions={this.props.actions}
          currentCarInfo={this.state.currentCarInfo}
          currentInsureIndex={this.state.currentInsureIndex}
          currentInsureType={this.state.currentInsureType}
          priceOptions={this.state.priceOptions}
          onShowPopupLoanOptions={this.showPopupLoanOptions.bind(this)}
          onShowPopupLicenseOptions={this.showPopupLicenseOptions.bind(this)}
          onShowPopupInsuranceOptions={this.showPopupInsuranceOptions.bind(this)}
          currentLicenseIndex={this.state.currentLicenseIndex}
          currentLicenseCityIndex={this.state.currentLicenseCityIndex}
          currentInsuranceCompanyIndex={this.state.currentInsuranceCompanyIndex}
          insurancePay={this.state.insurancePay}
          firstPay={this.state.firstPay}
          loanList={this.state.loanList}
          currentLoanBankIndex={this.state.currentLoanBankIndex}
          currentLoanTypeIndex={this.state.currentLoanTypeIndex}
          showAttentionMessage={this.showAttentionMessage.bind(this)}
        />
        <AttentionMessage attetionMessage={this.state.attetionMessage}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    price: state.price,
    common: state.common
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators( CommonActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Price)
