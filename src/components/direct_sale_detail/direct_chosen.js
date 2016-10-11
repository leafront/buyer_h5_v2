import React from 'react'

import { CollectClickData } from '../../data_collection'

class DirectChosen extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    if(this.props.carDetailList.length === 0){
      return null
    }
    // console.log(this.props.carDetailList[this.props.currentCarModelIndex].modelColorName[this.props.currentColorIndex])
    return (
      <div>
        <ul>
          <li className="chosen" onClick={this.props.showPopupCarOptions.bind(this)}>
            <p className="status">款型</p>
            <p className="chosenCar">{this.props.carDetailList[this.props.currentCarModelIndex].modelName}</p>
            <img src={require('../../../images/direct_sale_detail/detail.png')} onClick={CollectClickData.bind(null,{poicode:'MZ31'})}/>
          </li>
          <li className="need" onClick={this.props.showPopupCarOptions.bind(this)}>
            <p className="status">需求</p>
            <p className="chosenType">{this.props.carDetailList[this.props.currentCarModelIndex].modelColorName[this.props.currentColorIndex]}，{this.props.carDetailList[this.props.currentCarModelIndex].modelLicenseOption[this.props.currentLicenseIndex]}，{this.props.carDetailList[this.props.currentCarModelIndex].modelPaymentOption[this.props.currentPayMethodIndex]}</p>
            <img src={require('../../../images/direct_sale_detail/detail.png')} onClick={CollectClickData.bind(null,{poicode:'MZ33'})}/>
          </li>
        </ul>
      </div>
    )
  }
}

export default DirectChosen