import { GetGlobalConfig , CalculatGUID , CheckGUIDIsSet , SaveUserGUID , GetLoginInfo } from './common'
import { hashHistory } from 'react-router'
import $ from 'jquery'

const GlobalConfig = GetGlobalConfig()
const DataCollectionUrl = GlobalConfig.env + '/ual/log'
const Platform = GlobalConfig.platform

//@todo move those to app.js
let prevUrl = null

hashHistory.listenBefore(() => {//@??? listenBeforeUnload
  prevUrl = window.location.href
})
hashHistory.listen(() => {
  CollectVisitData()
  checkPullToFreshEnable()
})
//@todo move those to app.js

function checkPullToFreshEnable(){
  let url = window.location.href
  const URL = url.split('#')[1].toLowerCase()

  // for(let item of URL_PATTERN){
  if(window.WebViewJavascriptBridge){
    if(!/\/\w+/.test(URL)){
      window.WebViewJavascriptBridge.callHandler('webViewShowRefreshHeader' ,{}, (response) => {})
    }else{
      window.WebViewJavascriptBridge.callHandler('webViewHideRefreshHeader' ,{}, (response) => {})
    }
  }
}

function getCurrentPcode(url){//(String) -> String

  const URL_PATTERN = [
    {route:/login_and_reg/,pcode:'MD00'},
    {route:/car_series/,pcode:'MB30'},
    {route:/car_model/,pcode:'MB40'},
    {route:/car_shop/,pcode:'MB60'},
    {route:/brand_list/,pcode:'MB20'},
    {route:/car_parity/,pcode:'MB50'},
    {route:/user_center/,pcode:'MP00'},
    {route:/setting/,pcode:'MPS00'},
    {route:/feedback/,pcode:'MPF00'},
    {route:/about_hmc/,pcode:'MPG10'},
    {route:/about/,pcode:'MPG00'},
    {route:/com_problem/,pcode:'MPG20'},
    {route:/protocol/,pcode:'MPG30'},
    {route:/account/,pcode:'MPQ00'},
    {route:/my_inquire_detail/,pcode:'MPB10'},
    {route:/my_inquire/,pcode:'MPB00'},
    {route:/direct_sale_list/,pcode:'MZ20'},
    {route:/direct_sale_detail/,pcode:'MZ30'},
    {route:/direct_sale_inquire/,pcode:'MZ80'},
    {route:/inquire/,pcode:'MB70'},
    {route:/price/,pcode:'MZ40'},
    {route:/my_order_buy_detail/,pcode:'MZA0'},
    {route:/\//,pcode:'MB10'}
  ]
  const URL = url.split('#')[1].toLowerCase()

  let pcode = null

  for(let item of URL_PATTERN){
    if(item.route.test(URL)){
      pcode = item.pcode
      break
    }
  }

  return pcode
}

export async function CollectVisitData(){

  const CurrentUrl = window.location.href
  let pcode = getCurrentPcode(CurrentUrl)
  const EventType = 'visit'

  let userGUID = CheckGUIDIsSet()
  if(!userGUID){
    const NewUserGUID = CalculatGUID()
    SaveUserGUID(NewUserGUID)
    userGUID = NewUserGUID
  }

  if(pcode == 'MD00'){//Header first! We shouldn't resolve everything by coding! We have several other ways! We don't need this code actually!
    const PREV_URL = prevUrl && prevUrl.split('#')[1].toLowerCase()
    if(/car_shop/.test(PREV_URL)){
      pcode = 'MD07'
    }
    if(/user_center/.test(PREV_URL)){
      pcode = 'MD09'
    }
  }

  let getUserPhoneNumber = GetLoginInfo().phoneNumber || '' 

  $.ajax({
    url:DataCollectionUrl,
    data:JSON.stringify({
      curl:CurrentUrl,
      // currentAppVersion:"1.0.11",
      // releaseDate:"2016-04-28 12:06",
      guid:userGUID,
      opcode:EventType,
      pcode: pcode,
      phoneNumber:getUserPhoneNumber,
      poicode: ' ',
      rurl:prevUrl,
      term: Platform,
      ts:new Date().getTime()
    }),
    contentType:"application/json",
    method:'post'
  })
}

export function CollectClickData(data={poicode:'unknown'}){//({opcode:String,poicode:String})

  const CurrentUrl = window.location.href
  const Pcode = getCurrentPcode(CurrentUrl)
  const Opcode = data.opcode || 'click'

  let userGUID = CheckGUIDIsSet()
  if(!userGUID){
    const NewUserGUID = CalculatGUID()
    SaveUserGUID(NewUserGUID)
    userGUID = NewUserGUID
  }

  let getUserPhoneNumber = GetLoginInfo().phoneNumber || '' 
 
  $.ajax({
    url:DataCollectionUrl,
    data:JSON.stringify({
      curl:CurrentUrl,
      // currentAppVersion:"1.0.11",
      // releaseDate:"2016-04-28 12:06",
      guid:userGUID,
      opcode: Opcode,
      pcode: Pcode,
      phoneNumber:getUserPhoneNumber,
      poicode: data.poicode,
      rurl:prevUrl,
      term: Platform,
      ts:new Date().getTime()
    }),
    contentType:"application/json",
    method:'post'
  })
}
