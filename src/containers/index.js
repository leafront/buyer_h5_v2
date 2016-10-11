import React,{ PropTypes } from 'react'
import { Link } from 'react-router'
import IndexBanner from '../components/index/banner'
import TopBar from '../components/common/top_bar'
import IndexHotCarList from '../components/index/hot_car_list'
import IndexHotBrandList from '../components/index/hot_brand_list'
import MoreButton from '../components/index/more_button'
import BottomOptionButton from '../components/common/bottom_option_button'
import BottomNavButton from '../components/common/bottom_nav_button'
import AdvertisementBanner from '../components/index/advertisement_banner'
//import FooterStep from '../components/index/footer_step'
// import Test from '../components/test'
import GlobalLoading from '../components/common/global_loading'
import 'whatwg-fetch'

import { GetGlobalConfig , GetUserLocation , CheckUserLocationIsSet , SaveUserLocation , GetLocalStorageInfo , SetLocalStorageInfo , ConvertObjectToQueryString , GetQueryStringByName } from '../common'

class CityOptions extends React.Component {
  constructor(props) {
    super(props)

  }

  getCityName(cityCode){//->cityName:String
    let cityName = null
    switch(cityCode){
      case 310000:
        cityName = '上海市'
        break
      case 330100:
        cityName = '杭州市'
        break
      default:
    }
    return cityName
  }
  switchCity(cityCode){
    //set city state
    SaveUserLocation(cityCode)
    this.props.setUserLocation(cityCode)
    this.props.hidePopupCityOptions()
  }
  render(){
    const cityName = this.getCityName(this.props.cityCode)

    return (
      <div className="popup_city_options">
        <div className="">
          <div className="current_city">
            <span className="city_name">{cityName}</span>
            <span className="title">当前默认城市</span>
          </div>
          <div className="city_switch_button">
            <h3>已开通城市</h3>
            <ul>
              <li>
                <div>
                  <button className="city_button_sh" onClick={this.switchCity.bind(this,310000)}></button>
                </div>
                <div>上海市</div>
              </li>
              <li>
                <div>
                  <button className="city_button_hz" onClick={this.switchCity.bind(this,330100)}></button>
                </div>
                <div>杭州市</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

class CopyRight extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <div className="copyright">
        <p>版权所有 沪ICP备12049095号-3</p>
        <p>©️ 2013-2016 上海轩言网络信息科技有限公司</p>
        <p className="sale_company_name">销售服务：上海互言汽车服务有限公司</p>
      </div>
    )
  }
}

class Index extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      carList:[],
      currentBannerLeft:-200,
      bannerList:[],
      dataLoading:false,
      isPopupCityOptionsVisible:false,
      cityCode:null,
      lastAskPriceList:[]
    }
  }
  async componentDidMount(){

    this.showLoading()

    await GetUserLocation()

    await this.getHotcarList()

    await this.getAdvertList()

    await this.getLastAskPrice()

    this.hideLoading()
  }
  async getHotcarList(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const RequestData = ConvertObjectToQueryString({
      cityCode:CityCode
    })

    const Response = await fetch(
      GetGlobalConfig().env + '/hybrid/ask/getHotcarList',
      {
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:RequestData,
        method:'POST'
      }
    )
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    if(ResponseOK && ResponseJSON.status === 1){
      await this.setState({
        carList:ResponseJSON.data.list,
        cityCode:CityCode
      })
    }
  }
  showLoading(){
    this.setState({
      dataLoading:true
    })
  }
  hideLoading(){
    this.setState({
      dataLoading:false
    })
  }
  switchPopupCityOptions(){
    //hide city switch function tmp
    // return false
    if(this.state.isPopupCityOptionsVisible){
      this.hidePopupCityOptions()
    }else{
      this.showPopupCityOptions()
    }
  }
  showPopupCityOptions(){
    this.setState({
      isPopupCityOptionsVisible:true
    })
  }
  hidePopupCityOptions(){
    this.setState({
      isPopupCityOptionsVisible:false
    })
  }
  async getAdvertList(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const RequestData = ConvertObjectToQueryString({
      cityCode:CityCode
    })

    const Response = await fetch(
      GetGlobalConfig().env + '/hybrid/user/advertList',
      {
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:RequestData,
        method:'POST'
      }
    )
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    if(ResponseOK && ResponseJSON.status === 1){
// console.log(ResponseJSON.data.list)
      let filledBannerList = []
      if(ResponseJSON.data.list.length > 0){
        filledBannerList = this.fillBannerList(ResponseJSON.data.list)
      }

      this.setState({
        bannerList:filledBannerList
      })
    }
  }

  async getLastAskPrice(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const RequestData = ConvertObjectToQueryString({
      cityCode:CityCode
    })
    const Response = await fetch(
      GetGlobalConfig().env + '/hybrid/ask/getLastAskPrice',
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: RequestData,
        method: 'POST'
      }
    )
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()

    if(ResponseOK){
      this.setState({
        lastAskPriceList:ResponseJSON[0].data
      })
    }
  }

  fillBannerList(bannerList){
    if(!bannerList) return []
    let filledBannerList = bannerList
    while(filledBannerList.length < 5) {
      filledBannerList = filledBannerList.concat(bannerList)
    }
    return filledBannerList
  }
  updateCurrentBannerLeft(bannerLeft){
    this.setState({
      currentBannerLeft:bannerLeft
    })
  }
  modifyBannerList(newBannerList){
    this.setState({
      bannerList:newBannerList
    })
  }
  async setUserLocation(cityCode){
    SetLocalStorageInfo('HMC_USER_CURRENT_CITY',{cityCode:cityCode})
    this.setState({
      cityCode:cityCode
    })

    this.showLoading()

    await this.getHotcarList()
    await this.getAdvertList()

    this.hideLoading()
  }
  render(){
    return (
      <div className="index">
        <TopBar
          currentRoute={this.props.routes[0].path}
          switchPopupCityOptions={this.switchPopupCityOptions.bind(this)}
          cityCode={this.state.cityCode}
        />
        <AdvertisementBanner
          currentBannerLeft={this.state.currentBannerLeft}
          bannerList={this.state.bannerList}
          updateCurrentBannerLeft={this.updateCurrentBannerLeft.bind(this)}
          modifyBannerList={this.modifyBannerList.bind(this)}
        />
        <IndexBanner cityCode={this.state.cityCode} lastAskPriceList={this.state.lastAskPriceList}/>
        <IndexHotBrandList/>
        <IndexHotCarList carList={this.state.carList}/>
        <MoreButton/>
        <CopyRight/>
        <BottomNavButton page="home" />
        {
          this.state.dataLoading ?
            <GlobalLoading/>
            : null
        }
        {
          this.state.isPopupCityOptionsVisible ?
            <CityOptions
              hidePopupCityOptions={this.hidePopupCityOptions.bind(this)}
              cityCode={this.state.cityCode}
              setUserLocation={this.setUserLocation.bind(this)}
            />
          : null
        }
      </div>
    )
  }
}

export default Index
