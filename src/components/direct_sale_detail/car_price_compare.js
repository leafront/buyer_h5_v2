import React from 'react'

class CarPriceCompare extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    let carDetailList = null
    return carDetailList
    /* not using now */
    if(this.props.carDetailList.length > 0){
      let ratioHui=this.props.carDetailList[this.props.currentCarModelIndex].referPrices[1].price/this.props.carDetailList[this.props.currentCarModelIndex].msrp
      let ratioHao=this.props.carDetailList[this.props.currentCarModelIndex].dsrp/this.props.carDetailList[this.props.currentCarModelIndex].msrp
      let ratioHome=this.props.carDetailList[this.props.currentCarModelIndex].referPrices[0].price/this.props.carDetailList[this.props.currentCarModelIndex].msrp
      // console.log(ratioHui)
      carDetailList = (
        <div className="carPriceCompare">
          <ul>
            <li>
              <div className="compareChart">
                <div className="compareChartInner" style={{height:'108px',marginTop:'24%'}}></div>
              </div>
              <div className="compareContent">
                <p className="compareType">指导价</p>
                <p className="comparePrice">￥{FormatNumberWithComma(this.props.carDetailList[this.props.currentCarModelIndex].msrp)}</p>
              </div>
            </li>
            <li>
              <div className="compareChart">
                <div className="compareChartInner" style={{height:108*ratioHui+'px',marginTop:(136*(1-ratioHui)+26)+'px'}}></div>
              </div>
              <div className="compareContent">
                <p className="compareType">惠买车</p>
                <p className="comparePrice">￥{FormatNumberWithComma(this.props.carDetailList[this.props.currentCarModelIndex].referPrices[1].price)}</p>
              </div>
            </li>
            <li className="goodBuy">
              <div className="compareChart">
                <div className="compareChartInner" style={{height:108*ratioHao+'px',marginTop:(136*(1-ratioHao)+26)+'px'}}></div>
              </div>
              <div className="compareContent">
                <p className="compareType">好买车</p>
                <p className="comparePrice">￥{FormatNumberWithComma(this.props.carDetailList[this.props.currentCarModelIndex].dsrp)}</p>
              </div>
            </li>
            <li>
              <div className="compareChart">
                <div className="compareChartInner" style={{height:108*ratioHome+'px',marginTop:(136*(1-ratioHome)+26)+'px'}}></div>
              </div>
              <div className="compareContent">
                <p className="compareType">汽车之家</p>
                <p className="comparePrice">￥{FormatNumberWithComma(this.props.carDetailList[this.props.currentCarModelIndex].referPrices[0].price)}</p>
              </div>
            </li>
          </ul>
        </div>
      )
    }
    return carDetailList
  }
}

export default CarPriceCompare