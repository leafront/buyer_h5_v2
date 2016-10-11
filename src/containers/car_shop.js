import React,{ PropTypes } from 'react'
import { Link , hashHistory } from 'react-router'
import TopBar from '../components/common/top_bar'
import AttentionMessage from '../components/common/attention_message'
import PopupArea from '../components/car_shop/popup_area'
import CarShopList from '../components/car_shop/car_shop_list'
import SelectArea from '../components/car_shop/select_area'
import GlobalLoading from '../components/common/global_loading'
import 'whatwg-fetch'

import { GetGlobalConfig , GetUserLocation , ConvertObjectToQueryString , GetLocalStorageInfo , GetQueryStringByName } from '../common'

//@todo remove
// import { getShopAreaData } from '../data/area_data'

class CarShop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentDistrict:0,
      currentArea:0,
      carShopList:[],
      selectedShop:[],
      areaPopupVisibility:true,
      areaData:[],//getShopAreaData(),
      dataLoading:false,
      /* Attention Message setting */
      attetionMessage:{
        isAttentionMessageVisible:false,
        attentionMessageText:null
      }
      /* Attention Message setting */
    }


  }
  /* Attention Message method */
  async showAttentionMessage(message = null){
    if(this.state.attetionMessage.isAttentionMessageVisible){
      return false
    }
    this.setState({
      attetionMessage:{
        isAttentionMessageVisible: true,
        attentionMessageText: message
      }
    })
    await setTimeout(() => {
      this.setState({
        attetionMessage:{
          isAttentionMessageVisible: false,
          attentionMessageText: null
        }
      })
    },1500)
  }
  async getAreaDataByCityCode(){
    // console.log(this.state.areaData)
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    // const SeriesId = JSON.parse(sessionStorage.USER_SELECTED_PARITY_OPTIONS).seriesId
    // const Point = this.state.areaData.rows[this.state.currentDistrict].list[this.state.currentArea].point
    const RequestData = ConvertObjectToQueryString({
      // point:Point,
      // typeId:SeriesId,
      cityCode:CityCode
    })

    const Response = await fetch(
      GetGlobalConfig().env + '/hybrid/ask/getAreaInfo',
      {
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:RequestData,
        method:'POST'
      }
    )
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    if(ResponseOK && ResponseJSON.status === 1){
      this.setState({
        areaData : ResponseJSON.data
      })
      // console.log(ResponseJSON.data)
      // let selectedShop = []
      // let totalShopCounts = 3
      // if(ResponseJSON.data.list.length < totalShopCounts){
      //   totalShopCounts = ResponseJSON.data.list.length
      // }
      // for(let i = 0;i < totalShopCounts; i++){
      //   selectedShop.push(i)
      // }
      //
      // this.setState({
      //   carShopList:ResponseJSON.data.list,
      //   selectedShop:selectedShop
      // })
    }
  }
  /* Attention Message method */
  async getShopData(){
    if(this.state.areaData.length === 0) return false
    // console.log(sessionStorage.USER_SELECTED_PARITY_OPTIONS)
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const SeriesId = JSON.parse(sessionStorage.USER_SELECTED_PARITY_OPTIONS).seriesId
    // console.log(this.state.areaData[this.state.currentDistrict].areaList)
    // console.log(this.state.currentDistrict,this.state.currentArea)
    const Point = this.state.areaData[this.state.currentDistrict].areaList[this.state.currentArea].point
    const RequestData = ConvertObjectToQueryString({
      point:Point,
      typeId:SeriesId,
      cityCode:CityCode
    })

    const Response = await fetch(
      GetGlobalConfig().env + '/hybrid/ask/getFsListByArea',
      {
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:RequestData,
        method:'POST'
      }
    )
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    if(ResponseOK && ResponseJSON.status === 1){
      let selectedShop = []
      let totalShopCounts = 3
      if(ResponseJSON.data.list.length < totalShopCounts){
        totalShopCounts = ResponseJSON.data.list.length
      }
      for(let i = 0;i < totalShopCounts; i++){
        selectedShop.push(i)
      }

      this.setState({
        carShopList:ResponseJSON.data.list,
        selectedShop:selectedShop
      })
    }

    // const Response = await $.ajax({
    //   url:GetGlobalConfig().env + '/hybrid/ask/getFsListByArea',
    //   data:{
    //     point:Point,
    //     typeId:SeriesId
    //   },
    //   method:'post',
    //   dataType:'json'
    // })

    // if(Response && Response.status === 1){
    //   //@todo refa
    //   let selectedShop = []
    //   let totalShopCounts = 3
    //   if(Response.data.list.length < totalShopCounts){
    //     totalShopCounts = Response.data.list.length
    //   }
    //   for(let i = 0;i < totalShopCounts; i++){
    //     selectedShop.push(i)
    //   }
    //
    //   this.setState({
    //     carShopList:Response.data.list,
    //     selectedShop:selectedShop
    //   })
    // }
  }
  showPopupAreaOptions(){
    this.setState({
      areaPopupVisibility:true
    })
  }
  hidePopupAreaOptions(){
    this.setState({
      areaPopupVisibility:false
    })
  }
  // setTopAreaButtonsText(districtIndex,areaIndex){
  //   // this.state.areaData
  // }
  setDistrictIndex(districtIndex){
    this.setState({
      currentDistrict:districtIndex
    })
  }
  setAreaIndex(areaIndex){
    this.setState({
      currentArea:areaIndex
    })
  }

  async componentDidMount(){
    if(!this.checkUserParityOptionIsSet()){
      hashHistory.replace('/')
    }

    this.showLoading()

    await this.getAreaDataByCityCode()

    await this.getShopData()

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
  checkUserParityOptionIsSet(){
    return !!sessionStorage.USER_SELECTED_PARITY_OPTIONS
  }
  setSelectedShop(selectedShop){
    this.setState({
      selectedShop:selectedShop
    })
  }
  render(){
    let districtText = null
    let areaText = null
    if(this.state.areaData.length > 0){
      districtText = this.state.areaData[this.state.currentDistrict].name
      areaText = this.state.areaData[this.state.currentDistrict].areaList[this.state.currentArea].name
    }
    return (
      <div className="car_shop">
        <TopBar pageTitle="选择4S店"/>
        <SelectArea
          showPopupAreaOptions={this.showPopupAreaOptions.bind(this)}
          districtText={districtText}
          areaText={areaText}
        />
        <CarShopList
          carShopList={this.state.carShopList}
          showAttentionMessage={this.showAttentionMessage.bind(this)}
          selectedShop={this.state.selectedShop}
          setSelectedShop={this.setSelectedShop.bind(this)}
          showLoading={this.showLoading.bind(this)}
          hideLoading={this.hideLoading.bind(this)}
        />
        <PopupArea
          areaPopupVisibility={this.state.areaPopupVisibility}
          areaData={this.state.areaData}
          getShopData={this.getShopData.bind(this)}
          hidePopupAreaOptions={this.hidePopupAreaOptions.bind(this)}
          currentDistrict={this.state.currentDistrict}
          currentArea={this.state.currentArea}
          setDistrictIndex={this.setDistrictIndex.bind(this)}
          setAreaIndex={this.setAreaIndex.bind(this)}
          carShopList={this.state.carShopList}
        />
        <AttentionMessage attetionMessage={this.state.attetionMessage}/>
        {
          this.state.dataLoading ?
            <GlobalLoading/> : null
        }
      </div>
    )
  }
}
export default CarShop
