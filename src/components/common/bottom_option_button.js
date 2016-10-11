import React,{ PropTypes } from 'react'
import { Link } from 'react-router'

import { CollectClickData } from '../../data_collection'
import { CallPhone } from '../../common'

class BottomOptionButton extends React.Component {
  constructor() {
    super()

    this.state = {
      screenMaskVisibility:'hide',
      optionBtnMineVisibility:'hide',
      optionBtnPhonecallVisibility:'hide'
    }
  }
  switchOptionButton(e){
    if(this.state.screenMaskVisibility == 'hide'){
      this.showScreenMask()
      this.showAllOptionButton()
    }else{
      this.hideScreenMask()
      this.hideAllOptionButton()
    }

    CollectClickData({poicode:'M03'})
  }
  showAllOptionButton(){
    this.setState({
      optionBtnMineVisibility:'show',
      optionBtnPhonecallVisibility:'show'
    })
  }
  hideAllOptionButton(){
    this.setState({
      optionBtnMineVisibility:'hide',
      optionBtnPhonecallVisibility:'hide'
    })
  }
  showScreenMask(){
    this.setState({
      screenMaskVisibility:'show'
    })
  }
  hideScreenMask(){
    this.setState({
      screenMaskVisibility:'hide',
      optionBtnMineVisibility:'hide',
      optionBtnPhonecallVisibility:'hide'
    })
  }
  serviceButtonClicked(){
    CallPhone()
    CollectClickData({poicode:'M04'})
  }
  render() {
    // let show
    return (
      <div className="bottom_option">
        <div className={"screen_mask " + this.state.screenMaskVisibility} onClick={this.hideScreenMask.bind(this)}></div>
        <div className="option_button_wrapper">
          <Link to="/user_center" className={"option_button_mine " + this.state.optionBtnMineVisibility} onClick={CollectClickData.bind(null,{poicode:'M06'})}>我的</Link>
          <button className={"option_button_phonecall " + this.state.optionBtnPhonecallVisibility} onClick={this.serviceButtonClicked.bind(this)}>客服</button>
          <button className="option_button" onClick={this.switchOptionButton.bind(this)}></button>
        </div>
      </div>
    )
  }
}

export default BottomOptionButton
