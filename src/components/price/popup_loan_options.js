import React from 'react'
import OptionItem from './optionItem'
import { convertNum } from '../../common'

import { CollectClickData } from '../../data_collection'

class PopupLoanOptions extends React.Component {
  constructor(props) {
    super(props)
  }

  onSelectLoanClick(index,item){
    this.props.onSelectLoan(index, item.firstPay)
    CollectClickData({poicode:'MZ52'})
  }

  getLoanList() {
    if (this.props.loanList.length === 0) {
      return null
    }

    return this.props.loanList.map((item, index) => {
      return (
        <div className={ index === this.props.currentLoanTypeIndex ? 'active' : '' } onClick={this.onSelectLoanClick.bind(this,index,item)}>
          <h3>首付 <em>¥{ convertNum(item.firstPay) }</em></h3>
          <p>
            首付 {item.payPercent + '%'} | 分期 { item.stage }个月 | 贷款 { convertNum(item.loanNum) }元 |
            月供(含利息) { convertNum(item.monthPay) }元
          </p>
        </div>
      )
    })
  }

  onHidePopupLoanOptionsClick(){
    this.props.onHidePopupLoanOptions()
    CollectClickData({poicode:'MZ5Z'})
  }

  onOutsideHidePopupLoanOptionsClick(e){
    let outsideOption=e.target.className
    if(outsideOption=="popup_loan_options popup_options"){
      this.props.onHidePopupLoanOptions()
    }
    CollectClickData({poicode:'MZ5Z'})
  }

  render() {
    let loanItem = this.getLoanList()
    const loanBankOptions = (
      <OptionItem
        optionClassName='insurance_company'
        optionName='贷款'
        optionItems={this.props.priceOptions.banks}
        selectedIndex={this.props.currentLoanBankIndex}
        optionClicked={this.props.onSelectLoanBank}
        clickDataCode='MZ51'
      />
    )

    return (
      <div className="popup_loan_options popup_options" onClick={this.onOutsideHidePopupLoanOptionsClick.bind(this)}>
        <div className="all_info_wrapper">
          { loanBankOptions }
          <div className="options_lists">
            { loanItem }
          </div>
          <div className="confirm_options">
            <button onClick={this.onHidePopupLoanOptionsClick.bind(this)}>确定</button>
          </div>
        </div>
      </div>
    )
  }
}

export default PopupLoanOptions
