import React from 'react'
import { hashHistory , Link } from 'react-router'

import { CollectClickData } from '../../data_collection'

class IndexTopBar extends React.Component {
  constructor(props) {
    super(props)

  }
  getCurrentCityNameByCityCode(cityCode){//->String
    let cityName = null
    switch(cityCode){
      case 310000:
        cityName = '上海'
        break
      case 330100:
        cityName = '杭州'
        break
    }
    return cityName
  }
  render() {
    const cityName = this.getCurrentCityNameByCityCode(this.props.cityCode)
    return (
      <div className={"index_top_bar" + this.props.visibleClass} onClick={this.props.switchPopupCityOptions}>
        <h1 className="logo"></h1>
        <p className="location">{cityName}</p>
      </div>
    )
  }
}

class HomeButtonPopupMenu extends React.Component {
  constructor(props) {
    super(props)
  }
  clickHomeButton(){
    const PoicodeObject = this.props.getCurrentPoicode()
    CollectClickData({poicode:PoicodeObject.homeButton})

  }
  clickUserCenter(){
    const PoicodeObject = this.props.getCurrentPoicode()
    CollectClickData({poicode:PoicodeObject.goUserCenter})
  }
  clickIndex(){
    const PoicodeObject = this.props.getCurrentPoicode()
    CollectClickData({poicode:PoicodeObject.goHomeLink})
  }
  render() {
    // let userCenterLinkComponent = (
    //   <Link to="/user_center" onClick={this.clickUserCenter.bind(this)}>个人中心</Link>
    // )
    // if(!this.props.isUserCenterLinkVisible){
    //   userCenterLinkComponent = null
    // }
    return (

      <div>
        <Link to="/" onClick={this.clickHomeButton.bind(this)}><button className="home_btn"></button></Link>
      </div>
    )
  }
}

class OtherTopBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isPopupVisible:false
    }
  }
  switchPopupVisible(){
    this.setState({
      isPopupVisible:!this.state.isPopupVisible
    })

    const PoicodeObject = this.getCurrentPoicode()
    CollectClickData({poicode:PoicodeObject.homeButton})
  }
  getCurrentPoicode(){//->{backButton:String,homeButton:String,goHomeLink:String,goUserCenter:String}
    let url = window.location.href
    const URL_PATTERN = [
      {route:/login_and_reg/,poicode:{backButton:'MD22',homeButton:'MD23',goHomeLink:'MD24',goUserCenter:'MD25'}},
      {route:/car_series/,poicode:{backButton:'MB3W',homeButton:'MB3X',goHomeLink:'MB3Y',goUserCenter:'MB3Z'}},
      {route:/car_model/,poicode:{backButton:'MB4W',homeButton:'MB4X',goHomeLink:'MB4Y',goUserCenter:'MB4Z'}},
      {route:/car_shop/,poicode:{backButton:'MB6W',homeButton:'MB6X',goHomeLink:'MB6Y',goUserCenter:'MB6Z'}},
      {route:/brand_list/,poicode:{backButton:'MB2W',homeButton:'MB2X',goHomeLink:'MB2Y',goUserCenter:'MB2Z'}},
      {route:/car_parity/,poicode:{backButton:'MB5W',homeButton:'MB5X',goHomeLink:'MB5Y',goUserCenter:'MB5Z'}},
      {route:/user_center/,poicode:{backButton:'MP18',homeButton:'MP27',goHomeLink:'MP28',goUserCenter:''}},
      {route:/setting/,poicode:{backButton:'MPS06',homeButton:'MPS07',goHomeLink:'MPS08',goUserCenter:''}},
      {route:/feedback/,poicode:{backButton:'MPF06',homeButton:'MPF07',goHomeLink:'MPF08',goUserCenter:''}},
      {route:/about_hmc/,poicode:{backButton:'MPG16',homeButton:'MPG17',goHomeLink:'MPG18',goUserCenter:''}},
      {route:/about/,poicode:{backButton:'MPG06',homeButton:'MPG07',goHomeLink:'MPG08',goUserCenter:''}},
      {route:/com_problem/,poicode:{backButton:'MPG26',homeButton:'MPG27',goHomeLink:'MPG28',goUserCenter:''}},
      {route:/protocol/,poicode:{backButton:'MPG36',homeButton:'MPG37',goHomeLink:'MPG38',goUserCenter:''}},
      {route:/account/,poicode:{backButton:'MPQ06',homeButton:'MPQ07',goHomeLink:'MPQ08',goUserCenter:''}},
      {route:/my_inquire_detail/,poicode:{backButton:'MPB16',homeButton:'MPB17',goHomeLink:'MPB18',goUserCenter:''}},
      {route:/my_inquire/,poicode:{backButton:'MPB6',homeButton:'MPB07',goHomeLink:'MPB08',goUserCenter:''}},
      {route:/direct_sale_inquire/,poicode:{backButton:'MZ8W',homeButton:'MZ8Y',goHomeLink:'',goUserCenter:''}},
      {route:/inquire/,poicode:{backButton:'MB7W',homeButton:'MB7X',goHomeLink:'MB7Y',goUserCenter:'MB7Z'}},
      {route:/direct_sale_list/,poicode:{backButton:'MZ2W',homeButton:'MZ2Y',goHomeLink:'',goUserCenter:''}},
      {route:/direct_sale_detail/,poicode:{backButton:'MZ3W',homeButton:'MZ3Y',goHomeLink:'',goUserCenter:''}},
      {route:/price/,poicode:{backButton:'MZ4W',homeButton:'MZ7Y',goHomeLink:'',goUserCenter:''}},
      {route:/my_order_buy_detail/,poicode:{backButton:'MZAW',homeButton:'',goHomeLink:'',goUserCenter:''}},
      {route:/my_order/,poicode:{backButton:'MWAW',homeButton:'',goHomeLink:'',goUserCenter:''}}
    ]
    const URL = url.split('#')[1].toLowerCase()

    let poicodeObject = null

    for(let item of URL_PATTERN){
      if(item.route.test(URL)){
        poicodeObject = item.poicode
        break
      }
    }
    return poicodeObject
  }
  clickBackButton(){
    const URL = window.location.href.split('#')[1].toLowerCase()
    const PoicodeObject = this.getCurrentPoicode()
    let isInquireSuccess = /inquire/.test(URL) && !(/my_inquire_detail/.test(URL)) && !(/my_inquire/.test(URL))
    let isPaySuccess = /pay_success/.test(URL)
    if (isInquireSuccess) {
      hashHistory.push('/')
      // CollectClickData({poicode:PoicodeObject.backButton})
    } else if (isPaySuccess) {
      hashHistory.replace('/my_order')
    } else {
      hashHistory.goBack()

      // CollectClickData({poicode:PoicodeObject.backButton})
    }
    CollectClickData({poicode:PoicodeObject.backButton})
  }

  render(){
    let popupVisibleClass = " active "
    if(!this.state.isPopupVisible){
      popupVisibleClass = ""
    }

    return (
      <div className={"other_top_bar" + this.props.visibleClass}>
        <h1 className="page_title">{this.props.pageTitle}</h1>
        <Link to="/"><button className="home_btn"></button></Link>
        <HomeButtonPopupMenu
          popupVisibleClass={popupVisibleClass}
          isUserCenterLinkVisible={this.props.isUserCenterLinkVisible}
          getCurrentPoicode={this.getCurrentPoicode.bind(this)}
        />
        <button className="back_btn" onClick={this.clickBackButton.bind(this)}></button>
      </div>
    )
  }
}

class TopBar extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    let isHomeTopBarVisible = ""
    let isOtherTopBarVisible = " active "
    let isUserCenterLinkVisible = true

    switch (this.props.currentRoute) {
      case '/':
        isHomeTopBarVisible = " active "
        isOtherTopBarVisible = ""
      break
      case 'user_center':
        isUserCenterLinkVisible = false
      break
      default:
      break
    }
    return (
      <div className="top_bar">
        <IndexTopBar
          visibleClass={isHomeTopBarVisible}
          switchPopupCityOptions={this.props.switchPopupCityOptions}
          cityCode={this.props.cityCode}
        />
        <OtherTopBar visibleClass={isOtherTopBarVisible} pageTitle={this.props.pageTitle} isUserCenterLinkVisible={isUserCenterLinkVisible}/>
      </div>
    )
  }
}

export default TopBar;
