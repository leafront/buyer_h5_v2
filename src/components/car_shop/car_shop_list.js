import React from 'react'
import { hashHistory } from 'react-router'
import $ from 'jquery'
import { GetGlobalConfig , GetUserLocation , GetLoginInfo , CheckLogin , ConvertObjectToQueryString , GetLocalStorageInfo , GetQueryStringByName } from '../../common'
import { CollectClickData } from '../../data_collection'

class CarShopList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // selectedShop:[],
      recommandListLength:3
    }
  }
  componentDidMount(){
    // console.log(this.props.carShopList)
    // let selectedShop = []
    // this.props.carShopList.forEach((item,i) => {
    //   selectedShop.push(i)
    // })
    // this.setState({
    //   selectedShop:selectedShop
    // })
  }
  unselectShop(index){
    let currentSelectedShop = this.props.selectedShop
    currentSelectedShop.splice(index,1)
    this.props.setSelectedShop(currentSelectedShop)
  }
  clickShopList(index,e){
    for(let i = 0; i < this.props.selectedShop.length; i++){
      if(this.props.selectedShop[i] === index){
        if(this.props.selectedShop.length > 1){
          this.unselectShop(i)
        }else{
          const AttetionMessage = '至少选一家4S店'
          this.props.showAttentionMessage(AttetionMessage)
        }
        return
      }
    }

    if(this.props.selectedShop.length < 3){
      const newSelectedShop = this.props.selectedShop.concat(index).sort(function(a,b){return a - b})
      CollectClickData({poicode:'MB61'})
      this.props.setSelectedShop(newSelectedShop)
    }else{
      const AttetionMessage = '最多只能选3家4S店'
      this.props.showAttentionMessage(AttetionMessage)
    }
  }
  setRecommandCarShopList(){
    let carShopListArray = []
    let carShopList

    this.props.carShopList.forEach((item,i) => {
      if(i >= this.state.recommandListLength) return

      const ActiveClass = " active "
      let signedIconIsActive = ""
      let carShopActive = ""

      if(item.fsIssign == 1){
        signedIconIsActive = ActiveClass
      }

      for( let value of this.props.selectedShop) {
        if(i === value){
          carShopActive = ActiveClass
        }
      }

      carShopListArray.push(
        <dd key={i} className={carShopActive} onClick={this.clickShopList.bind(this)}>
          <div className="preview_img fl">
            <img src={item.fsPic}/>
          </div>
          <div className="address_info fl">
            <h3>{item.fsAbbrname}</h3>
            <p className="address">{item.fsAddress}</p>
            <p className={"signed_icon" + signedIconIsActive}><span>品质</span><span className="blue_highlight">商家</span></p>
          </div>
          <div className="distance">
            {(item.distance / 1000).toFixed(2) + "km"}
          </div>
        </dd>
      )
    })
    carShopList = <dl>{carShopListArray}</dl>
    return carShopList
  }
  setCarShopList(){
    let recommandShopList = []

    this.props.carShopList.forEach((item,i) => {
      if(i === this.state.recommandListLength) {
        recommandShopList.push(
          <dt key={'dt_2'}>其他4S店</dt>
        )
      }

      const ActiveClass = " active "
      let signedIconIsActive = ""
      let carShopActive = ""

      if(item.fsIssign == 1){
        signedIconIsActive = ActiveClass
      }

      for( let value of this.props.selectedShop) {
        if(i === value){
          carShopActive = ActiveClass
        }
      }

      recommandShopList.push(
        <dd key={i} className={carShopActive} onClick={this.clickShopList.bind(this,i)}>
          <div className="preview_img fl">
            <img src={item.fsPic}/>
          </div>
          <div className="address_info fl">
            <h3 className="name">{item.fsAbbrname}</h3>
            <p className="address">{item.fsAddress}</p>
            <p className="icon_container">
              <strong className={"signed_icon " + signedIconIsActive}>
                <span>品质</span><span className="blue_highlight">商家</span>
              </strong>
              <em className="distance">{(item.distance / 1000).toFixed(2) + "km"}</em>
            </p>
          </div>
        </dd>
      )
    })

    return recommandShopList
  }
  // checkShopIsSelected(){//->Boolean
  //   let shopOptionIsSelected = true
  //   if(this.state.selectedShop.length === 0) {
  //     shopOptionIsSelected = false
  //   }
  //   return shopOptionIsSelected
  // }
  saveAllSelectedOptions(UserSelectedShopInfo){
    sessionStorage.USER_SELECTED_ALL_OPTIONS_INFO = JSON.stringify(UserSelectedShopInfo)
  }
  removeAllSelectedOptions(){
    sessionStorage.removeItem('USER_SELECTED_ALL_OPTIONS_INFO')
  }
  removeUserSelectedParityOptions(){
    sessionStorage.removeItem('USER_SELECTED_PARITY_OPTIONS')
  }
  transformSelectedShopData(){
    let shopNames = ""//"测试4S店2;一汽马自达成山路店;测试4S店3"
    let shopIds = ""//"13112540,15042295,13092226"
    this.props.selectedShop.forEach((item,i) => {
      shopNames += this.props.carShopList[item].fsAbbrname
      shopIds += this.props.carShopList[item].fsId
      if(i < this.props.selectedShop.length - 1) {
        shopNames += ";"
        shopIds += ","
      }
    })
    return {shopNames:shopNames,shopIds:shopIds}
  }
  async submitAskPrice(){
    const CurrentUserOptions = JSON.parse(sessionStorage.USER_SELECTED_PARITY_OPTIONS)

    const SelectedShopData = this.transformSelectedShopData()
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    //@todo refac
    const CurrentCity = CityCode == 310000 ? "上海市" : "杭州市"
    // console.log(CurrentUserOptions.seriesId)
    const AllSelectedData = {
      askpType:CurrentUserOptions.seriesId,
      askpModel:CurrentUserOptions.modelId,
      askpModelPrice:CurrentUserOptions.carPrice,
      askpTypeName:CurrentUserOptions.seriesName,
      askpModelName:CurrentUserOptions.modelName,
      askpOutColor:CurrentUserOptions.color,
      askpLoan:CurrentUserOptions.needLoan,
      askpReplace:CurrentUserOptions.needReplace,
      askpLicense:CurrentUserOptions.licenseArea,
      askpBuyTime:CurrentUserOptions.buyTime,
      askpLocation:'',
      askpFsname:SelectedShopData.shopNames,
      askpFs:SelectedShopData.shopIds,
      askpUserArea:CurrentUserOptions.districtText + ',' + CurrentUserOptions.areaText,
      sysType:GetGlobalConfig().platform,
      cityCode:CityCode
    }

    this.saveAllSelectedOptions(AllSelectedData)
    // this.removeAllSelectedOptions()

    const LoginState = CheckLogin()
    if(!LoginState) {

      CollectClickData({poicode:'MD07'})
      hashHistory.push('/login_and_reg/car_shop')

      return
    }

    this.props.showLoading()

    // const RequestData = ConvertObjectToQueryString(AllSelectedData)
    // console.log(RequestData)
    // const Response = await fetch(
    //   GetGlobalConfig().env + '/hybrid/ask/addAskPrice',
    //   {
    //     headers:{
    //       'Content-Type':'application/x-www-form-urlencoded',
    //       'access_token':GetLoginInfo().accessToken
    //     },
    //     body:RequestData,
    //     method:'POST'
    //   }
    // )
    // const ResponseOK = await Response.ok
    // const ResponseJSON = await Response.json()
    //
    const Response = await $.ajax({
      url:GetGlobalConfig().env + '/hybrid/ask/addAskPrice',
      headers:{
        access_token:GetLoginInfo().accessToken
      },
      data:AllSelectedData,
      method:'post',
      dataType:'json'
    })

    this.props.hideLoading()

    this.checkResponseStatus(Response)
  }
  confirmShop(e){
    CollectClickData({poicode:'MB62'})

    this.submitAskPrice()
  }
  checkResponseStatus(Response){
    switch (Response.status) {
      case 1:
        // this.removeSelectedShop()
        // this.removeUserSelectedParityOptions()
        this.removeAllSelectedOptions()
        this.removeUserSelectedParityOptions()

        hashHistory.push('/inquire/' + Response.data.respondTime)
        break
      case 2:
        this.props.showAttentionMessage(Response.msg)
        break
      case 101:
        //check login status
        // if(localStorage.HMC_REFRESH_TOKEN && JSON.parse(localStorage.HMC_REFRESH_TOKEN).refreshToken){
          //refresh token
        // }else{
        hashHistory.push('/loginAndReg/car_shop')
        // }
        break
      default:
    }
  }
  render(){
    const carShopList = this.setCarShopList()
    // console.log(this.props.selectedShop)
    // const recommandShopList = this.setRecommandCarShopList()

    // {recommandShopList}
    // <dl className="others">
    //   <dt>其他4S店</dt>
    //   {carShopList}
    // </dl>
    return (
      <div className="shop_list">
        <dl className="recommand">
          <dt>我们为您推荐了<b>3家</b>4S店（最多只能选3家）</dt>
          {carShopList}
        </dl>
        <div className="confirm">
          <button className="" onClick={this.confirmShop.bind(this)}>确定</button>
        </div>
      </div>
    )
  }
}

export default CarShopList
