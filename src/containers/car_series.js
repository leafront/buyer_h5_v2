import React,{ PropTypes } from 'react'
import { Link } from 'react-router'
import TopBar from '../components/common/top_bar'
import ImChatButton from '../components/common/im_chat_button'
import GlobalLoading from '../components/common/global_loading'
import 'whatwg-fetch'

import { GetGlobalConfig , GetUserLocation , GetLocalStorageInfo , ConvertObjectToQueryString , GetQueryStringByName } from '../common'
import { CollectClickData } from '../data_collection'

class CarSeriesList extends React.Component {
  constructor(props) {
    super(props)

  }
  componentDidMount(){

  }
  setCarTypeList(carTypeListData){
    let carTypeList = []
    for(let i = 0; i < carTypeListData.length; i++){
      let carTypeListNodes = []
      carTypeListNodes.push(<dt key={'first-letter-' + i}><h2>{carTypeListData[i].brandName}</h2></dt>)
      for(let j = 0; j < carTypeListData[i].typeList.length; j++){
        carTypeListNodes.push(
          <dd key={i + '-' + j}>
            <Link className="clearfix" to={'/car_model/' + carTypeListData[i].typeList[j].typeId} onClick={CollectClickData.bind(null,{poicode:'MB31'})}>
              <img src={carTypeListData[i].typeList[j].tpicPath}/>
              <div>
                <h3>{carTypeListData[i].typeList[j].typeName}</h3>
                <p className="price">指导价：<b>{(carTypeListData[i].typeList[j].typeMinPrice / 10000).toFixed(2)}万~{(carTypeListData[i].typeList[j].typeMaxPrice / 10000).toFixed(2)}万</b></p>
              </div>
            </Link>
          </dd>
        )
      }
      carTypeList.push(<dl key={i}>{carTypeListNodes}</dl>)
    }
    return carTypeList
  }
  render(){
    if(Object.keys(this.props.carSeriesList).length === 0) {
      return (
        null
      )
    }else{
      let carTypeList = this.setCarTypeList(this.props.carSeriesList.list)
      return(
        <div className="">
          <div className="brand">
            <Link to="/brand_list" className="close_button" onClick={CollectClickData.bind(null,{poicode:'MB32'})}>×</Link>
            <div className="brand_info">
              <img src={this.props.carSeriesList.brandMap.brandLogo}/><span>{this.props.carSeriesList.brandMap.brandName}</span>
            </div>
          </div>
          <div className="car_series_list">{carTypeList}</div>
        </div>
      )
    }
  }
}

class CarSeries extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentBrandId:props.params.brandId,
      carSeriesList:{},
      dataLoading:false
    }
  }
  async componentDidMount(){
    this.showLoading()

    await GetUserLocation()

    await this.getTypeList()

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
  async getTypeList(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const RequestData = ConvertObjectToQueryString({
      brandId:this.state.currentBrandId,
      cityCode:CityCode
    })

    const Response = await fetch(
      GetGlobalConfig().env + '/hybrid/ask/getTypeList',
      {
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:RequestData,
        method:'POST'
      }
    )
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()

    if(ResponseOK && ResponseJSON.data){
      this.setState({
        carSeriesList:ResponseJSON.data
      })
    }
  }
  render(){
    return (
      <div>
        <TopBar pageTitle="选择车型"/>
        <ImChatButton/>
        <div className="car_series">
          <CarSeriesList currentBrandId={this.state.currentBrandId} carSeriesList={this.state.carSeriesList}/>
        </div>
        {
          this.state.dataLoading ?
            <GlobalLoading/>
            : null
        }
      </div>
    )
  }
}

export default CarSeries
