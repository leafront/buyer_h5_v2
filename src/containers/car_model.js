import React,{ PropTypes } from 'react'
import { Link } from 'react-router'
import TopBar from '../components/common/top_bar'
import ImChatButton from '../components/common/im_chat_button'
import GlobalLoading from '../components/common/global_loading'
import 'whatwg-fetch'

import { GetGlobalConfig , ConvertPriceToTenThousand , FormatNumberWithComma , GetUserLocation , GetLocalStorageInfo , ConvertObjectToQueryString , GetQueryStringByName } from '../common'
import { CollectClickData } from '../data_collection'

class HistoryPopup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      visibleContentIndex:0
    }
  }
  setCurrentTabVisibleIndex(index){
    this.setState({
      visibleContentIndex:index
    })

    switch(index){
      case 0:
        CollectClickData({poicode:'MB44'})
      break
      case 1:
        CollectClickData({poicode:'MB45'})
      break
      case 2:
        CollectClickData({poicode:'MB46'})
      break
    }
  }
  setHistoryTabs(){//-> {tabButtons:[],contentBoxs:String}
    const tabNames = ['4S店1','4S店2','4S店3']
    let tabButtons = []
    let contentBoxs = null

    let tabHighlightClass = ""

    this.props.historyData.forEach((item,i) => {
      if(this.state.visibleContentIndex === i){
        tabHighlightClass = " active "

        contentBoxs = (
            <table>
              <thead>
                <tr>
                  <th colSpan="2">
                    <div className="fl emp_pic"><img height="60" src={item.empPic}/></div>
                    <div className="fl emp_desc">
                      <p className="shop_name">{item.fsAbbrname}</p>
                      <p className="emp_name">{item.empName}</p>
                      <p className="emp_job">{item.empPost}</p>
                    </div>
                  </th>
                </tr>
                <tr className="price_preview">
                  <th width="60">
                    <p>现金优惠</p>
                    <p><b>{FormatNumberWithComma(item.sourcePrice) + '元'}</b></p>
                  </th>
                  <th>
                    <p>到手总价</p>
                    <p><b>{FormatNumberWithComma(item.sourceSum) + '元'}</b></p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td width="50%">指导价</td>
                  <td className="recommend_price">{ConvertPriceToTenThousand(item.showModelPrice) + '万元'}</td>
                </tr>
                <tr>
                  <td width="50%">现金优惠</td>
                  <td>{FormatNumberWithComma(item.sourcePrice) + '元'}</td>
                </tr>
                <tr>
                  <td width="50%">车源</td>
                  <td>{item.sourceCategory}</td>
                </tr>
                <tr>
                  <td width="50%">提车时间</td>
                  <td>{item.sourceDesc.replace(/个工作/,"")}</td>
                </tr>
                <tr>
                  <td width="50%">综合服务费</td>
                  <td>{FormatNumberWithComma(item.sourceService) + '元'}</td>
                </tr>
                <tr>
                  <td width="50%">牌照</td>
                  <td>{item.licenseDesc}</td>
                </tr>
                <tr>
                  <td width="50%">上牌费用</td>
                  <td>{item.licensePrice + '元'}</td>
                </tr>
                <tr>
                  <td width="50%">保险费用</td>
                  <td>{item.sourceInsure + '元'}</td>
                </tr>
                <tr>
                  <td width="50%">购置税</td>
                  <td>{FormatNumberWithComma(item.sourceTax) + '元'}</td>
                </tr>
                <tr>
                  <td width="50%">到手总价</td>
                  <td className="total_price"><b>{FormatNumberWithComma(item.sourceSum) + '元'}</b></td>
                </tr>
                <tr>
                  <td className="create_time" colSpan="2">{'报价时间 ' + new Date(item.respondTime).getFullYear() + '年' + (new Date(item.respondTime).getMonth() + 1) + '月' + new Date(item.respondTime).getDate() + '日'}</td>
                </tr>
              </tbody>
            </table>
        )
      }
      tabButtons.push(
        <li className={tabHighlightClass} onClick={this.setCurrentTabVisibleIndex.bind(this,i)}>{tabNames[i]}</li>
      )
      tabHighlightClass = ""
    })


    return {tabButtons:tabButtons,contentBoxs:contentBoxs}
  }
  render(){
    // console.log(this.props.historyData)
    let historyPopupComponent = null
    if(this.props.hisitoryPopupVisibility){
      const HistoryTabsComponent = this.setHistoryTabs()
      // console.log(HistoryTabsComponent)
      historyPopupComponent = (
        <div className="history_popup">
          <button className="close_button" onClick={this.props.hideHistoryPupup}></button>
          <div className="tab_box">
            <ul className="tab_switch">
              {HistoryTabsComponent.tabButtons}
            </ul>
            <div className="tab_content">
              {HistoryTabsComponent.contentBoxs}
            </div>
          </div>
        </div>
      )
    }
    return historyPopupComponent
  }
}

