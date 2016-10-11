import React from 'react'

import {ConvertPriceToLargerNumber} from '../../common'

class DetailPrice extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    let carDetailList = null
    if(this.props.carDetailList.length > 0){
      carDetailList = (
        <div className="priceGive">
          <div className="detailPrice">
            <p className="carName">{this.props.carDetailList[this.props.currentCarModelIndex].modelBrandName}<span>{this.props.carDetailList[this.props.currentCarModelIndex].modelTypeName}</span></p>
            <p className="carPrice">￥<span className="price">{ConvertPriceToLargerNumber(this.props.carDetailList[this.props.currentCarModelIndex].dsrp).toFixed(2)}</span>万</p>
            <p className="discount">最多省 ￥<span>{((this.props.carDetailList[this.props.currentCarModelIndex].msrp - this.props.carDetailList[this.props.currentCarModelIndex].dsrp)/10000).toFixed(2)}</span>万</p>
            <p className="guidePrice">指导价 ￥<span>{(this.props.carDetailList[this.props.currentCarModelIndex].msrp / 10000).toFixed(2)}</span>万</p>
          </div>
        </div>
      )
    }
    return carDetailList
  }
}

export default DetailPrice