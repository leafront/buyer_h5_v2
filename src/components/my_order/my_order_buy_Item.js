import React from 'react'
import { Link } from 'react-router'
import FreeUpgradeConfig from './free_upgrade_config'
import { convertNum, convertFormat, ConvertPriceToLargerNumber, GetLocalStorageInfo } from '../../common'

class MyOrderBuyItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let item = this.props.item
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    return (
      <div className="my_order_buy_item">
        <div className="order">
            <div className="gen_time">
              <span className="trans_code">单号：{item.piCode}</span>
              <span className="generate_time">{item.createTime.split(" ")[0]}</span>
            </div>
            <div className="car_message">
              {item.modelPhoto ?
                <img src={item.modelPhoto} /> : ''
              }
              <span>
                <em>{item.modelBrandName}{item.modelTypeName} {item.modelName}</em><br/>
                {item.piColorName} / {item.buyWay} / {item.licenseLocation}
              </span>
            </div>
            <FreeUpgradeConfig />
            <div className="fare">
              <p>实际支付：
                <i>
                  { item.sumPrice < 10000 ? convertNum(item.sumPrice) : ConvertPriceToLargerNumber(item.sumPrice) }
                  { item.sumPrice < 10000 ? '元' : '万元' }
                </i>
              </p>
              <p>好买车帮您节省：
                <i>
                  { item.piSaveMoney < 10000 ? convertNum(item.piSaveMoney) : ConvertPriceToLargerNumber(item.piSaveMoney) }
                  { item.piSaveMoney < 10000 ? '元' : '万元' }
                </i>
              </p>
            </div>
        </div>
        <div className="look_detail">
          <Link to={'/my_order_buy_detail/' + item.piId}}>查看详情</Link>
          {
            item.piIsPay == 10 ?
            <Link to={'/pay_success/' + item.piId}>查看支付凭证</Link> : ''
          }
        </div>
      </div>
    )
  }
}

export default MyOrderBuyItem
