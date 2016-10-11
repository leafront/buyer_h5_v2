import React from 'react'
import OptionItem from './optionItem'
import { convertNum } from '../../common'

import { CollectClickData } from '../../data_collection'

class PopupInsuranceOptions extends React.Component {
  constructor(props) {
    super(props)
  }

  getInsurancePay() {
    return (
      <div className="active">
        <h3>基本组合 <em>¥{ convertNum(this.props.insurancePay) }</em></h3>
        <p>
          交强险＋车损险+第三者责任[50万元]+不计免赔险
        </p>
      </div>
    )
  }

  onHidePopupInsuranceOptionsClick(){
    this.props.onHidePopupInsuranceOptions()
    CollectClickData({poicode:'MZ7Z'})
  }

  onOutsideHidePopupInsuranceOptionsClick(e){
    let outsideOption=e.target.className
    if(outsideOption=="popup_insurance_options popup_options"){
      this.props.onHidePopupInsuranceOptions()
    }
    CollectClickData({poicode:'MZ7Z'})
  }

  render() {
    let insureCompanys = []
    this.props.priceOptions.insureCompanys.forEach((item,value) => {
      insureCompanys.push(
        item.name
      )
    })

    const InsuranceCompanyOptions = (
      <OptionItem
        optionClassName='license'
        optionName='选择投保公司'
        optionItems={insureCompanys}
        selectedIndex={this.props.currentInsuranceCompanyIndex}
        optionClicked={this.props.onSelectInsuranceCompany}
        clickDataCode='MZ71'
      />
    )

    let insurancePayItem = this.getInsurancePay()

    return (
      <div className="popup_insurance_options popup_options" onClick={this.onOutsideHidePopupInsuranceOptionsClick.bind(this)}>
        <div className="all_info_wrapper">
          { InsuranceCompanyOptions }
          <div className="options_lists" onClick={CollectClickData.bind(null,{poicode:'MZ72'})}>
            { insurancePayItem }
          </div>
          <div className="confirm_options">
            <button onClick={this.onHidePopupInsuranceOptionsClick.bind(this)}>确定</button>
          </div>
        </div>
      </div>
    )
  }
}

export default PopupInsuranceOptions
