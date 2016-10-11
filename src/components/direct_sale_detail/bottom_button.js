import React from 'react'

import { CollectClickData } from '../../data_collection'

import { ImChatButtonTwo } from '../../components/common/im_chat_button'

class BottomButton extends React.Component {
  constructor(props){
    super(props)
  }

  onGoCarTotalPriceClick(){
    this.props.goCarTotalPrice()
    CollectClickData({poicode:'MDZ0'})
  }

  render(){
    let imChatBtn = ImChatButtonTwo()
    if(this.props.carDetailList.length === 0){
      return null
    }
    return (
      <div className="bottomBtn">
        <div className="customerService" onClick={CollectClickData.bind(null,{poicode:'MZ3Y'})}>
          <img src={require('../../../images/direct_sale_detail/IM.jpg')}/>
          <p onClick={CollectClickData.bind(null,{poicode:'MZ4X'})}>{imChatBtn}</p>
        </div>
        <button onClick={this.onGoCarTotalPriceClick.bind(this)} className="landPrice">进一步，查看落地价</button>
      </div>
    )
  }
}

export default BottomButton