class CarModelList extends React.Component {
  constructor(props) {
    super(props)

  }
  setCarModelList(carModelListData){
    let carModelList = []
    let carModelListNodes = []
    for(let i = 0; i < carModelListData.length; i++){
      let carModelListGroupIndex = 0;
      let carDisp = Number(carModelListData[i].modelDisp).toFixed(1)
      if(isNaN(carDisp)){
        carDisp = carModelListData[i].modelDisp
      }

      if(i === 0){
        carModelListNodes.push(<dt key={'first-letter-' + i}><h2>排量：{carDisp}</h2></dt>)
      }else{
        let lastItemDisp = carModelListData[i - 1].modelDisp
        let currentItemDisp = carModelListData[i].modelDisp

        if(lastItemDisp !== currentItemDisp){
          carModelListGroupIndex++;
          carModelListNodes = []
          carModelListNodes.push(<dt key={'first-letter-' + i}><h2>排量：{carDisp}</h2></dt>)
        }
      }

      carModelListNodes.push(
        <dd key={carModelListGroupIndex + '-' + i}  onClick={CollectClickData.bind(null,{poicode:'MB48'})}>
          <Link className="clearfix" to={'/car_parity/' + this.props.currentSeriesId + '/' + carModelListData[i].modelId}>
            <div className="detail">
              <h3>{carModelListData[i].modelName}</h3>
              <p>{carModelListData[i].modelDrive} {carModelListData[i].modelGearbox}</p>
            </div>
            <div className="price">
              <p><b>{(carModelListData[i].modelPrice / 10000).toFixed(2)}万 &gt;</b></p>
            </div>
          </Link>
        </dd>
      )

      if(i === 0){
        carModelList.push(<dl key={i} className="car_model_list">{carModelListNodes}</dl>)
      }else{
        let lastItemDisp = carModelListData[i - 1].modelDisp
        let currentItemDisp = carModelListData[i].modelDisp
        if(lastItemDisp !== currentItemDisp){
          carModelList.push(<dl key={i} className="car_model_list">{carModelListNodes}</dl>)
        }
      }
    }
    return carModelList
  }
  render(){
    if(Object.keys(this.props.data).length === 0) {
      return null
    }else{
      let carTypeList = this.setCarModelList(this.props.data.rows)

      let showHistoryButton = null

      // console.log(this.props.data)
      if(this.props.data.historyAskList){
        showHistoryButton = (
          <div className="show_history_btn">
            <button onClick={this.props.showHistoryPupup}>查看历史比价案例</button>
          </div>
        )
      }

      return(
        <div className="">
          <div className="series">
            <div className="series_info clearfix">
              <div className="series_img fl">
                <img height="100%" src={this.props.data.add.picPath}/>
              </div>
              <div className="series_desc fl">
                <p>{this.props.data.add.carBrand} {this.props.data.add.typeName}</p>
                <p className="price">指导价：<b>{(this.props.data.add.minPrice / 10000).toFixed(2)}万 ~ {(this.props.data.add.maxPrice / 10000).toFixed(2)}万</b></p>
              </div>
            </div>
            <div className="extra_info">
              <ul>
                <li>
                  <p className="count">{this.props.data.add.askCount + '人'}</p>
                  <p className="desc">正在比价</p></li>
                <li>
                  <p className="count">{this.props.data.add.fsCount + '家'}</p>
                  <p className="desc">认证4S店</p>
                </li>
                <li>
                  <p className="count">{this.props.data.add.fsEmptyCount + '名'}</p>
                  <p className="desc">专属销售员</p>
                </li>
              </ul>
            </div>
            {showHistoryButton}
          </div>
          {carTypeList}
        </div>
      )
    }
  }
}

class CarModel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentSeriesId:props.params.seriesId,
      carModelList:{},
      historyData:[],
      dataLoading:false,
      hisitoryPopupVisibility:false
    }
  }
  async componentDidMount(){
    this.showLoading()

    await GetUserLocation()

    await this.getModelList()

    this.hideLoading()

  }
  async getModelList(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const RequestData = ConvertObjectToQueryString({
      typeId:this.state.currentSeriesId,
      cityCode:CityCode
    })

    const Response = await fetch(
      GetGlobalConfig().env + '/hybrid/ask/getModelList',
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
        carModelList:ResponseJSON.data,
        historyData:ResponseJSON.data.historyAskList
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
  showHistoryPupup(){
    this.setState({
      hisitoryPopupVisibility:true
    })

    CollectClickData({poicode:'MB41'})
  }
  hideHistoryPupup(){
    this.setState({
      hisitoryPopupVisibility:false
    })

    CollectClickData({poicode:'MB43'})
  }
  render(){
    return (
      <div className="car_model">
        <TopBar pageTitle="选择款型"/>
        <ImChatButton/>
        <CarModelList
          data={this.state.carModelList}
          currentSeriesId={this.state.currentSeriesId}
          showHistoryPupup={this.showHistoryPupup.bind(this)}
        />
        <HistoryPopup
          hisitoryPopupVisibility={this.state.hisitoryPopupVisibility}
          historyData={this.state.historyData}
          hideHistoryPupup={this.hideHistoryPupup.bind(this)}
        />
        {
          this.state.dataLoading ?
            <GlobalLoading/> : null
        }
      </div>
    )
  }
}
export default CarModel
