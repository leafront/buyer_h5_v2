import React from 'react'
import { Link } from 'react-router'
import TopBar from '../components/common/top_bar'
import 'whatwg-fetch'

import { GetGlobalConfig , GetLocalStorageInfo , ConvertObjectToQueryString } from '../common'
import { CollectClickData } from '../data_collection'

class TopSlogen extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <div className="top_slogen">
        <div className="sub_slogen fr">
          <p><b>安全</b> 4S店货源，享受质保三包</p>
        </div>
        <div className="main_slogen">
          <img height="20" src={require('../../images/inquire/top_main_slogen.png')}/>
        </div>
      </div>
    )
  }
}

class ServiceInfo extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    return (
      <div className="service_info">
        <div className="advisor_icon"></div>
        <div className="contact">
          {
            CityCode == '310000' ?
            <span className="phone_number">4008798779</span>
            :<span className="phone_number">4008881822</span>
          }
          
          <span className="weixin">uebuycar</span>
        </div>
        <div className="result">
          <p className="result_text_1">我们是客服小鱼，已收到您的询价单!</p>
          <p className="result_text_2">{this.props.timeToResponse} 您将收到报价</p>
        </div>
        <div className="other_links">
          {
            CityCode == '310000' ?
            <a href="tel:4008798779" className="make_call_btn" onClick={CollectClickData.bind(null,{poicode:'MB71'})}>联系购车顾问</a>
            :<a href="tel:4008881822" className="make_call_btn" onClick={CollectClickData.bind(null,{poicode:'MB71'})}>联系购车顾问</a>
          }
          
          <Link to="/my_inquire" className="go_sale_list_btn">查看比价单</Link>
        </div>
      </div>
    )
  }
}

//@do not remove
class RecommandCarList extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    let recommandCarList = []
    this.props.recommandCarList.forEach((item,i) => {
      recommandCarList.push(
        <li key={item.modelBrandName}>
          <Link to={"/car_model/" + item.modelType}>
            <div className="discount">{(item.dsrp / item.msrp * 10).toFixed(1)}折</div>
            <div className="car_img"><img src={item.modelPhoto}/></div>
            <div className="car_name">{item.modelBrandName} {item.modelTypeName}</div>
            <div className="price_info">
              <span className="discount_price">{(item.dsrp / 10000).toFixed(2)}万</span><span className="recommand_price">指导价{(item.msrp / 10000).toFixed(2)}万</span>
            </div>
          </Link>
        </li>
      )
    })
    return (
      <div className="recommand_car_list">
        <h2>其他人正在买</h2>
        <ul>{recommandCarList}</ul>
      </div>
    )
  }
}

class Inquire extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recommandCarList:[]
    }
  }
  async getRecommandList(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const RequestData = ConvertObjectToQueryString({
      cityCode:CityCode
    })
    const Response = await fetch(
      GetGlobalConfig().env + '/hybrid/ds/getEqualPriCars',
      {
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body: RequestData,
        method: 'POST'
      }
    )
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    if(ResponseOK && ResponseJSON.status === 1){
      this.setState({
        recommandCarList:ResponseJSON.data.list
      })
    }
  }
  componentDidMount(){
    this.getRecommandList()
  }
  render(){
    return (
      <div className="inquire">
        <TopBar pageTitle="询价成功"/>
        <TopSlogen/>
        <ServiceInfo timeToResponse={this.props.params.timeToResponse}/>
        <RecommandCarList recommandCarList={this.state.recommandCarList}/>
      </div>
    )
  }
}
export default Inquire
