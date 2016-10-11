import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { CollectClickData } from '../../data_collection'
import { CallPhone , GetLocalStorageInfo } from '../../common'

class UserOptions extends React.Component {
  constructor(props) {
    super(props)
  }

  serviceButtonClicked() {
    CallPhone()
    CollectClickData({poicode: 'MP17'})
  }

  render() {
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    return (
      <div className="user_options">
        <ul>
          <li>
            <Link to="/my_order" onClick={CollectClickData.bind(null, {poicode: 'MP12'})}><span>订单</span><b>NEW</b></Link>
          </li>
          <li>
            <Link to="/my_inquire" onClick={CollectClickData.bind(null, {poicode: 'MP11'})}><span>比价购车单</span><b>NEW</b></Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/account" onClick={CollectClickData.bind(null, {poicode: 'MP13'})}><span>账户</span></Link>
          </li>
        </ul>
        <ul>
          <li>
            <button onClick={this.props.onShowFeedback}><span>反馈</span></button>
          </li>
          <li>
            <Link to="/about" onClick={CollectClickData.bind(null, {poicode: 'MP14'})}><span>关于</span></Link>
          </li>
          <li>
            <Link to="/setting" onClick={CollectClickData.bind(null, {poicode: 'MP16'})}><span>设置</span></Link>
          </li>
        </ul>
        <ul>
          <li>
            { CityCode == '310000' ?
              <a href="tel:4008798779"><span>客服电话 400-879-8779</span></a>
              :<a href="tel:4008881822"><span>客服电话 400-888-1822</span></a>
            }
          </li>
          <li>
            <button onClick={this.serviceButtonClicked.bind(this)}><span>在线客服</span></button>
          </li>
        </ul>
      </div>
    )
  }
}

export default UserOptions
