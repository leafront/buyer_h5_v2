import React,{ PropTypes } from 'react'
import { Link , hashHistory } from 'react-router'
import TopBar from '../components/common/top_bar'
import ImChatButton from '../components/common/im_chat_button'
import GlobalLoading from '../components/common/global_loading'

import { GetGlobalConfig , ConvertPriceToTenThousand , GetUserLocation , GetLocalStorageInfo , ConvertObjectToQueryString , GetQueryStringByName } from '../common'
import { CollectClickData } from '../data_collection'
import { getCityAreaData } from '../data/city_area_data'

class PopupArea extends React.Component {
  constructor(props) {
    super(props)

  }
  render() {

    let popupAreaComponent = null
    if(this.props.isPopupAreaVisible){
      let provinceList = []
      let districtList = []
      const ActiveClass = " active "
      this.props.cityAreaData.Province.forEach((item,i) => {
        let listHighlightClass = ""
        if(this.props.currentProvince === i){
          listHighlightClass = ActiveClass
        }
        provinceList.push(
          <li key={i} onClick={this.props.setProvinceIndex.bind(this,i)} className={listHighlightClass}>{item}</li>
        )
      })
      this.props.cityAreaData.District[this.props.currentProvince].forEach((item,i) => {
        let listHighlightClass = ""
        if(this.props.currentDistrict === i){
          listHighlightClass = ActiveClass
        }
        districtList.push(
          <li key={i} onClick={this.props.setDistrictIndex.bind(this,i)} className={listHighlightClass}>{item}</li>
        )
      })
      popupAreaComponent = (
        <div className="popup_area">
          <div className="content">
            <div className="province">
              <ul>{provinceList}</ul>
            </div>
            <div className="district">
              <ul>{districtList}</ul>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div>
        {popupAreaComponent}
      </div>
    )
  }
}

class ModelInfo extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    if(Object.keys(this.props.carModelInfo).length === 0){
      return null
    }
    return (
      <div className="model_info clearfix">
        <div className="model_img fl">
          <img width="140" src={this.props.carModelInfo.modelPic}/>
        </div>
        <div className="model_desc fl">
          <p>{this.props.carModelInfo.brandName + this.props.carModelInfo.typeName + this.props.carModelInfo.modelName}</p>
          <p className="recommand_price">{'指导价：' + ConvertPriceToTenThousand(this.props.carModelInfo.mrsp) + '万'}</p>
        </div>
        <Link to={"/car_model/" + this.props.routeParams.seriesId } className="change_model" onClick={CollectClickData.bind(null,{poicode:'MB51'})}>更改款型</Link>
      </div>
    )
  }
}

