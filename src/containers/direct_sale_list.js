import React from 'react'
import { Link } from 'react-router'
import TopBar from '../components/common/top_bar'
import GlobalLoading from '../components/common/global_loading'
import { GetLocalStorageInfo , ConvertObjectToQueryString , GetGlobalConfig , CalculateDiscount , ConvertPriceToLargerNumber , ConvertPriceToTenThousand } from '../common'
import 'whatwg-fetch'

import { CollectClickData } from '../data_collection'

import '../style/index/hot_brand_list.scss'

class BrandOptionItem extends React.Component {
  constructor(props){
    super(props)
  }
  onSetBrandOptionFilterClick(){
    this.props.setBrandOptionFilter(this.props.brandInfo.brandId)
    CollectClickData({poicode:'MZ22'})
  }
  render(){
    return (
      <li onClick={this.onSetBrandOptionFilterClick.bind(this)}>
        <div className="brand_img">
          <img src={this.props.brandInfo.brandLogo}/>
        </div>
        <div className="brand_name">
          <p>{this.props.brandInfo.bn}</p>
        </div>
        <div className="min_discount">{(this.props.brandInfo.dz * 10).toFixed(1)}折起</div>
      </li>
    )
  }
}

class BrandOptionList extends React.Component {
  constructor(props){
    super(props)
  }
  setBrandOptionList(){
    let brandItemList = []
    /* --special-- all brand option button */
    brandItemList.push(
      <li onClick={this.props.setBrandOptionFilter.bind(this,'')}>
        <div className="brand_img">
          <img width="20" src={require('../../images/direct_sale_list/brand_all_car.jpg')}/>
        </div>
        <div className="brand_name">
          <p>全部品牌</p>
        </div>
      </li>
    )
    this.props.carBrandOptionList.forEach((item,index) => {
      brandItemList.push(
        <BrandOptionItem brandInfo={item} setBrandOptionFilter={this.props.setBrandOptionFilter}/>
      )
    })
    return brandItemList
  }
  render(){
    const brandOptionList = this.setBrandOptionList()
    return (
      <div className="brand_option_list">
        <div className="brand_option_mask">
          <ul>
            {brandOptionList}
          </ul>
        </div>
      </div>
    )
  }
}

class CarTypeOptionItem extends React.Component {
  constructor(props) {
    super(props)
  }
  onSetCarTypeOptionFilterClick(){
    this.props.setCarTypeOptionFilter(this.props.carTypeInfo.categoryName)
    CollectClickData({poicode:'MZ24'})
  }
  setTypeListEnumText(categoryName){//(String)->String
    let categoryNameLowerCase = categoryName.toLocaleLowerCase()
    const CategoryList = {
      all:'全部类型',
      sedan:'轿车',
      suv:'SUV',
      mpv:'MPV',
      sport:'跑车'
    }
    return CategoryList[categoryNameLowerCase]
  }
  render(){
    const CarTypeName = this.setTypeListEnumText(this.props.carTypeInfo.categoryName)
    return (
      <li onClick={this.onSetCarTypeOptionFilterClick.bind(this)}>
        <div className={"car_type_img " + this.props.carTypeInfo.categoryName.toLocaleLowerCase()}></div>
        <div className="car_type_name">
          <p>{CarTypeName}</p>
        </div>
        <div className="car_type_count"><b>{this.props.carTypeInfo.count}</b> 辆直销精品车</div>
      </li>
    )
  }
}

class CarTypeOptionList extends React.Component {
  constructor(props) {
    super(props)
  }
  setCarTypeOptionList(){
    let carTypeOptionList = []
    this.props.carTypeOptionList.forEach((item,index) => {
      carTypeOptionList.push(
        <CarTypeOptionItem carTypeInfo={item} setCarTypeOptionFilter={this.props.setCarTypeOptionFilter}/>
      )
    })
    return carTypeOptionList
  }
  render(){
    const carTypeOptionList = this.setCarTypeOptionList()
    return (
      <div className="car_type_option_list">
        <div className="car_type_option_mask">
          <ul>
            {carTypeOptionList}
          </ul>
        </div>
      </div>
    )
  }
}

