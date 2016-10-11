import React from 'react'
import {Link} from 'react-router'
import TopBar from '../components/common/top_bar'
import GlobalLoading from '../components/common/global_loading'

import { GetGlobalConfig , GetUserLocation , CheckUserLocationIsSet , GetLocalStorageInfo , ConvertObjectToQueryString , GetQueryStringByName } from '../common'
import { CollectClickData } from '../data_collection'

class BrandList extends React.Component {
  constructor() {
    super();

    this.state = {
      data:[],
      dataLoading:false
    }
  }
  async componentDidMount(){

    this.showLoading()

    await GetUserLocation()

    await this.getBrandList()

    this.hideLoading()
  }
  async getBrandList(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const RequestData = ConvertObjectToQueryString({
      cityCode:CityCode
    })

    const Response = await fetch(
      GetGlobalConfig().env + '/hybrid/ask/getBrandList',
      {
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:RequestData,
        method:'POST'
      }
    )
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    if(ResponseOK){
      await this.setState({
        data:ResponseJSON.data
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
  render(){
    let BrandList = []

    for(let i = 0; i < this.state.data.length; i++){
      let BrandListNodes = []
      BrandListNodes.push(<dt key={'first-letter-' + i}><h2>{this.state.data[i].spell}</h2></dt>)
      for(let j = 0; j < this.state.data[i].list.length; j++){
        BrandListNodes.push(
          <dd key={i + '-' + j}>
            <Link to={'/car_series/' + this.state.data[i].list[j].brandId} onClick={CollectClickData.bind(null,{pcode:'click',poicode:'MB21'})}>
              <img src={this.state.data[i].list[j].brandLogo}/><span>{this.state.data[i].list[j].brandName}</span>
              <p className="shop_count"><b>{this.state.data[i].list[j].fsCount}</b>家比价4S店</p>
            </Link>
          </dd>
        )
      }
      BrandList.push(<dl key={i}>{BrandListNodes}</dl>)
    }

    return (
      <div>
        <TopBar pageTitle='选择品牌'/>
        <div className='brand_list'>
          {BrandList}
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

export default BrandList
