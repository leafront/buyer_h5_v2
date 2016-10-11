import React from 'react'
import { Link } from 'react-router'
import { CollectClickData } from '../../data_collection'
import { GetLocalStorageInfo , ConvertObjectToQueryString , GetGlobalConfig } from '../../common'

class AdvertisementBanner extends React.Component {
  constructor(props) {
    super(props)

    // let advertisementBannerImgs = [
    //   'http://m.haomaiche.com/images/top_banner04.jpg',
    //   'http://m.haomaiche.com/images/banner03_narrow.png',
    //   'http://m.haomaiche.com/images/top_banner02.jpg',
    //   'http://m.haomaiche.com/images/top_banner01.png',
    // ]
    // let totalBannerImgs = advertisementBannerImgs.length
    // advertisementBannerImgs.forEach((item,i) => {
      //width = advertisementBannerImgs.length * 100
    // })

    this.state = {
      // carList:[],
      isAdBannerTouched:false,
      // bannerLeft: -100,
      // bannerWidth: totalBannerImgs * 100,
      // bannerImgPerWidth:0,
      // advertisementBannerImgs:advertisementBannerImgs,
      // advertisementBannerLinks:[
      //   'http://event.haomaiche.com/w5_return/h5/',
      //   'http://event.haomaiche.com/free_take_licence/h5-a/dist/#/?init=1&channel=2&activityCode=201605',
      //   'http://event.haomaiche.com/chenfeng/h5/',
      //   'http://m.haomaiche.com/upgrade/h5/index.html?fromurl=hybrid'
      // ]
    }

    this.touchedX = 0
    this.startLeft = 0
    this.bannerAutoScrollCounter = null

    this.autoScrollBannerInterval = null
    this.autoScrollBannerFrame = 0
  }
  componentDidMount(){
    this.autoScrollBanner()
  }
  componentWillUnmount(){
    this.clearAutoScrollBanner()
  }
  clearAutoScrollBanner(){
    cancelAnimationFrame(this.autoScrollBannerInterval)
  }
  autoScrollBanner(){
    this.autoScrollBannerInterval = requestAnimationFrame(() => { //&& this.props.bannerList.length > 0
      if(!this.state.isAdBannerTouched && this.props.bannerList.length > 0){
        this.autoScrollBannerFrame++
        if(this.autoScrollBannerFrame >= 500){
          this.scrollToNextBanner()
          this.autoScrollBannerFrame = 0
        }
      }else{
        this.autoScrollBannerFrame = 0
      }
      this.autoScrollBanner()
    })
  }
  scrollToNextBanner(){

    let orgBannerList = this.props.bannerList

    this.bannerAutoScrollCounter = setInterval(() => {
      if(this.props.currentBannerLeft > -300){
        this.props.updateCurrentBannerLeft(this.props.currentBannerLeft - 2)
      }else{
        const firstEle = orgBannerList.shift()

        orgBannerList.push(firstEle)

        this.props.modifyBannerList(orgBannerList)
        this.props.updateCurrentBannerLeft(-200)

        clearInterval(this.bannerAutoScrollCounter)
      }
    },16.7)
  }
  scrollToPrevBanner(){

    let orgBannerList = this.props.bannerList

    this.bannerAutoScrollCounter = setInterval(() => {
      if(this.props.currentBannerLeft < -100){
        this.props.updateCurrentBannerLeft(this.props.currentBannerLeft + 2)
      }else{
        const lastEle = orgBannerList.pop()
        orgBannerList.unshift(lastEle)

        this.props.modifyBannerList(orgBannerList)
        this.props.updateCurrentBannerLeft(-200)

        clearInterval(this.bannerAutoScrollCounter)
      }
    },16.7)
  }
  resetBanner(){
    if(this.props.currentBannerLeft < -200){
      this.bannerAutoScrollCounter = setInterval(() => {
        this.props.updateCurrentBannerLeft(this.props.currentBannerLeft + 1)
        if(this.props.currentBannerLeft > -200){
          this.props.updateCurrentBannerLeft(-200)
          clearInterval(this.bannerAutoScrollCounter)
        }
      },16.7)
    }
    if(this.props.currentBannerLeft > -200){
      this.bannerAutoScrollCounter = setInterval(() => {
        this.props.updateCurrentBannerLeft(this.props.currentBannerLeft - 1)
        if(this.props.currentBannerLeft < -200){
          this.props.updateCurrentBannerLeft(-200)
          clearInterval(this.bannerAutoScrollCounter)
        }
      },16.7)
    }
  }
  AD_BannerTouchStart(e){
    this.setState({
      isAdBannerTouched:true
    })
    this.touchedX = e.touches[0].pageX
    this.startLeft = this.props.currentBannerLeft

    clearInterval(this.bannerAutoScrollCounter)
    // this.clearAutoScrollBanner()
  }
  AD_BannerMoved(e){
    const TotalWidth = e.currentTarget.offsetWidth
    const touchMoveDistance = e.touches[0].pageX - this.touchedX
    const moveDistance = touchMoveDistance / ( TotalWidth / this.props.bannerList.length ) * 100

    this.props.updateCurrentBannerLeft(this.startLeft + moveDistance)
    // this.setState({
    //   bannerLeft:this.startLeft + moveDistance
    // })
  }
  AD_BannerTouchEnd(e){

    this.setState({
      isAdBannerTouched:false
    })
    let orgBannerList = this.props.bannerList

    const moveDistance = this.startLeft - this.props.currentBannerLeft

    if(moveDistance > 30) {

      this.scrollToNextBanner()

    }else if(moveDistance < -30){

      this.scrollToPrevBanner()

    }else{

      this.resetBanner()

    }
    // this.autoScrollBanner()
    this.setState({
      isAdBannerTouched: false
    })
  }
  render(){
    // bannerImgPerWidth
    // this.state.advertisementBannerImgs.length

    let imgsArray = []
    // console.log(this.props.bannerList.length)
    // if(this.props.bannerList.length > 0){
    this.props.bannerList.forEach((item,i) => {
      imgsArray.push(
        <li style={{width:100 / this.props.bannerList.length + '%'}}><a href={item.advertLink} onClick={CollectClickData.bind(null,{poicode:'MB17'})}><img width="100%" src={item.advertPic}/></a></li>
      )
    })
    // }
    if(imgsArray.length === 0) {
      imgsArray = null
    }
    let imgsList = (
      <ul style={{width:this.props.bannerList.length * 100 + '%',left:this.props.currentBannerLeft + '%'}}
        onTouchStart={this.AD_BannerTouchStart.bind(this)}
        onTouchMove={this.AD_BannerMoved.bind(this)}
        onTouchEnd={this.AD_BannerTouchEnd.bind(this)}>
        {imgsArray}
      </ul>
    )

    return (
      <div className="advertisement_banner">

        {
          this.props.bannerList.length > 0 ?
          <div>{imgsList}</div>
          : null
        }
      </div>
    )
  }
}

export default AdvertisementBanner