class PriceRangeOptionItem extends React.Component {
  constructor(props) {
    super(props)
  }
  onSetPriceRangeOptionFilterClick(){
    this.props.setPriceRangeOptionFilter(this.props.tagIndex)
    CollectClickData({poicode:this.props.priceRangeInfo.clickDataCode})
  }
  render(){
    return (
      <li
        className={this.props.currentPriceRangeOptionIndex === this.props.tagIndex ? 'active' : ''}
        onClick={this.onSetPriceRangeOptionFilterClick.bind(this)}
      >
        {this.props.priceRangeInfo.optionName}

      </li>
    )
  }
}

class PriceRangeOptionList extends React.Component {
  constructor(props) {
    super(props)

    this.priceRangeOptionList = [
      {optionName:'不限',clickDataCode:'MZ27'},
      {optionName:'0-10万',clickDataCode:'MZ2A'},
      {optionName:'10-20万',clickDataCode:'MZ2B'},
      {optionName:'20-30万',clickDataCode:'MZ2C'},
      {optionName:'30-50万',clickDataCode:'MZ2D'},
      {optionName:'50万以上',clickDataCode:'MZ2E'}
    ]
  }
  setPriceRangeOptionList(){
    let priceRangeOptionList = []
    this.priceRangeOptionList.forEach((item,index) => {
      priceRangeOptionList.push(
        <PriceRangeOptionItem priceRangeInfo={item} tagIndex={index} setPriceRangeOptionFilter={this.props.setPriceRangeOptionFilter} currentPriceRangeOptionIndex={this.props.currentPriceRangeOptionIndex}/>
      )
    })
    return priceRangeOptionList
  }
  render(){
    const priceRangeOptionList = this.setPriceRangeOptionList()
    return (
      <div className="price_range_option_list">
        <div className="price_range_option_mask">
          <ul>
            {priceRangeOptionList}
          </ul>
        </div>
      </div>
    )
  }
}

class SaleListFilter extends React.Component {
  constructor(props){
    super(props)
  }
  onBrandButtonClick(){
    this.props.switchBrandOptionList()
    CollectClickData({poicode:'MZ21'})
  }
  onTypeButtonClick(){
    this.props.switchTypeOptionList()
    CollectClickData({poicode:'MZ23'})
  }
  onPriceRangeButtonClick(){
    this.props.swtichPriceRange()
    CollectClickData({poicode:'MZ25'})
  }
  onPriceButtonClick(){
    this.props.switchPriceOrder()
    CollectClickData({poicode:'MZ26'})
  }
  render(){
    let priceButtonStateClass = [
      'high_to_low',
      'low_to_high'
    ]
    if(this.props.priceOrder === null){
      priceButtonStateClass = ''
    }else {
      priceButtonStateClass = priceButtonStateClass[this.props.priceOrder]
    }
    return (
      <div className="sale_list_filter">
        <div className="tab_buttons">
          <button className={"brand_button " + (this.props.isBrandFilterSet ? 'active' : '')} onClick={this.onBrandButtonClick.bind(this)}>品牌</button>
          <button className={"type_button " + (this.props.isCarTypeFilterSet ? 'active' : '')} onClick={this.onTypeButtonClick.bind(this)}>类型</button>
          <button className={"price_range_button " + (this.props.isPriceRangeFilterSet ? 'active' : '')} onClick={this.onPriceRangeButtonClick.bind(this)}>预算</button>
          <button className={"price_button " + priceButtonStateClass} onClick={this.onPriceButtonClick.bind(this)}>价格</button>
        </div>
        {
          this.props.isBrandOptionListVisible ?
          <BrandOptionList
            carBrandOptionList={this.props.carBrandOptionList}
            setBrandOptionFilter={this.props.setBrandOptionFilter}
          /> : null
        }
        {
          this.props.isCarTypeOptionListVisible ?
          <CarTypeOptionList
            carTypeOptionList={this.props.carTypeOptionList}
            setCarTypeOptionFilter={this.props.setCarTypeOptionFilter}
          /> : null
        }
        {
          this.props.isPriceRangeOptionListVisible ?
          <PriceRangeOptionList
            setPriceRangeOptionFilter={this.props.setPriceRangeOptionFilter}
            currentPriceRangeOptionIndex={this.props.currentPriceRangeOptionIndex}
          /> : null
        }
      </div>
    )
  }
}

