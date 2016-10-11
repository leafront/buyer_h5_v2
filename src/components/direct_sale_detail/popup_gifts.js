import React, { Component } from 'react'
import Rodal from '../common/pop_up'
import {GetLocalStorageInfo} from '../../common'
import '../../style/common/popUp.scss'

class DirectPresent extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="give" onClick={this.props.onShow.bind(this)}>
        <p><span>返</span>好买车赠送</p>
        <div className="imgContainer">
          <p className="giftPrice">价值<b>4598</b>元礼包  &gt;</p>
        </div>
      </div>
    )
  }
}

class PopupGifts extends Component {
  constructor(props) {
    super(props)
    this.state = { visible: false }
  }

  show() {
    this.setState({ visible: true })
  }

  hide() {
    this.setState({ visible: false })
  }

  render() {
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    if(CityCode=='330100'){
      return null;
    }
    return (
      <div>
        <DirectPresent onShow={this.show.bind(this)} />
        <Rodal visible={this.state.visible} onClose={this.hide.bind(this)}>
          <div className="popup_content">
            <p className="popup_title">好买车购车大礼包</p>
            <ul>
              <li>
                <div>
                  <img src={require('../../../images/direct_sale_detail/gift_protect.png')}/>
                </div>
                <div className="popup_gift">
                  <p>Limooking高级隔热防爆贴膜（美国进口，终身质保）</p>
                  <p className="gift_price">价值 ￥3,999</p>
                </div>
              </li>
              <li>
                <div>
                  <img src={require('../../../images/direct_sale_detail/gift_package.png')}/>
                </div>
                <div className="popup_gift">
                  <p>YOOCH车用12件急救包</p>
                  <p className="gift_price">价值 ￥500</p>
                </div>
              </li>
              <li>
                <div>
                  <img src={require('../../../images/direct_sale_detail/gift_fire.png')}/>
                </div>
                <div className="popup_gift">
                  <p>车载1KG专用灭火器、车载灭火器专用网兜</p>
                  <p className="gift_price">价值 ￥99</p>
                </div>
              </li>
            </ul>
          </div>
        </Rodal>
      </div>
    )
  }
}

export default PopupGifts
