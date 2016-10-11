import React from 'react'
import TopBar from '../components/common/top_bar'
import { ImChatButtonFour } from '../components/common/im_chat_button'
import { GetGlobalConfig , GetLocalStorageInfo , ConvertObjectToQueryString} from '../common'
import { Link } from 'react-router'

import { CollectClickData } from '../data_collection'

import '../style/direct_sale_inquire/main.scss'

class CustomerServiceFeedback extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    return (
      <div className="customerService">
        <img src={require('../../images/direct_sale_inquire/IM.png')}/>
        <p className="receive">我是客服顾问<span>小丫</span>，已收到您的购车意向单。</p>
        <p className="contact">将在30分钟内与您联系</p>
      </div>
    )
  }
}

class ContactService extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    let imChatBtn = ImChatButtonFour()
    return (
      <div className="contactService">
        <div className="onlineChat" onClick={CollectClickData.bind(null,{poicode:'MZ8X'})}>
          <img src={require('../../images/direct_sale_inquire/IM.jpg')}/>
          <p>{imChatBtn}</p>
        </div>
        <div className="phoneNumber" >
          <Link to="/my_order" onClick={CollectClickData.bind(null,{poicode:'MZ8X'})}><span>查看订单</span></Link>
        </div> 
      </div>
    )
  }
}


class SamePriceDirectSale extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      samePriceList:[]
    }
  }

  componentDidMount(){
    this.getDirectSaleCarDetail()
  }

   async getDirectSaleCarDetail(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const RequestData = ConvertObjectToQueryString({
      dsrp:this.props.dsrp,
      cityCode:CityCode,
      num:4
    })

    const Response = await fetch(GetGlobalConfig().env + '/hybrid/ds/getEqualPriCars',
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:RequestData,
      method: 'POST'
    })

    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    if(ResponseOK && ResponseJSON.status === 1){
      // console.log(ResponseJSON)

      this.setState({
        samePriceList:ResponseJSON.data.list
      })
      // console.log(this.state.samePriceList)
    }
  }

  render(){
    let samePrice = []
    this.state.samePriceList.forEach((item,index) => {
      samePrice.push(
        <Link to={'/direct_sale_detail/' + item.modelType + '/' + item.modelId}>
          <li onClick={CollectClickData.bind(null,{poicode:'MZ8Z'})}>
            <img src={item.modelPhoto}/>
            <div className="samePriceContent">
              <p className="carName"><span>{item.modelBrandName}</span><span>{item.modelTypeName}</span></p>
              <p className="carPrice"><span>{item.dsrp/10000}</span>万</p>
              <p className="guidePrice">￥<span>{item.msrp/10000}</span>万</p>
            </div>
          </li>
        </Link>
      )
    })
    return (
      <div className="samePrice">
        <p className="samePriceTitle">猜你喜欢</p>
        <ul>
          {samePrice}
        </ul>
      </div>
    )
  }
}


class DirectSaleInquire extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return (
      <div className="directSaleInquire">
        <TopBar pageTitle="提交意向单成功"/>
        <CustomerServiceFeedback/>
        <ContactService/>
        <SamePriceDirectSale dsrp={this.props.params.dsrp}/>
      </div>
    )
  }
}


export default DirectSaleInquire
