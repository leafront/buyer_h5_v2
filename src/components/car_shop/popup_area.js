import React from 'react'

class PopupArea extends React.Component {
  constructor(props) {
    super(props)
  }
  districtOptionClicked(index,e){
    this.props.setDistrictIndex(index)
    this.props.setAreaIndex(0)
  }
  async areaOptionClicked(index,e){
    await this.props.setAreaIndex(index)

    await this.props.getShopData()

    this.props.hidePopupAreaOptions()

    let currentUserOptions = JSON.parse(sessionStorage.USER_SELECTED_PARITY_OPTIONS)
    currentUserOptions.districtText = this.props.areaData[this.props.currentDistrict].name
    currentUserOptions.areaText = this.props.areaData[this.props.currentDistrict].areaList[this.props.currentArea].name

    sessionStorage.USER_SELECTED_PARITY_OPTIONS = JSON.stringify(currentUserOptions)
  }
  render(){
    let popupAreaComponent = null

    let districtArray = []
    let areaArray = []

    if(this.props.areaData.length > 0){
      this.props.areaData.forEach((district,districtIndex) => {
        let districtActiveClass = ""
        if(this.props.currentDistrict === districtIndex){
          districtActiveClass = " active "
        }
        districtArray.push(<li key={districtIndex} onClick={this.districtOptionClicked.bind(this,districtIndex)} className={districtActiveClass}>{district.name}</li>)
      })
      this.props.areaData[this.props.currentDistrict].areaList.forEach((area,areaIndex) => {
        areaArray.push(<li key={areaIndex} onClick={this.areaOptionClicked.bind(this,areaIndex)}>{area.name}</li>)
      })
    }

    if(this.props.areaPopupVisibility){
      popupAreaComponent = (
        <div className="popup_area">
          <div className="content">
            <div className="title">
              <h2>选择区域（就近匹配4S店）</h2>
            </div>
            <div className="district_and_area">
              <div className="district">
                <ul>{districtArray}</ul>
              </div>
              <div className="area">
                <ul>{areaArray}</ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div>
        {popupAreaComponent}
      </div>
    )
  }
}

export default PopupArea
