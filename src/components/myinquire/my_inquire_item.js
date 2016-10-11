import React from 'react'
import { Link } from 'react-router'
import { CollectClickData } from '../../data_collection'

class MyInquireItem extends React.Component {
  constructor() {
    super()
  }

  convertFormat(value) {
    return value < 10 ? '0' + value : value;
  }

  convertNum(num) {
    var list = new String(num).split('').reverse();
  	for(var i = 0; i < list.length; i++){
  		if(i % 4 == 3){
  			list.splice(i, 0, ',');
  		}
  	}
  	return list.reverse().join('');
  }

  getRespondList() {
    //console.log(this.props.params.currentTab)
    let item = this.props.item
    let respondList = item.respondList.map((respondItem,index) => {
      let carCollectionTime = respondItem.carCollectionTime.length > 0 ? '<em>|</em>'
          + respondItem.carCollectionTime : ''
      return (
          <li data-respondid={ respondItem.respondId } className={index}>
            <Link to={'/my_inquire_detail/' + item.askpId +'/' + index}></Link>
            {respondItem.fsPic ? <img src={respondItem.fsPic}/> : ''}
            <dl>
              <dt>
                报价：<i>{(respondItem.sourceSum / 10000).toFixed(2)}万元</i>
                { respondItem.fsIssign == 1 ?
                  <strong className="recommend">
                    <em>品质</em><em className="color">商家</em>
                  </strong> : ''
                }
              </dt>
              <dd>
                备注：{respondItem.sourceCategory}
                { respondItem.carCollectionTime ?
                  <em>|</em> : ''
                }
                { respondItem.carCollectionTime ?
                  respondItem.carCollectionTime : ''
                }
              </dd>
            </dl>
          </li>
      )
    })


    return (
      <div className="offer_list">
        <ul data-askpid={item.askpId}>
          {respondList}
        </ul>
      </div>
    )
  }

  getWaitPriceTpl() {
    let item = this.props.item
    let time = new Date(this.props.item.askpRespTime)
    let year = time.getFullYear()
    let month = this.convertFormat(time.getMonth() + 1)
    let day = this.convertFormat(time.getDate())
    let hour = this.convertFormat(time.getHours())
    let minute = this.convertFormat(time.getMinutes())
    let dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute

    return (
      <div>
          <span className="order_num">
            <em className="wait">{dateTime} 后收到报价</em>
            <em>单号：{item.askpCode}</em>
          </span>
          <div className="car_detail">
            <img src={item.tpicPath}/>
            <div className="favor">
              <span>{item.brandName} {item.askpTypeName} {item.askpModelName}</span>
              <span>4S店最高优惠：<i>敬请期待...</i></span>
            </div>
          </div>
      </div>
    )
  }


  convertTime(leaveTime) {
      var dateTime,
          day = Math.floor(leaveTime/1000/60/60/24),
          hour = Math.floor(leaveTime/1000/60/60%24),
          minute = Math.floor(leaveTime/1000/60%60),
          second = Math.floor(leaveTime/1000%60);
      dateTime = day + '天' + hour + '时' + minute + '分' + second + '秒';
      return dateTime;
  }

  getValidPriceTpl() {
    let item = this.props.item
    let respondLists = this.getRespondList()
    let dateTime = this.convertTime(item.askpRespTime + 259200000 - this.props.now - (this.props.elapsedTime * 1000))
    // console.log(item.askpRespTime + 259200000 - this.props.now - this.props.elapsedTime)
    return (
      <div>
          <span className="order_num">
            <em><span className="time_countdown">{dateTime}</span> 后失效</em>
            <em>单号：{item.askpCode}</em>
          </span>
          <div className="car_detail">
            <img src={item.tpicPath}/>
            <div className="favor">
              <span>{item.brandName} {item.askpTypeName} {item.askpModelName}</span>
              <span>
                4S店最高优惠：
                <i>
                  {item.repondPrice < 10000 ? this.convertNum(item.repondPrice) : (item.repondPrice/ 10000).toFixed(0)}
                  {item.repondPrice < 10000 ? '元' : '万元'}
                </i>
              </span>
            </div>
          </div>
          {respondLists}
      </div>
    )
  }

  getInvalidPriceTpl() {
    let item = this.props.item
    return (
      <div className="invalid">
        <span className="order_num">
          <em>报价已失效</em>
        </span>
        <div className="car_detail">
          <img src={item.tpicPath}/>
          <div className="favor">
            <span>{item.brandName} {item.askpTypeName} {item.askpModelName}</span>
            <span>4S店最高优惠：<i>{this.convertNum(item.repondPrice)}元</i></span>
          </div>
        </div>
      </div>
    )
  }

  render() {
    let status = Number(this.props.item.askpState) || null
    let tpl = null
    switch(status) {
      case 2:
        tpl = this.getWaitPriceTpl()
        break;
      case 3:
      case 14:
        tpl = this.getValidPriceTpl()
        break;
      case 4:
        tpl = this.getInvalidPriceTpl()
        break;
    }

    return (
      <div className="my_inquire_item">
        {tpl}
      </div>
    )
  }
}

export default MyInquireItem
