import React from 'react'
import 'whatwg-fetch'

import { GetGlobalConfig , ConvertObjectToQueryString } from '../../common'

class CarShopHeader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      advisorsList:[]
    }
  }
  componentDidMount(){
    this.getAdvisorsList()
  }
  async getAdvisorsList(){
    // console.log(window.sessionStorage.USER_SELECTED_PARITY_OPTIONS)
    // {"seriesId":"dc8e19e43a2548ee89202d1f349f7b59","seriesName":"马自达8","modelId":"CMZ0325A0013","modelName":"2.5 手自一体 精英版","color":"极夜黑","needLoan":0,"needReplace":0,"licenseArea":"上海,宝山","buyTime":"3个月后"}

          //
    // let userSelectedAllOptions = null
    if(!sessionStorage.USER_SELECTED_ALL_OPTIONS_INFO){
      return
    }
    let userSelectedAllOptions = JSON.parse(sessionStorage.USER_SELECTED_ALL_OPTIONS_INFO)

    const RequestData = ConvertObjectToQueryString({
      fsIds:userSelectedAllOptions.askpFs
    })
    // console.log(userSelectedAllOptions)
    const Response = await fetch(
      GetGlobalConfig().env + '/hybrid/ask/getFsEmpInfo',
      {
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:RequestData,
        method:'POST'
      }
    )
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    if(ResponseOK && ResponseJSON.status === 1){
      this.setState({
        advisorsList:ResponseJSON.data
      })
    }
    // const Response = await $.ajax({
    //   url:GetGlobalConfig().env + '/hybrid/ask/getFsEmpInfo',
    //   data:{
    //     fsIds:userSelectedAllOptions.askpFs
    //   },
    //   method:'post',
    //   dataType:'json'
    // })
    // // console.log(Response.status)
    // if(Response && Response.status === 1){
    //   this.setState({
    //     advisorsList:Response.data
    //   })
    // }
  }
  render(){
    if(!this.props.isCarShopHeaderVisible){
      return null
    }

    let advisorList = []
    // console.log(this.state.advisorsList)
    this.state.advisorsList.forEach((item,i) => {
      advisorList.push(
        <li>
          <p className="advisor_img">
            <img width="100%" height="100%" src={item.empPhoto}/>
          </p>
          <p className="advisor_shop_name">{item.fsAbbrname}</p>
        </li>
      )
    })

    let advisorInfo = null
    if(this.state.advisorsList.length > 0){
      advisorInfo = this.state.advisorsList.length + '位' + '销售员已准备好底价PK，加油！'
    }

    return (
      <div className="car_shop_login">
        <div className="advisor_list">
          <ul>
            {advisorList}
          </ul>
        </div>
        <div className="service_slogen">
          <h3>您的选择很明智！</h3>
          <p>{advisorInfo}</p>
        </div>
      </div>
    )
  }
}

export default CarShopHeader