class CarTagList extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    let tagList = []
    this.props.tagListData.forEach((item,value) => {
      tagList.push(
        <li>{item}</li>
      )
    })
    return (
      <ul className="tag_list">
        {tagList}
      </ul>
    )
  }
}

class CarInfo extends React.Component {
  constructor(props){
    super(props)
  }


  render(){
    let tagListDataArray = []
    let tagListData = this.props.data.tagList
    if(tagListData !== null){
      tagListDataArray = tagListData.split('#')
    }
    const tagList = (
      <CarTagList tagListData={tagListDataArray}/>
    )

    return (
      <Link className="" to={'/direct_sale_detail/' + this.props.data.modelType + '/' + this.props.data.modelId} onClick={CollectClickData.bind(null,{poicode:'MZ2Z'})}>
        <h3 className="discount">{CalculateDiscount(this.props.data.dsrp,this.props.data.msrp) + '折'}</h3>
        <div className="direct_car_info clearfix">
          <div className="car_img">
            <img src={this.props.data.modelPhoto}/>
          </div>
          <div className="car_text">
            <h2>{this.props.data.modelBrandName + ' ' + this.props.data.modelTypeName}</h2>
            <p>{this.props.data.modelName}</p>
            <div>
              {tagList}
            </div>
            <div>
              <span className="guidePrice">¥ {ConvertPriceToLargerNumber(this.props.data.msrp).toFixed(2)}万</span>
              <span className="givePrice"><em>{ConvertPriceToLargerNumber(this.props.data.dsrp).toFixed(2)}</em>万</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }
}

class DirectSaleList extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      carList:[],
      carBrandOptionList:[],
      carTypeOptionList:[],
      isBrandFilterSet:false,
      isCarTypeFilterSet:false,
      isPriceRangeFilterSet:false,
      priceOrder:null,//highToLow:0,lowToHigh:1
      currentBrandId:null,//brandId:String
      currentCarType:'',//carType:String
      currentPriceRangeOptionIndex:0,
      currentListPage:0,
      modelMinPrice:0,
      modelMaxPrice:-1,
      isBrandOptionListVisible:false,
      isCarTypeOptionListVisible:false,
      isPriceRangeOptionListVisible:false,
      isMoreDataAvailable:true,
      totalDataLength:null,
      dataLoading:false
    }

  }
  async componentDidMount(){
    this.showLoading()

    this.bindScrollEvent()

    await this.getCategoryAndNums()

    // await this.getFiltedOptionListData()

    await this.getDefaultCarListData()

    this.hideLoading()
  }
  componentWillUnmount(){
    // console.log(111)
    this.removeScrollEvent()
    // this.bindScrollEvent(true)
    // window.removeEventListener('scroll',this.scrollToGetMoreData.bind(this),false)
  }
  addPageCounter(){
    let currentListPage = this.state.currentListPage
    this.setState({
      currentListPage:currentListPage + 1
    })
  }
  resetPageCounter(){
    this.setState({
      currentListPage:0
    })
  }
  removeScrollEvent(){
    window.onscroll = null
  }
  bindScrollEvent(){
    window.onscroll = async function(){
      let visibleHeight = window.screen.availHeight
      let scrollTop = document.body.scrollTop
      let offsetHeight = document.body.offsetHeight
      let offsetDistanceToMove = 50
      // console.log(visibleHeight + scrollTop > offsetHeight - offsetDistanceToMove , this.state.totalDataLength , this.state.carList.length)
      if(visibleHeight + scrollTop > offsetHeight - offsetDistanceToMove && this.state.totalDataLength > this.state.carList.length){
        // console.log(this.state.dataLoading)
        if(!this.state.dataLoading){
          this.showLoading()

          this.addPageCounter()

          await this.getFiltedOptionListData()

          this.hideLoading()
        }
      }
    }.bind(this)
    // window.onscroll = function()""
    // }else{
      // setTimeout(function(){
      //   window.removeEventListener('scroll',scrollToGetMoreData,false)
      // },1000)

    // }

    // let totalDataLength = this.state.totalDataLength
    // let carList = this.state.carList
    // let dataLoading = this.state.dataLoading
    // async function scrollToGetMoreData(){
    //   let visibleHeight = window.screen.availHeight
    //   let scrollTop = document.body.scrollTop
    //   let offsetHeight = document.body.offsetHeight
    //   let offsetDistanceToMove = 50
    //   // console.log(visibleHeight + scrollTop > offsetHeight - offsetDistanceToMove , this.state.totalDataLength , this.state.carList.length)
    //   if(visibleHeight + scrollTop > offsetHeight - offsetDistanceToMove && totalDataLength > carList.length){
    //     // console.log(this.state.dataLoading)
    //     if(!dataLoading){
    //       // this.showLoading()
    //       //
    //       // this.addPageCounter()
    //       //
    //       // await this.getFiltedOptionListData()
    //       //
    //       // this.hideLoading()
    //     }
    //   }
    // }

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
  showBrandOptionList(){
    this.setState({
      isBrandOptionListVisible:true
    })
  }
  hidePriceRangeOptionList(){
    this.setState({
      isPriceRangeOptionListVisible:false
    })
  }
  hideBrandOptionList(){
    this.setState({
      isBrandOptionListVisible:false
    })
  }
  hideCarTypeOptionList(){
    this.setState({
      isCarTypeOptionListVisible:false
    })
  }
  async getDefaultCarListData(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    // const RequestData = ConvertObjectToQueryString({
    //   method:'getIndexDsCarList',
    //   cityCode:CityCode
    // })

    // const Response = await fetch(
    //   GetGlobalConfig().env + '/hybrid/ds/getIndexDsCarList',
    //   {
    //     headers:{'Content-Type':'application/x-www-form-urlencoded'},
    //     body:RequestData,
    //     method:'POST'
    //   }
    // )
    await this.setState({
      modelMinPrice:100000,
      modelMaxPrice:200000,
      currentPriceRangeOptionIndex:2,
      isPriceRangeFilterSet:true,
      currentListPage:0,
      priceOrder:0
    })

    const RequestData = ConvertObjectToQueryString({
      modelBrandId:this.state.currentBrandId || '',
      modelTypeId:this.state.currentCarType,
      modelMinPrice:this.state.modelMinPrice,
      modelMaxPrice:this.state.modelMaxPrice,
      desc_type:this.state.priceOrder,
      page:this.state.currentListPage + 1,
      rows:10,
      cityCode:CityCode
    })

    const Response = await fetch(
      GetGlobalConfig().env + '/hybrid/ds/searchDsCarList',
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
        carList:ResponseJSON.data.list,
        totalDataLength:ResponseJSON.data.sum
      })
    }
  }
  resetCarList(){
    this.setState({
      carList:[]
    })
  }
  async getFiltedOptionListData(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const RequestData = ConvertObjectToQueryString({
      modelBrandId:this.state.currentBrandId || '',
      modelTypeId:this.state.currentCarType,
      modelMinPrice:this.state.modelMinPrice,
      modelMaxPrice:this.state.modelMaxPrice,
      desc_type:this.state.priceOrder,
      page:this.state.currentListPage + 1,
      rows:10,
      cityCode:CityCode
    })

    const Response = await fetch(
      GetGlobalConfig().env + '/hybrid/ds/searchDsCarList',
      {
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:RequestData,
        method:'POST'
      }
    )
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    if(ResponseOK && ResponseJSON.status === 1){
      let carList
      if(this.state.currentListPage === 0){
        carList = ResponseJSON.data.list
      }else{
        carList = this.state.carList.concat(ResponseJSON.data.list)
      }
      this.setState({
        carList:carList,
        totalDataLength:ResponseJSON.data.sum
      })
    }
  }
  // async getCarTypeOptionListData(){
  //   const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
  //   const RequestData = ConvertObjectToQueryString({
  //     modelBrandId:'',
  //     modelTypeId:this.state.currentCarType,
  //     modelMinPrice:this.state.modelMinPrice,
  //     modelMaxPrice:this.state.modelMaxPrice,
  //     desc_type:0,
  //     page:this.state.currentListPage + 1,
  //     rows:10
  //   })
  //
  //   const Response = await fetch(
  //     GetGlobalConfig().env + '/hybrid/ds/searchDsCarList',
  //     {
  //       headers:{'Content-Type':'application/x-www-form-urlencoded'},
  //       body:RequestData,
  //       method:'POST'
  //     }
  //   )
  //   const ResponseOK = await Response.ok
  //   const ResponseJSON = await Response.json()
  //   if(ResponseOK && ResponseJSON.status === 1){
  //     this.setState({
  //       carList:ResponseJSON.data.list
  //     })
  //   }
  // }
  // async getCarListBrandOptionListData(){
  //   const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
  //   const RequestData = ConvertObjectToQueryString({
  //     modelBrandId:this.state.currentBrandId,
  //     modelTypeId:'',
  //     modelMinPrice:this.state.modelMinPrice,
  //     modelMaxPrice:this.state.modelMaxPrice,
  //     desc_type:0,
  //     page:this.state.currentListPage + 1,
  //     rows:10
  //   })
  //
  //   const Response = await fetch(
  //     GetGlobalConfig().env + '/hybrid/ds/searchDsCarList',
  //     {
  //       headers:{'Content-Type':'application/x-www-form-urlencoded'},
  //       body:RequestData,
  //       method:'POST'
  //     }
  //   )
  //   const ResponseOK = await Response.ok
  //   const ResponseJSON = await Response.json()
  //   if(ResponseOK && ResponseJSON.status === 1){
  //     this.setState({
  //       carList:ResponseJSON.data.list
  //     })
  //   }
  // }
  async getCategoryAndNums(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const RequestData = ConvertObjectToQueryString({
      method:'getCategoryAndNums',
      cityCode:CityCode
    })

    const Response = await fetch(
      GetGlobalConfig().env + '/hybrid/ds/getCategoryAndNums',
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
        carBrandOptionList:ResponseJSON.data.listMapDsBrandAndLowZK,
        carTypeOptionList:ResponseJSON.data.listMapDsCategoryAndNums
      })
    }
  }
  // async getCarListDataByPriceOrder(priceOrderMode){//priceOrderMode:Number  // 0:from high to low ; 1:from low to high
  //   const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
  //   const RequestData = ConvertObjectToQueryString({
  //     modelBrandId:'',
  //     modelTypeId:'',
  //     modelMinPrice:this.state.modelMinPrice,
  //     modelMaxPrice:this.state.modelMaxPrice,
  //     desc_type:priceOrderMode,
  //     page:this.state.currentListPage + 1,
  //     rows:10
  //   })
  //
  //   const Response = await fetch(
  //     GetGlobalConfig().env + '/hybrid/ds/searchDsCarList',
  //     {
  //       headers:{'Content-Type':'application/x-www-form-urlencoded'},
  //       body:RequestData,
  //       method:'POST'
  //     }
  //   )
  //   const ResponseOK = await Response.ok
  //   const ResponseJSON = await Response.json()
  //   if(ResponseOK && ResponseJSON.status === 1){
  //     this.setState({
  //       carList:ResponseJSON.data.list
  //     })
  //   }
  // }
  // async getCarPriceRangeListData(){
  //   const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
  //   const RequestData = ConvertObjectToQueryString({
  //     modelBrandId:'',
  //     modelTypeId:'',
  //     modelMinPrice:this.state.modelMinPrice,
  //     modelMaxPrice:this.state.modelMaxPrice,
  //     desc_type:this.state.priceOrder,
  //     page:this.state.currentListPage + 1,
  //     rows:10
  //   })
  //
  //   const Response = await fetch(
  //     GetGlobalConfig().env + '/hybrid/ds/searchDsCarList',
  //     {
  //       headers:{'Content-Type':'application/x-www-form-urlencoded'},
  //       body:RequestData,
  //       method:'POST'
  //     }
  //   )
  //   const ResponseOK = await Response.ok
  //   const ResponseJSON = await Response.json()
  //   if(ResponseOK && ResponseJSON.status === 1){
  //     this.setState({
  //       carList:ResponseJSON.data.list
  //     })
  //   }
  // }
  // resetOrderOfCurrentIndexType(){
  //   this.setState({
  //     currentIndexType:this.state.currentIndexType.sort((a,b) => {return a - b})
  //   })
  // }
  // addCurrentFilterOption(filterType){//filterType:Number
  //   for(let value of this.state.currentIndexType){
  //     if(value === filterType){
  //       return
  //     }
  //   }
  //   let currentIndexType = this.state.currentIndexType
  //   currentIndexType.push(filterType)
  //   this.setState({
  //     currentIndexType:currentIndexType
  //   })
  // }
  async setBrandOptionFilter(brandId = ''){

    this.resetAllOptionFilter()

    await this.setState({
      currentBrandId:brandId,
      currentListPage:0
    })

    this.showLoading()

    await this.getFiltedOptionListData()

    if(brandId != ''){
      this.setState({
        isBrandFilterSet:true
      })
    }else{
      this.setState({
        isBrandFilterSet:false
      })
    }

    this.hideBrandOptionList()

    this.hideLoading()
  }
  async setPriceRangeOptionFilter(rangeOptionIndex = 0){

    this.resetAllOptionFilter()

    const PriceRangeArray = [
      [0,-1],
      [0,100000],
      [100000,200000],
      [200000,300000],
      [300000,500000],
      [500000,-1]
    ]
    await this.setState({
      modelMinPrice:PriceRangeArray[rangeOptionIndex][0],
      modelMaxPrice:PriceRangeArray[rangeOptionIndex][1],
      currentPriceRangeOptionIndex:rangeOptionIndex,
      isPriceRangeFilterSet:rangeOptionIndex === 0 ? false : true,
      currentListPage:0
    })

    this.showLoading()

    await this.getFiltedOptionListData()

    this.hidePriceRangeOptionList()

    this.hideLoading()
  }
  async setCarTypeOptionFilter(carType = ''){
    await this.resetAllOptionFilter()

    if(typeof carType == 'string'){
      carType = carType.toLocaleLowerCase()
    }
    switch(carType){
      case 'sedan':
        carType = 0
        break
      case 'suv':
        carType = 1
        break
      case 'mpv':
        carType = 2
        break
      case 'sport':
        carType = 3
        break
      default:
        carType = ''
    }

    await this.setState({
      currentCarType:carType,
      isCarTypeFilterSet:carType === '' ? false : true,
      currentListPage:0
    })

    this.showLoading()

    await this.getFiltedOptionListData()

    this.hideCarTypeOptionList()

    this.hideLoading()
  }
  resetAllOptionFilter(){
    this.resetBrandOptionFilter()
    this.resetCarTypeOptionFilter()
    this.resetPriceRangeOptionFilter()
  }
  resetPriceRangeOptionFilter(){
    this.setState({
      modelMinPrice:0,
      modelMaxPrice:5000000,
      currentPriceRangeOptionIndex:0,
      isPriceRangeFilterSet:false
    })
  }
  resetBrandOptionFilter(){
    this.setState({
      currentBrandId:'',
      isBrandFilterSet:false
    })
  }
  resetCarTypeOptionFilter(){
    this.setState({
      currentCarType:'',
      isCarTypeFilterSet:false
    })
  }
  setCarList(){
    let carList = []
    this.state.carList.forEach((item,index) => {
      carList.push(
        <CarInfo data={item}/>
      )
    })
    return carList
  }
  switchBrandOptionList(){
    if(!this.state.isBrandOptionListVisible){
      this.setState({
        isCarTypeOptionListVisible:false,
        isPriceRangeOptionListVisible:false
      })
    }

    this.setState({
      isBrandOptionListVisible:!this.state.isBrandOptionListVisible
    })
  }
  async switchPriceOrder(){
    let nextOrderValue = this.state.priceOrder
    if(nextOrderValue === null) {
      nextOrderValue = 0
    }else{
      if(nextOrderValue < 1){
        nextOrderValue += 1
      }else{
        nextOrderValue = 0
      }
    }

    await this.setState({
      priceOrder:nextOrderValue
    })

    this.setState({
      isBrandOptionListVisible:false,
      isCarTypeOptionListVisible:false,
      isPriceRangeOptionListVisible:false
    })

    this.resetPageCounter()

    this.showLoading()
    await this.getFiltedOptionListData()
    this.hideLoading()
  }
  switchTypeOptionList(){
    if(!this.state.isCarTypeOptionListVisible){
      this.setState({
        isBrandOptionListVisible:false,
        isPriceRangeOptionListVisible:false
      })
    }

    this.setState({
      isCarTypeOptionListVisible:!this.state.isCarTypeOptionListVisible
    })
  }
  swtichPriceRange(){
    if(!this.state.isPriceRangeOptionListVisible){
      this.setState({
        isBrandOptionListVisible:false,
        isCarTypeOptionListVisible:false
      })
    }

    this.setState({
      isPriceRangeOptionListVisible:!this.state.isPriceRangeOptionListVisible
    })
  }
  render(){
    const carList = this.setCarList()

    return (
      <div className="direct_sale">
        <TopBar pageTitle="现车直销"/>
        <SaleListFilter
          switchPriceOrder={this.switchPriceOrder.bind(this)}
          isBrandOptionListVisible={this.state.isBrandOptionListVisible}
          switchBrandOptionList={this.switchBrandOptionList.bind(this)}
          carBrandOptionList={this.state.carBrandOptionList}
          carTypeOptionList={this.state.carTypeOptionList}
          isCarTypeOptionListVisible={this.state.isCarTypeOptionListVisible}
          switchTypeOptionList={this.switchTypeOptionList.bind(this)}
          isPriceRangeOptionListVisible={this.state.isPriceRangeOptionListVisible}
          swtichPriceRange={this.swtichPriceRange.bind(this)}
          setBrandOptionFilter={this.setBrandOptionFilter.bind(this)}
          setCarTypeOptionFilter={this.setCarTypeOptionFilter.bind(this)}
          setPriceRangeOptionFilter={this.setPriceRangeOptionFilter.bind(this)}
          isBrandFilterSet={this.state.isBrandFilterSet}
          isCarTypeFilterSet={this.state.isCarTypeFilterSet}
          isPriceRangeFilterSet={this.state.isPriceRangeFilterSet}
          priceOrder={this.state.priceOrder}
          currentPriceRangeOptionIndex={this.state.currentPriceRangeOptionIndex}
        />
        <div className="car_list">
          {carList}
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

export default DirectSaleList
