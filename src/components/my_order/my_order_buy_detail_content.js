import React from 'react'
import { Link } from 'react-router'
import FreeUpgradeConfig from './free_upgrade_config'
import { ImChatButtonTwo } from '../common/im_chat_button'
import { convertNum, convertFormat, ConvertPriceToLargerNumber, GetLocalStorageInfo } from '../../common'

import { CollectClickData } from '../../data_collection'

class MyOrderBuyDetailContent extends React.Component {
  constructor(props) {
    super(props)
  }

  getBuyWay(dsPurchaseIntent) {
    let buyWay
    if (dsPurchaseIntent.piLoan == false) {
      buyWay = '全款'
    } else {
      buyWay = '贷款'
    }
    if (dsPurchaseIntent.autoReplaceCar != '') {
      buyWay = buyWay + '+置换'
    }
    return buyWay
  }

  getLicenseLocation(dsPurchaseIntent) {
    let licenseLocation
    if (dsPurchaseIntent.piHukou == false) {
      licenseLocation = '外地籍上外牌'
    } else {
      licenseLocation = '上海籍上外牌'
    }
    if (dsPurchaseIntent.licenseLocation === '沪牌' || dsPurchaseIntent.licenseLocation === '沪C') {
      licenseLocation = dsPurchaseIntent.licenseLocation
    }
    return licenseLocation
  }

  getOrderDetail() {
    let dsCarModel = this.props.dsCarModel
    let dsPurchaseIntent = this.props.dsPurchaseIntent
    let buyWay = this.getBuyWay(dsPurchaseIntent)
    let location = this.getLicenseLocation(dsPurchaseIntent)
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode

    return (
      <div className="order">
        <div className="gen_time">
          <span>生成时间：{ dsPurchaseIntent.createTime }</span>
          <span className="trans_code">单号：{ dsPurchaseIntent.piCode }</span>
        </div>
        <div className="car_message">
          {
            dsCarModel.modelPhoto ?
            <img src={dsCarModel.modelPhoto} /> : ''
          }
          <span>{ dsCarModel.modelBrandName }<br/>{ dsCarModel.modelTypeName } { dsCarModel.modelName }</span>
        </div>
        <div className="fare">
          <p>实际支付：
            <i>
              { dsPurchaseIntent.sumPrice < 10000 ? convertNum(dsPurchaseIntent.sumPrice) : ConvertPriceToLargerNumber(dsPurchaseIntent.sumPrice) }
              { dsPurchaseIntent.sumPrice < 10000 ? '元' : '万元' }
            </i>
          </p>
          <p>好买车帮您节省：
            <i>
              { dsPurchaseIntent.piSaveMoney < 10000 ? convertNum(dsPurchaseIntent.piSaveMoney) : ConvertPriceToLargerNumber(dsPurchaseIntent.piSaveMoney) }
              { dsPurchaseIntent.piSaveMoney < 10000 ? '元' : '万元' }
            </i>
          </p>
        </div>
        <div className="select">
          <div className="se_sty">
            <span>颜色：{ dsPurchaseIntent.piColorName }</span>
            <span>购车方式：{ buyWay }</span>
            <span>
            {
              CityCode != '330100'?
              <span>上牌：{ location }</span>
              :null
            }
            </span>
            
          </div>
        </div>
      </div>
    )
  }

