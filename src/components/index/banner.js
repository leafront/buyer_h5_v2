import React from 'react'
import { Link } from 'react-router'

import { CollectClickData } from '../../data_collection'


class LastAskPrice extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){

    return (
      <li>
        <img src={this.props.data.tpicPath}/>
        <span>{this.props.data.askpTypeName + ' ' + this.props.data.askpModelName}</span>
      </li>
    )
  }
}

class IndexBanner extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      top: -100,
      topTransition:'top 2s'
    }
  }
  componentDidMount(){
    this.autoScrollAskPriceList()
  }
  componentWillUnmount(){
    this.clearAutoScrollAskPriceList()
  }
  clearAutoScrollAskPriceList(){
    clearTimeout(this.autoScrollAskPriceListId)
  }
  autoScrollAskPriceList(){
    this.autoScrollAskPriceListId = setTimeout(() => {
      // console.log(this.state.top)
      if((this.props.lastAskPriceList.length) * 100 > this.state.top || this.state.top === 100){
        this.setState({
          top: this.state.top + 100,
          topTransition: 'top 2s'
        })
      }else{
        this.setState({
          top: -100,
          topTransition: 'top 0s'
        })
      }
      this.autoScrollAskPriceList()
    },2000)
  }
  getTopBannerImg(cityCode){
    let bannerImgSrc = null

    switch (cityCode) {
      case 310000:
        bannerImgSrc = require('../../../images/index/choose_campare.png')
        break
      case 330100:
        bannerImgSrc = require('../../../images/index/choose_campare.png')
        break
      default:
    }
    return bannerImgSrc
  }

  render(){
    let directSale = require('../../../images/index/direct_sale.png')
    let exampleCar = require('../../../images/index/example.png')
    const { cityCode } = this.props

    const bannerImgSrc = this.getTopBannerImg(cityCode)
    let bannerImgSrcStyleText = 'none'
    let directSaleSrcStyleText = 'none'
    if(bannerImgSrc){
      bannerImgSrcStyleText = 'url(' + bannerImgSrc + ')'
      directSaleSrcStyleText='url(' + directSale + ')'
    }

    let lastAskPriceList = []
    this.props.lastAskPriceList.forEach((item,value) => {
      lastAskPriceList.push(
        <LastAskPrice data={item}/>
      )
    })

    return (
      <div className='index_banner_wrapper'>
        <div className='icon'>
          <Link to='/brand_list' className='index_banner' onClick={CollectClickData.bind(null,{poicode:'MA01'})} style={{backgroundImage:bannerImgSrcStyleText}}></Link>
          <Link to='/direct_sale_list' className='direct_sale_img' onClick={CollectClickData.bind(null,{poicode:'MA02'})} style={{backgroundImage:directSaleSrcStyleText}}></Link>
        </div>
        <div className='car_camparing'>
          <div className='car_button'>
            <span className='camparing_button'>正在比价</span>
          </div>
          <div className='camparing_now'>
            <ul style={{top:-this.state.top + '%',transition: this.state.topTransition}}>
              {lastAskPriceList}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default IndexBanner
