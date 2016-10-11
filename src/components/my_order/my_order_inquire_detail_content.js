import React from 'react'
import { GetGlobalConfig } from '../../common'

class MyOrderInquireDetailContent extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    return (
      <div className="my_order_inquire_detail_content">

      <div className="order">
          <div className="gen_time">
            <span>生成时间：{item.createTime.split(" ")[0]}</span>
            <span className="trans_code">单号：{item.piCode}</span>
          </div>
          <div className="car_message">
            {item.modelPhoto ?
              <img src={item.modelPhoto} /> : ''
            }
            <span>{item.modelBrandName}<br/>{item.modelTypeName} {item.modelName}</span>
          </div>
          <div className="fare">
            <p>实际支付：<i>{item.sumPrice}元</i></p>
            <p>好买车帮您节省：<i>{item.piSaveMoney}元</i></p>
          </div>
          <div className="select">
            <div className="se_sty">
              <span>颜色：{item.piColorName}</span>
              <span>购车方式：{item.buyWay}</span>
              <span>上牌：{item.licenseLocation}</span>
            </div>
          </div>
      </div>
      <div className="look_detail" data-id={item.piId}>
        <Link to={'/direct_sale_order_detail/' + item.piId}>查看详情</Link>
      </div>

      </div>
    )
  }
}

export default MyOrderInquireDetailContent
