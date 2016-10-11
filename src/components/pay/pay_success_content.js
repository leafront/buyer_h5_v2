import React from 'react'
import { ImChatButtonThree } from '../common/im_chat_button'
import { convertNum } from '../../common'


class PaySuccessContent extends React.Component {
  constructor(props) {
    super(props)
  }

  getPaySuccessContent() {
    let data = this.props.paySuccessInfo

    return (
      <div className="pay_success">
            <div className="hint">恭喜您，支付成功！</div>
            <div className="coll_info">
                <span>收款人：{ data.payee }</span>
                <span>金额：<i>￥{ data.amount }</i></span>
                <span>付款方：{ data.payer } ({ data.phone })</span>
                <span>支付宝交易号:{ data.transactionNo }</span>
            </div>
        <div className="semicircle"></div>
        <div className="vehicle_info">
            <dl>
                <dt>车辆信息</dt>
                <dd>车　　款：{ data.carBrandName } { data.carTypeName } { data.carModelName }</dd>
                <dd>颜　　色：{ data.piColorName }</dd>
                {
                  data.askpBuyTime ? <dd>提车时间：{ data.askpBuyTime }</dd> : ''
                }
                <dd>服 务  费 ：{ convertNum(data.servicePrice) }元</dd>
                <dd>牌　　照：{ data.licenseLocation }</dd>
                <dd>上牌费用：{ convertNum(data.licensePrice) }元</dd>
                <dd>保　　险：{ convertNum(data.carInsurancePrice) }元</dd>
                {
                  data.sourceBindPrice ? <dd>加装金额：{ convertNum(data.sourceBindPrice) }</dd> : ''
                }
                {
                  data.sourceBind ? <dd>加装项目：{ data.sourceBind }</dd> : ''
                }
                <dd>总　　价：{ convertNum(data.sourceSum) }元</dd>
                {
                  data.giftNames ? <dd>赠　　送：{ data.giftNames }</dd> : ''
                }
            </dl>
        </div>
        <div className="line_item">
            <dl>
                <dt>订单详情</dt>
                <dd>询价单号：{ data.piCode }</dd>
                <dd>支付方式：{ data.payway }</dd>
                <dd>付 款 人 ：{ data.payer }</dd>
                <dd>联系方式：{ data.phone }</dd>
                <dd>付款时间：{ data.piPayTime }</dd>
            </dl>
            <span style={{display:'none'}} data-poicode="MPB31" className="js_keep_img">保存至本地相册</span>
        </div>
        <div className="watermark"></div>
        <ImChatButtonThree />
      </div>
    )
  }

  render() {
    let paySuccessContent = this.getPaySuccessContent()

    return (
      <div className="pay_success_content">
        { paySuccessContent }
      </div>
    )
  }
}

export default PaySuccessContent
