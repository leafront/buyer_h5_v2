import React from 'react'
import { hashHistory } from 'react-router'
import TopBar from '../components/common/top_bar'
import ComProblem from './com_problem'
import GlobalLoading from '../components/common/global_loading'
import PopupCarOptions from '../components/direct_sale_detail/popup_car_options'
import PopupGifts from '../components/direct_sale_detail/popup_gifts'
import AttentionMessage from '../components/common/attention_message'
import TabComponent from '../components/direct_sale_detail/tab'
import DirectSaleDetailBanner from '../components/direct_sale_detail/banner'
import PopupLoginAndReg from '../components/direct_sale_detail/popup_login_reg'
import DirectChosen from '../components/direct_sale_detail/direct_chosen'
import BottomButton from '../components/direct_sale_detail/bottom_button'
import DetailPrice from '../components/direct_sale_detail/detail_price'
import CarPriceCompare from '../components/direct_sale_detail/car_price_compare'
import $ from 'jquery'

import { GetGlobalConfig , CheckLogin , GetUserLocation , GetLocalStorageInfo , ConvertObjectToQueryString , GetQueryStringByName , SetLocalStorageInfo , FormatNumberWithComma} from '../common'

import { CollectClickData } from '../data_collection'

import '../style/direct_sale_detail/main.scss'