  getOrderRequirement() {
    let dsCarModel = this.props.dsCarModel
    let dsPurchaseIntent = this.props.dsPurchaseIntent
    let buyCarMethod = '贷 款'
    let whoNeedWaiPai = ''
    let firstPay = dsPurchaseIntent.dsrp * dsPurchaseIntent.downpaymentPercent / 100
    let loanNum = Math.floor(dsPurchaseIntent.dsrp * (1 - dsPurchaseIntent.downpaymentPercent / 100))
    let monthPayNum = Math.floor((dsPurchaseIntent.dsrp * (1 - dsPurchaseIntent.downpaymentPercent / 100)) * (1 + dsPurchaseIntent.loanInstallmentNum * 0.04) / (dsPurchaseIntent.loanInstallmentNum * 12))
    let freeNum = dsPurchaseIntent.loanInstallmentNum * 1000
    let imChatBtn = ImChatButtonTwo()
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode

    if (dsPurchaseIntent.autoReplaceCar) {
      buyCarMethod = buyCarMethod + '+置换'
    }

    if (dsPurchaseIntent.piHukou == false) {
      whoNeedWaiPai = '外地人上外牌 | ' + dsPurchaseIntent.licenseLocation
    } else {
      whoNeedWaiPai = '上海人上外牌 | ' + dsPurchaseIntent.licenseLocation
    }

    return (
      <div className="order_requirement">
        <p className="for_cars">购车需求</p>
        <div className="list_of_demand">
          {
            dsPurchaseIntent.piLoan ?
              <div>
                <p className="payment">
                  <span>
                    购车方式：{ buyCarMethod }
                  </span>
                  <span className="down_pay">首付：
                    <i>
                      { firstPay < 10000 ? convertNum(firstPay) : ConvertPriceToLargerNumber(firstPay) }
                      { firstPay < 10000 ? '元' : '万元' }
                    </i>
                  </span>
                </p>
                <p className="pay_sty">
                  <span>首付 { ' ' }
                    { firstPay < 10000 ? convertNum(firstPay) : ConvertPriceToLargerNumber(firstPay) }
                    { firstPay < 10000 ? '元' : '万元' }
                  </span>
                  <span>分期 { dsPurchaseIntent.loanInstallmentNum * 12 }个月</span>
                  <span>贷款 { ' ' }
                    { loanNum < 10000 ? convertNum(loanNum) : ConvertPriceToLargerNumber(loanNum) }
                    { loanNum < 10000 ? '元' : '万元' }
                  </span><br/>
                  <span>月供（含利息）
                    { monthPayNum < 10000 ? convertNum(monthPayNum) : ConvertPriceToLargerNumber(monthPayNum) }
                    { monthPayNum < 10000 ? '元' : '万元' }
                  </span><br/>
                  <span >
                    (贷款手续费按实收取)
                  </span>
                </p>
              </div>
            : ''
          }
          <p>
            {
              CityCode != '330100' ?
              <p>
                <p className="license_tag">
                  <span>牌 照 ：
                    {
                      (dsPurchaseIntent.licenseLocation == '沪牌' || dsPurchaseIntent.licenseLocation == '沪C') ?
                      dsPurchaseIntent.licenseLocation : '外牌'
                    }
                  </span>
                  <span className="cost">费用：
                    <i>
                      { dsPurchaseIntent.licensePrice < 10000 ? convertNum(dsPurchaseIntent.licensePrice) : ConvertPriceToLargerNumber(dsPurchaseIntent.licensePrice) }
                      { dsPurchaseIntent.licensePrice < 10000 ? '元' : '万元' }
                    </i>
                  </span>
                </p>
                <p className="lic_select">
                    {
                      (dsPurchaseIntent.licenseLocation != '沪牌' && dsPurchaseIntent.licenseLocation != '沪C') ?
                      <span className="waipai">{ whoNeedWaiPai }</span> : ''
                    }
                    {
                      (dsPurchaseIntent.licenseLocation == '沪牌' || dsPurchaseIntent.licenseLocation == '沪C') ?
                      <span className="stress">(仅含上牌手续费，牌照费用需自理)</span> : ''
                    }
                    <span className="stress">(好买车赠送 ￥50临时牌照)</span>
                </p>
              </p>
              :null
            }
            
          </p>
          <p className="fixed_charge">
              <span>服务费：固定费用</span>
              <span>费用：
                <i>
                  { dsPurchaseIntent.servicePrice < 10000 ? convertNum(dsPurchaseIntent.servicePrice) : ConvertPriceToLargerNumber(dsPurchaseIntent.servicePrice) }
                  { dsPurchaseIntent.servicePrice < 10000 ? '元' : '万元' }
                </i>
              </span>
          </p>
          <p className="fixed_charge">
              <span>购置税：国家规定收取</span>
              <span>费用：
                <i>
                  { dsPurchaseIntent.taxPrice < 10000 ? convertNum(dsPurchaseIntent.taxPrice) : ConvertPriceToLargerNumber(dsPurchaseIntent.taxPrice) }
                  { dsPurchaseIntent.taxPrice < 10000 ? '元' : '万元' }
                </i>
              </span>
          </p>
          <p className="fixed_charge fixed_charge_last">
              <span>保　险：{ dsPurchaseIntent.carInsuranceCompanyName } </span>
              <span>费用：
                <i>
                  { dsPurchaseIntent.carInsurancePrice < 10000 ? convertNum(dsPurchaseIntent.carInsurancePrice) : ConvertPriceToLargerNumber(dsPurchaseIntent.carInsurancePrice) }
                  { dsPurchaseIntent.carInsurancePrice < 10000 ? '元' : '万元' }
                </i>
              </span>
          </p>
          <p className="insur_cont">保险内容 交强险+车损险+第三者责任险[50万元]+不计免赔险</p>
        </div>
        <FreeUpgradeConfig />
        {
          dsPurchaseIntent.piState == 2 ?
            <div className="Contact_Cus">
              <Link to={ '/pay_success/' + dsPurchaseIntent.piId } className="see_licence" onClick={CollectClickData.bind(null,{poicode:'MWBY'})}>查看支付凭证</Link>
            </div> :
            <div className="Contact_Cus">
              <b onClick={CollectClickData.bind(null,{poicode:'MWAX'})}>{ imChatBtn }</b>
              <Link to={ '/pay_deposit/' + dsPurchaseIntent.piId } className="online_pay" onClick={CollectClickData.bind(null,{poicode:'MWAZ'})}>在线支付预订</Link>
            </div>
        }
      </div>
    )
  }

  render() {
    let orderDetail = this.getOrderDetail()
    let orderRequirement = this.getOrderRequirement()

    return (
      <div className="my_order_buy_detail_content">
        {orderDetail}
        {orderRequirement}
      </div>
    )
  }
}

export default MyOrderBuyDetailContent