class UserOptions extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      colorActiveIndex:0,
      payMethodActiveIndex:0,
      licenseActiveIndex:0,
      timeActiveIndex:0,
      colorOptionsVisibleLength:3,
      // areaOptionVisibleClass:"",
      colorOptionsData:this.props.colorOptionsData,
      needLoan:0,
      needReplace:0,
      payMethodData:["全款","贷款","全款+置换","贷款+置换"],
      licenseData:[],
      licenseTypeIds:[],
      // licenseData:["上沪牌","上沪C","上外牌"],
      timeData:["3个月后","3个月内","1个月内","2周内"]
      //["外地户籍"]
    }
  }
  switchLoanOptions(payMethodIndex = 0){
    switch(payMethodIndex) {
      case 0:
        this.setState({
          needLoan:0
        })
        break
      case 2:
        this.setState({
          needLoan:0
        })
        break
      default:
        this.setState({
          needLoan:1
        })
        break
    }
  }
  switchReplaceOptions(payMethodIndex = 0){
    switch(payMethodIndex) {
      case 0:
        this.setState({
          needReplace:0
        })
        break
      case 1:
        this.setState({
          needReplace:0
        })
        break
      default:
        this.setState({
          needReplace:1
        })
        break
    }
  }
  optionClicked(i,activeIndexEnum,e){
    switch (activeIndexEnum) {
      case 'colorActiveIndex':
        this.setState({colorActiveIndex:i})

        CollectClickData({poicode:'MB52'})
        break
      case 'payMethodActiveIndex':
        this.setState({payMethodActiveIndex:i})
        this.switchLoanOptions(i)
        this.switchReplaceOptions(i)

        CollectClickData({poicode:'MB54'})
        break
      case 'licenseActiveIndex':
        this.setState({licenseActiveIndex:i})

        CollectClickData({poicode:'MB55'})
        break
      case 'timeActiveIndex':
        this.setState({timeActiveIndex:i})

        CollectClickData({poicode:'MB53'})
        break
      default:
        return
    }
  }
  setColorOptions(optionsData,optionIndex,type) {
    if(!optionsData) return null
    let optionArray = []
    optionsData.forEach(function(item,i){
      let activeClass = ''
      let hideClass = ''
      if(i === optionIndex){
        activeClass = ' active '
      }
      if(i > this.state.colorOptionsVisibleLength - 1){
        hideClass = ' hide '
      }
      optionArray.push(
        <button onClick={this.optionClicked.bind(this,i,'colorActiveIndex')} key={i} className={activeClass + hideClass} style={{backgroundColor: item.colorValue}}><i>{item.colorName}</i></button>
      )
    }.bind(this))
    return optionArray
  }
  setOpitons(optionsData,optionIndex,indexBinding) {
    if(!optionsData) return null
    let optionArray = []
    optionsData.forEach(function(item,i){
      let activeClass = ''
      if(i === optionIndex){
        activeClass = 'active'
      }
      optionArray.push(
        <button onClick={this.optionClicked.bind(this,i,indexBinding)} key={i} className={activeClass}>{item}</button>
      )
    }.bind(this))
    return optionArray
  }
  getReformatLicenseData(){
    // optionType
    let licenseData = this.props.currentCarInfo.license[this.state.licenseActiveIndex].optionType
    if(this.state.licenseActiveIndex === 2){
      licenseData = this.props.cityAreaData.Province[this.props.currentProvince] + ',' + this.props.cityAreaData.District[this.props.currentProvince][this.props.currentDistrict]
    }
    return licenseData
  }
  saveCurrentParityOptions(){
    CollectClickData({poicode:'MB5A'})
    // console.log(this.props.currentCarInfo)
    const ReformatedLicenseArea = this.getReformatLicenseData()
    const CurrentUserOptions = {
      seriesId:this.props.currentSeriesId,
      seriesName:this.props.currentCarInfo.typeName,
      modelId:this.props.currentModelId,
      modelName:this.props.currentCarInfo.modelName,
      color:this.props.colorOptionsData[this.state.colorActiveIndex].colorName,
      // payMethod:this.state.payMethodData[this.state.payMethodActiveIndex],
      needLoan:this.state.needLoan,
      needReplace:this.state.needReplace,
      licenseArea:ReformatedLicenseArea,//this.props.cityAreaData,//
      buyTime:this.state.timeData[this.state.timeActiveIndex],
      carPrice:this.props.currentCarInfo.mrsp,
      // licenseProvinceType://askpLocation
    }
    sessionStorage.USER_SELECTED_PARITY_OPTIONS = JSON.stringify(CurrentUserOptions)

    hashHistory.push('/car_shop')
  }
  showAllColorOptions(e){
    this.setState({
      colorOptionsVisibleLength:this.props.colorOptionsData.length
    })

    CollectClickData({poicode:'MB59'})
  }
  setLicenseOptions(optionIndex,indexBinding){
    // console.log(this.props.currentCarInfo.license)
    if(!this.props.currentCarInfo.license) return null

    let optionArray = []
    this.props.currentCarInfo.license.forEach((item,i) => {
      let activeClass = ''
      if(i === optionIndex){
        activeClass = 'active'
      }
      optionArray.push(
        <button onClick={this.optionClicked.bind(this,i,indexBinding)} key={i} className={activeClass}>{item.optionBuyerExplain}</button>
      )
    })

    return optionArray
  }
  render() {
    const colorOptions = this.setColorOptions(this.props.colorOptionsData,this.state.colorActiveIndex)
    const payMethodOptions = this.setOpitons(this.state.payMethodData,this.state.payMethodActiveIndex,'payMethodActiveIndex')
    // const licenseOptions = this.setOpitons(this.state.licenseData,this.state.licenseActiveIndex,'licenseActiveIndex')
    const licenseOptions = this.setLicenseOptions(this.state.licenseActiveIndex,'licenseActiveIndex')
    const timeOptions = this.setOpitons(this.state.timeData,this.state.timeActiveIndex,'timeActiveIndex')

    let areaOptionsComponent = null
    if(this.state.licenseActiveIndex == 2){
      areaOptionsComponent = (
        <dl className="area_options active">
          <dt>选择户籍地址</dt>
          <dd><button onClick={this.props.showAreaOptions.bind(this)}>{this.props.cityAreaData.Province[this.props.currentProvince] + ' - ' + this.props.cityAreaData.District[this.props.currentProvince][this.props.currentDistrict]}</button></dd>
        </dl>
      )
    }
    let showAllColorButton = null
    if(this.props.colorOptionsData && this.state.colorOptionsVisibleLength !== this.props.colorOptionsData.length){
      showAllColorButton = (
        <input className="show_all_color_button" type="button" onClick={this.showAllColorOptions.bind(this)} value="+"/>
      )
    }

    return (
      <div className="user_options">
        <div>
          <dl className="color_options">
            <dt>外观颜色</dt>
            <dd>{colorOptions}</dd>
            <dd>{showAllColorButton}</dd>
          </dl>
          <dl className="pay_method_options">
            <dt>购车方式</dt>
            <dd>{payMethodOptions}</dd>
          </dl>
          <dl className="license_options">
            <dt>牌照</dt>
            <dd>{licenseOptions}</dd>
          </dl>
          {areaOptionsComponent}
          <dl className="time_options">
            <dt>购车时间</dt>
            <dd>{timeOptions}</dd>
          </dl>
        </div>
        <div className="submit">
          <button onClick={this.saveCurrentParityOptions.bind(this)}>下一步，选择4S店</button>
        </div>
      </div>
    )
  }
}

