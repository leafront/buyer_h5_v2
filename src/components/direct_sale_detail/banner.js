import React from 'react'

import { CollectClickData } from '../../data_collection'


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

class DirectSaleDetailBanner extends React.Component {
  constructor(props){
    super(props)
  }
  render(){

    let directBanner = null
    if(this.props.carDetailList.length > 0){

      let tagListDataArray = []
      let tagListData = this.props.carDetailList[this.props.currentCarModelIndex].tagList
      if(tagListData !== null){
        tagListDataArray = tagListData.split('#')
      }

      const tagList = (
        <CarTagList tagListData={tagListDataArray}/>
      )
      directBanner = (
        <div className="directBanner">
          <p className="bannerDiscount">{(this.props.carDetailList[this.props.currentCarModelIndex].dsrp / this.props.carDetailList[this.props.currentCarModelIndex].msrp*10).toFixed(1)}折</p>
        	<img className="directBannerCar" src={this.props.carDetailList[this.props.currentCarModelIndex].modelPhoto}/>
          <div className="directBannerTag">
            {tagList}
          </div>
        </div>
      )
    }
    return directBanner
  }
}

export default DirectSaleDetailBanner