class DirectSaleDetail extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      carDetailList:[],
      currentCarId:props.params.directSaleCarId,
      currentCarModelId:props.params.directSaleCarModelId,
      currentCarModelIndex:0,
      currentColorIndex:0,
      currentLicenseIndex:0,
      currentPayMethodIndex:0,
      isPopupCarOptionsVisible:false,
      isPopupLoginAndRegVisible:false,
      dataLoading:false
    }
  }

  async componentDidMount(){

    this.showLoading()

    await GetUserLocation()

    await this.getDirectSaleCarDetail()

    this.initSelectedCarModel()

    this.hideLoading()
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

  async getDirectSaleCarDetail(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const RequestData = ConvertObjectToQueryString({
      dsCarTypeId:this.state.currentCarId,
      cityCode:CityCode
    })

    const Response = await fetch(GetGlobalConfig().env + '/hybrid/ds/getDsOnsaleDetails', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:RequestData,
      method: 'POST'
    })

    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    //console.log(ResponseJSON.data)
    if(ResponseOK && ResponseJSON.status === 1){
      this.setState({
        carDetailList:this.handleBloodySharpDataToArray(ResponseJSON.data.dsCarModelList.dsCarModleDetails)
      })
    }
  }
  handleBloodySharpDataToArray(dataWithBloodySharp = []){//->Array
    let wellFormatedData = dataWithBloodySharp
    dataWithBloodySharp.forEach((item,index) => {
      wellFormatedData[index].modelColorName = item.modelColorName.split('#')
      wellFormatedData[index].modelColorValue = item.modelColorValue.split('#')
      wellFormatedData[index].modelLicenseOption = item.modelLicenseOption.split('#')
      wellFormatedData[index].modelPaymentOption = item.modelPaymentOption.split('#')
    })
    return wellFormatedData
  }
  initSelectedCarModel(){
    const CarDetailList = this.state.carDetailList
    const CurrentCarModelId = this.state.currentCarModelId

    for(var i = 0; i < CarDetailList.length; i++){
      if(CurrentCarModelId == CarDetailList[i].modelId){
        this.setState({
          currentCarModelIndex: i
        })
        return
      }
    }
  }
  selectCarModel(optionIndex){
    this.setState({
      currentCarModelIndex:optionIndex
    })
    this.resetAllModelRelatedOptions()

    hashHistory.replace('/direct_sale_detail/' + this.state.currentCarId + '/' + this.state.carDetailList[this.state.currentCarModelIndex].modelId)

    CollectClickData({poicode:'MZ32'})
  }
  selectColor(optionIndex){
    this.setState({
      currentColorIndex:optionIndex
    })

    CollectClickData({poicode:'MZ34'})
  }
  selectLicense(optionIndex){
    this.setState({
      currentLicenseIndex:optionIndex
    })

    CollectClickData({poicode:'MZ35'})
  }
  selectPayment(optionIndex){
    this.setState({
      currentPayMethodIndex:optionIndex
    })

    CollectClickData({poicode:'MZ36'})
  }
  resetAllModelRelatedOptions(){
    this.selectColor(0)
    this.selectLicense(0)
    this.selectPayment(0)
  }
  saveCurrentCarOptions(){
    let tagListDataArray = []
    let tagListData = this.state.carDetailList[this.state.currentCarModelIndex].tagList
    if(tagListData !== null){
      tagListDataArray = tagListData.split('#')
    }

    const carDetail = this.state.carDetailList[this.state.currentCarModelIndex]
    const SelectedCarInfo = {
      carModelId:carDetail.modelId,
      carPhotoLink:carDetail.modelPhoto,
      carBrandName:carDetail.modelBrandName,
      carModelTypeName:carDetail.modelTypeName,
      carModelName:carDetail.modelName,
      carMSRP:carDetail.msrp,
      carDSRP:carDetail.dsrp,
      licenseType:carDetail.modelLicenseOption[this.state.currentLicenseIndex],
      payMethod:carDetail.modelPaymentOption[this.state.currentPayMethodIndex],
      carColorName:carDetail.modelColorName[this.state.currentColorIndex],
      carColorValue:carDetail.modelColorValue[this.state.currentColorIndex],
      tagList:tagListDataArray
    }
    SetLocalStorageInfo('HMC_DIRECT_SALE_CAR_INFO',SelectedCarInfo)
  }
  async goCarTotalPrice(){
    this.saveCurrentCarOptions()
    if(!CheckLogin()){
      this.showPopupLoginAndReg()
      return false
    }
    hashHistory.push('/price/' + this.state.carDetailList[this.state.currentCarModelIndex].modelId)
  }
  confirmCarOptions(){
    this.saveCurrentCarOptions()
    this.hidePopupCarOptions()
  }
  showPopupCarOptions(){
    this.setState({
      isPopupCarOptionsVisible:true
    })
  }
  hidePopupCarOptions(){
    this.setState({
      isPopupCarOptionsVisible:false
    })
  }
  showPopupLoginAndReg(){
    this.setState({
      isPopupLoginAndRegVisible:true
    })
  }
  hidePopupLoginAndReg(){
    this.setState({
      isPopupLoginAndRegVisible:false
    })
  }
  render(){
    return (
      <div className="directSaleDetail">
        <TopBar pageTitle="现车直销"/>
        <PopupCarOptions
          currentCarModelIndex={this.state.currentCarModelIndex}
          carDetailList={this.state.carDetailList}
          currentColorIndex={this.state.currentColorIndex}
          currentLicenseIndex={this.state.currentLicenseIndex}
          currentPayMethodIndex={this.state.currentPayMethodIndex}
          selectCarModel={this.selectCarModel.bind(this)}
          selectColor={this.selectColor.bind(this)}
          selectLicense={this.selectLicense.bind(this)}
          selectPayment={this.selectPayment.bind(this)}
          confirmCarOptions={this.confirmCarOptions.bind(this)}
          isPopupCarOptionsVisible={this.state.isPopupCarOptionsVisible}
        />
        <DirectSaleDetailBanner currentCarModelIndex={this.state.currentCarModelIndex} carDetailList={this.state.carDetailList}/>
        <DetailPrice currentCarModelIndex={this.state.currentCarModelIndex} carDetailList={this.state.carDetailList}/>
        <p className="popUpGitfBg" onClick={CollectClickData.bind(null,{poicode:'MZ3A'})}>
          <PopupGifts/>
        </p>
        <CarPriceCompare currentCarModelIndex={this.state.currentCarModelIndex} carDetailList={this.state.carDetailList}/>
        <DirectChosen
          currentCarModelIndex={this.state.currentCarModelIndex}
          carDetailList={this.state.carDetailList}
          showPopupCarOptions={this.showPopupCarOptions.bind(this)}
          currentColorIndex={this.state.currentColorIndex}
          currentLicenseIndex={this.state.currentLicenseIndex}
          currentPayMethodIndex={this.state.currentPayMethodIndex}
        />
        <TabComponent
          params={this.props.params}
          currentCarModelIndex={this.state.currentCarModelIndex}
          carDetailList={this.state.carDetailList}
        />
        <BottomButton
          currentCarModelIndex={this.state.currentCarModelIndex}
          carDetailList={this.state.carDetailList}
          goCarTotalPrice={this.goCarTotalPrice.bind(this)}
        />
        <PopupLoginAndReg
          hidePopupLoginAndReg={this.hidePopupLoginAndReg.bind(this)}
          isPopupLoginAndRegVisible={this.state.isPopupLoginAndRegVisible}
          showLoading={this.showLoading.bind(this)}
          hideLoading={this.hideLoading.bind(this)}
          goCarTotalPrice={this.goCarTotalPrice.bind(this)}
          currentCarModelIndex={this.state.currentCarModelIndex}
          carDetailList={this.state.carDetailList}
        />
        {
          this.state.dataLoading ?
            <GlobalLoading/> : null
        }
      </div>
    )
  }
}

export default DirectSaleDetail