class CarParity extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      carModelInfo:{},
      isPopupAreaVisible:false,
      dataLoading:false,
      currentProvince:0,
      currentDistrict:0,
      cityAreaData:getCityAreaData()
    }
  }
  async componentDidMount(){
    this.showLoading()

    await GetUserLocation()

    await this.getModelListByTypeId()

    await this.setInitProvinceByCityCode()

    this.hideLoading()
  }
  setInitProvinceByCityCode(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode

    if(CityCode == 330100){
      this.setState({
        currentProvince: 5
      })
    }
  }
  async getModelListByTypeId(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const RequestData = ConvertObjectToQueryString({
      modelId:this.props.params.modelId,
      cityCode:CityCode
    })

    const Response = await fetch(
      GetGlobalConfig().env + '/hybrid/ask/getModelListByTypeId',
      {
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:RequestData,
        method:'POST'
      }
    )
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()

    if(ResponseOK){
      //@careful!!! add dynamic option at the end of array
      ResponseJSON.data.license.push({
        optionType: null,
        optionBuyerExplain: "上外牌"
      })
      this.setState({
        carModelInfo:ResponseJSON.data
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
  showAreaOptions(){
    this.setState({
      isPopupAreaVisible:true
    })

    CollectClickData({poicode:'MB56'})
  }
  hideAreaOptions(){
    this.setState({
      isPopupAreaVisible:false
    })
  }
  setProvinceIndex(index = 0){
    this.setState({
      currentProvince:index
    })
    this.resetDisctrictIndex()
  }
  resetDisctrictIndex(){
    this.setState({
      currentDistrict:0
    })
  }
  setDistrictIndex(index = 0){
    this.setState({
      currentDistrict:index
    })
    this.hideAreaOptions()

    CollectClickData({poicode:'MB58'})
  }
  render(){
    return (
      <div className="car_parity">
        <TopBar pageTitle="比价需求"/>
        <ImChatButton/>
        <ModelInfo carModelInfo={this.state.carModelInfo} routeParams={this.props.params}/>
        <UserOptions
          colorOptionsData={this.state.carModelInfo.colorList}
          currentModelId={this.props.params.modelId}
          currentSeriesId={this.props.params.seriesId}
          currentCarInfo={this.state.carModelInfo}
          showAreaOptions={this.showAreaOptions.bind(this)}
          cityAreaData={this.state.cityAreaData}
          currentProvince={this.state.currentProvince}
          currentDistrict={this.state.currentDistrict}
        />
        <PopupArea
          isPopupAreaVisible={this.state.isPopupAreaVisible}
          currentProvince={this.state.currentProvince}
          currentDistrict={this.state.currentDistrict}
          setProvinceIndex={this.setProvinceIndex.bind(this)}
          setDistrictIndex={this.setDistrictIndex.bind(this)}
          cityAreaData={this.state.cityAreaData}
        />
        {
          this.state.dataLoading ?
            <GlobalLoading/> : null
        }
      </div>
    )
  }
}
export default CarParity
