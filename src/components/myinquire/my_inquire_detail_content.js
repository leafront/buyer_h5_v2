import React from 'react'
import { Link } from 'react-router'
import { CollectClickData } from '../../data_collection'
import { CallPhone , GetGlobalConfig , GetLoginInfo , ConvertObjectToQueryString , GetLocalStorageInfo} from '../../common'
import $ from 'jquery'

const PACK = {
  packSocure : ['停售', '有少量现车', '无现车', null, '有充足现车'],
  packTime : ['停售', '15-30个工作日', '30个工作日以上', null, '4-15个工作日内']
}

class MyInquireDetailContent extends React.Component {
  constructor() {
    super()
  }

  convertNum(num) {
    var list = new String(parseInt(num)).split('').reverse();
  	for(var i = 0; i < list.length; i++){
  		if(i % 4 == 3){
          list.splice(i, 0, ',');
  		}
  	}
  	return list.reverse().join('');
  }

  getStoreTitle() {
    let lists = this.props.lists
    //let inquireUrlLength=window.location.href.split("?")[0].length
    //let inquireUrl=window.location.href.split("?")[0].substring(inquireUrlLength-1,inquireUrlLength)
    let activeClass = ''
    let storeTitles = lists.map((store, index) => {
      if (this.props.current == index) {
        activeClass = 'current'
        return (<li className={activeClass} key={index} onClick={this.props.callback.bind(null, index)}>{store.fsAbbrname}</li>)
      }
      return (<li key={index} onClick={this.props.callback.bind(null, index)}>{store.fsAbbrname}</li>)
    })
    return (
      <div className="stores_title">
        <ul classme="js_car_nav">
          {storeTitles}
        </ul>
      </div>
    )
  }

  getStoreContent() {
    let item = this.props.item
    let lists = this.props.lists
    if (item && lists.length > 0) {
      let current = lists[this.props.current]
      return (
        <div className="car_list">
          <div className="ve_inform">
            <span className="ve_tit">
              <em style={{color:'red'}}>{item.carMap.askpRespTime} 报价将失效</em>
              <em>单号{item.carMap.askpCode}</em>
            </span>
            <div className="car_detail">
              <img src={item.carMap.tpicPath}/>
              <div className="favor">
                <span>{item.carMap.brandName} {item.carMap.askpTypeName} {item.carMap.askpModelname}</span>
                <span>4S店最高优惠：<i>{this.convertNum(current.sourcePrice)}元</i></span>
              </div>
            </div>
          </div>
          <ul>
            <li>优　　惠：
               <i>{this.convertNum(Number(current.sourcePrice) || 0)}元</i>
               {(current.fsIssign == 1) ?
                   <strong className="recommend">
                       <em>品质</em><em className="color">商家</em>
                   </strong> : ''
               }
            </li>
            <li>车　　源：<span>{PACK.packSocure[parseInt(current.sourceCategory, 10)]}</span></li>
            <li>提车时间：<span>{PACK.packTime[parseInt(current.sourceCategory, 10)]}</span></li>
            <li>服务费用：<span>{this.convertNum(Number(current.sourceService) || 0)}元</span></li>
            <li>牌　　照：<span>{current.licenseDesc}</span></li>
            { current.licensePrice >= 10000 ?
              <li>上牌费用：<span>{(current.licensePrice / 10000).toFixed(2)}万元</span></li> :
              <li>上牌费用：<span>{this.convertNum(Number(current.licensePrice) || 0)}元</span></li>
            }
            { current.sourceInsure >= 10000 ?
              <li>保　　险：<span>{(current.sourceInsure / 10000).toFixed(2)}万元</span></li> :
              <li>保　　险：<span>{this.convertNum(Number(current.sourceInsure) || 0)}元</span></li>
            }
            { current.sourceTax >= 10000 ?
              <li>购&nbsp;&nbsp;置&nbsp;税：<span>{(current.sourceTax / 10000).toFixed(2)}万元</span></li> :
              <li>购&nbsp;&nbsp;置&nbsp;税：<span>{this.convertNum(Number(current.sourceTax) || 0)}元</span></li>
            }
            { current.sourceBind ?
              <li>加装项目：<span>{current.sourceBind}</span></li> : ''
            }
            { current.sourceSum >= 10000 ?
              <li>总　　价：<span>{(current.sourceSum / 10000).toFixed(2)}万元</span> </li> :
              <li>总　　价：<span>{this.convertNum(Number(current.sourceSum) || 0)}元</span> </li>
            }
            { current.giftNames ?
              <li>赠　　送：<span className="give">{current.giftNames}</span></li> : ''
            }
            { current.descContent ?
              <li>备　　注：<span className="give">{current.descContent}</span></li> : ''
            }
         </ul>
        </div>
      )
    } else {
      return null
    }
  }

  async serviceButtonClicked(){
    this.props.showLoading()

    // const RequestData = ConvertObjectToQueryString({
    //   askpId: this.props.askpid,
    //   respondId: this.props.lists[0].respondId
    // })
    // console.log(RequestData)
    // const Response = await fetch(
    //   GetGlobalConfig().env + '/hybrid/user/getMorePriceInfo',
    //   {
    //     headers:{
    //       'Content-Type':'application/x-www-form-urlencoded',
    //       // 'access_token':GetLoginInfo().accessToken
    //     },
    //     body:RequestData,
    //     method:'POST'
    //   }
    // )
    // console.log(this.props.askpid)
    // console.log(this.props.lists[0].respondId)
    // const ResponseOK = await Response.ok
    // const ResponseJSON = await Response.json()

    const Response = await $.ajax({
      url:GetGlobalConfig().env + '/hybrid/user/getMorePriceInfo',
      headers:{
        access_token:GetLoginInfo().accessToken
      },
      data:{
        askpId: this.props.askpid,
        respondId: this.props.lists[this.props.current].respondId
      },
      method:'post',
      dataType:'json'
    })

    if(Response && Response.status === 1){
      this.props.showServiceMember()
    }


    this.props.hideLoading()

  }

  getContactUs() {
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    return (
      <div className="contact_us">
        <img src={require('../../../images/user_center/call_mm1.png')} className="img_call"/>
        <span></span>
        {
          CityCode == '310000' ?
          <a href="tel:4008798779" onClick={CollectClickData.bind(null, {poicode: 'MPB12'})}>联系客服</a>
          :<a href="tel:4008881822" onClick={CollectClickData.bind(null, {poicode: 'MPB12'})}>联系客服</a>
        }
        
        <em className="js_pay" onClick={this.serviceButtonClicked.bind(this)}>继续砍价</em>
      </div>
    )
  }

  render() {
    let storeTitles = this.getStoreTitle()
    let storeContents = this.getStoreContent()
    let contactUs = this.getContactUs()
    return (
      <div className="my_inquire_detail_content">
        {storeTitles}
        {storeContents}
        {contactUs}
      </div>
    )
  }
}

export default MyInquireDetailContent
