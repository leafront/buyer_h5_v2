import React from 'react'
import { GetLocalStorageInfo , GetQueryStringByName } from '../../common'

class SelectArea extends React.Component {
  constructor(props) {
    super(props)

  }
  getCurrentCityNameByCityCode(cityCode){//->String
    let cityName = null
    switch(cityCode){
      case 310000:
        cityName = '上海市'
        break
      case 330100:
        cityName = '杭州市'
        break
    }
    return cityName
  }
  render(){
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY') && GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    const CityName = this.getCurrentCityNameByCityCode(CityCode)
    return (
      <dl className="area_options">
        <dt><span className="province">{CityName}</span></dt>
        <dd><button className="district" onClick={this.props.showPopupAreaOptions}>{this.props.districtText}</button></dd>
        <dd><button className="area" onClick={this.props.showPopupAreaOptions}>{this.props.areaText}</button></dd>
      </dl>
    )
  }
}

export default SelectArea
