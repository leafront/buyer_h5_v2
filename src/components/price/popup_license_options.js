import React from 'react'
import OptionItem from './optionItem'

import { CollectClickData } from '../../data_collection'

class PopupLicenseOptions extends React.Component {
  constructor(props) {
    super(props)
  }

  onHidePopupLicenseOptionsClick(){
    this.props.onHidePopupLicenseOptions()
    CollectClickData({poicode:'MZ6Z'})
  }

  onOutsideHidePopupLicenseOptionsClick(e){
    let outsideOption=e.target.className
    if(outsideOption=="popup_license_options popup_options"){
      this.props.onHidePopupLicenseOptions()
    }
    CollectClickData({poicode:'MZ6Z'})
  }

  render() {
    let licenseOptionsData = []
    this.props.priceOptions.licenses.forEach((item,value) => {
      licenseOptionsData.push(
        item.type
      )
    })
    const licenseOptions = (
      <OptionItem
        optionClassName='license'
        optionName='选择户籍'
        optionItems={licenseOptionsData}
        selectedIndex={this.props.currentLicenseIndex}
        optionClicked={this.props.onSelectLicense}
        clickDataCode='MZ61'
      />
    )

    let licenseCityOptions = null
    if(this.props.currentCarInfo.licenseType != '沪牌'){
      // console.log(this.props.priceOptions.licenses[this.props.currentLicenseIndex].locations)
      let licenseCityOptionsData = []
      this.props.priceOptions.licenses[this.props.currentLicenseIndex].locations.forEach((item,value) => {
        licenseCityOptionsData.push(
          item.location + '牌照／' + item.license
        )
      })
      // console.log(this.props.currentCarInfo)
      licenseCityOptions = (
        <OptionItem
          optionClassName='license'
          optionName='选择牌照'
          optionItems={licenseCityOptionsData}
          selectedIndex={this.props.currentLicenseCityIndex}
          optionClicked={this.props.onSelectLicenseCity}
          clickDataCode='MZ62'
        />
      )
    }

    return (
      <div className="popup_license_options popup_options" onClick={this.onOutsideHidePopupLicenseOptionsClick.bind(this)}>
        <div className="all_info_wrapper">
          { licenseOptions }
          <div className="options_lists">
          </div>
          { licenseCityOptions }
          
          <div className="confirm_options">
            <button onClick={this.onHidePopupLicenseOptionsClick.bind(this)}>确定</button>
          </div>
        </div>
      </div>
    )
  }
}

export default PopupLicenseOptions
