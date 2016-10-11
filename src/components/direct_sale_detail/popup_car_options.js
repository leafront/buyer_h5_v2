import React from 'react'

import {ConvertPriceToLargerNumber} from '../../common'

import { CollectClickData } from '../../data_collection'

class CarOptionItem extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    let optionItems = []

    this.props.optionItems.forEach((item,index) => {
      optionItems.push(
        <dd className={this.props.selectedIndex === index ? 'active' : null} onClick={this.props.optionClicked.bind(this,index)}>{item}</dd>
      )
    })

    return (
      <dl className={this.props.optionClassName}>
        <dt>{this.props.optionName}</dt>
        {optionItems}
      </dl>
    )
  }
}

class PopupCarOptions extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount(){

  }
  setCarOptionItem(){
    if(Object.keys(this.props.carDetailList).length === 0){
      return null
    }
    let carOptionItem = []

    let carModels = []
    this.props.carDetailList.forEach((item,index) => {
      carModels.push(item.modelName)
    })

    const CarModelOptions = (
      <CarOptionItem
        optionClassName='model'
        optionName='款型'
        optionItems={carModels}
        selectedIndex={this.props.currentCarModelIndex}
        optionClicked={this.props.selectCarModel}
      />
    )
    const ColorOptions = (
      <CarOptionItem
        optionClassName='color'
        optionName='颜色'
        optionItems={this.props.carDetailList[this.props.currentCarModelIndex].modelColorName}
        selectedIndex={this.props.currentColorIndex}
        optionClicked={this.props.selectColor}
      />
    )
    const LicenseTypeOptions = (
      <CarOptionItem
        optionClassName='license_type'
        optionName='牌照'
        optionItems={this.props.carDetailList[this.props.currentCarModelIndex].modelLicenseOption}
        selectedIndex={this.props.currentLicenseIndex}
        optionClicked={this.props.selectLicense}
      />
    )
    const PaymentOptions = (
      <CarOptionItem
        optionClassName='pay_method'
        optionName='购车方式'
        optionItems={this.props.carDetailList[this.props.currentCarModelIndex].modelPaymentOption}
        selectedIndex={this.props.currentPayMethodIndex}
        optionClicked={this.props.selectPayment}
      />
    )

    carOptionItem.push(CarModelOptions)
    carOptionItem.push(ColorOptions)
    carOptionItem.push(LicenseTypeOptions)
    carOptionItem.push(PaymentOptions)

    return carOptionItem
  }

  onConfirmCarOptionsClick(){
    this.props.confirmCarOptions()
    CollectClickData({poicode:'MZ37'})
  }

  onConfirmCarOptionsHide(e){
    let outsideOption=e.target.className
    if(outsideOption=="popup_car_options"){
      this.props.confirmCarOptions()
    }
    CollectClickData({poicode:'MZ37'})
  }

  render(){
    if(this.props.carDetailList.length === 0 || !this.props.isPopupCarOptionsVisible){
      return null
    }

    const CarOptionItems = this.setCarOptionItem()

    return (
      <div className="popup_car_options" onClick={this.onConfirmCarOptionsHide.bind(this)}>
        <div className="all_info_wrapper">
          <div className="all_info_scroller">
            <div className="car_info">
              <div className="car_img"><img src={this.props.carDetailList[this.props.currentCarModelIndex].modelPhoto}/></div>
              <div className="car_price">
                <p className="car_discount_price"><b>{ConvertPriceToLargerNumber(this.props.carDetailList[this.props.currentCarModelIndex].dsrp)}</b>万</p>
                <p className="car_recommand_price">指导价¥{ConvertPriceToLargerNumber(this.props.carDetailList[this.props.currentCarModelIndex].msrp)}万</p>
              </div>
            </div>
            <div className="car_options">
              {CarOptionItems}
            </div>
          </div>
          <div className="confirm_options">
            <button onClick={this.onConfirmCarOptionsClick.bind(this)}>确定</button>
          </div>
        </div>
      </div>
    )
  }
}

export default PopupCarOptions
