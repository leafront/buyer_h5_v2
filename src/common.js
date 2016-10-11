import { hashHistory } from 'react-router'
import { GLOBAL_API_DOMAIN } from './config'

//city function
export function SaveUserLocation(cityCode){
  SetLocalStorageInfo('HMC_USER_CURRENT_CITY',{cityCode:cityCode})
}

export function CalculatGUID() {// 生成页面的假的唯一标示，因为我根本不懂什么是唯一标示，所以我猜就是这么写的，我就是辣么屌，这个世界上像我这么屌的还有一个，那个人叫明哥，前端届大牛，不信你们自己搜!
  let guid = ""
  for (let i = 1; i <= 32; i++) {
    let n = Math.floor(Math.random() * 16.0).toString(16)
    guid += n
    if ((i == 8) || (i == 12) || (i == 16) || (i == 20)){
      guid += "-"
    }
  }
  return guid
}
export function GetQueryStringFromSearchByName(name){
  let result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)","i"))
  if(result == null || result.length < 1){
    return ""
  }
  return result[1]
}
export function GetQueryStringByName(name){
  let result = location.hash.match(new RegExp("[\?\&]" + name + "=([^\&]+)","i"))
  if(result == null || result.length < 1){
    return ""
  }
  return result[1]
}
export async function GetUserLocation(){
  //hangzhou:330100//shanghai:310000
  let cityCode = 310000
  let userCurrentCityCode = CheckUserLocationIsSet()

  const queryCityCode = parseInt(GetQueryStringByName('cityCode'),10)

  if(!!queryCityCode){
    SaveUserLocation(queryCityCode)
    return false
  }

  if(userCurrentCityCode) return false

  SaveUserLocation(310000)

  const Response = await fetch(GetGlobalConfig().env + '/hybrid/ask/getIPCode',{
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    method:'POST'
  })
  const ResponseOK = await Response.ok
  const ResponseJSON = await Response.json()
  if(ResponseOK){
    cityCode = Number(ResponseJSON.data)
    SaveUserLocation(cityCode)
  }
}

export function CheckGUIDIsSet(){//->String?
  let currentGUID = GetLocalStorageInfo('HMC_USER_GUID') && GetLocalStorageInfo('HMC_USER_GUID').userGUID
  return currentGUID
}

export function SaveUserGUID(userGUID){
  const HMC_USER_GUID = {
    userGUID:userGUID
  }
  SetLocalStorageInfo('HMC_USER_GUID',HMC_USER_GUID)
}

export function CheckUserLocationIsSet(){//->Number?
  let currentCity = GetLocalStorageInfo('HMC_USER_CURRENT_CITY') && GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
  return currentCity
}

//format function
export function ConvertObjectToQueryString(dataObject){//->String
  let convertedString = ''
  for(let i = 0; i < Object.keys(dataObject).length; i++){
    if(i > 0) {
      convertedString += '&'
    }
    convertedString += (Object.keys(dataObject)[i] + '=' + dataObject[Object.keys(dataObject)[i]])
  }
  return convertedString
}

export function CalculateDiscount(originalPrice,discountPrice){//->String
  return (originalPrice / discountPrice * 10).toFixed(1)
}

export function FormatNumberWithComma(priceNumber){//->String
  let numberSplitArray = String.prototype.split.call(priceNumber,'')
  let formatedNumber = ''

  for(let i = numberSplitArray.length - 1 , commaIndex = 3; i >= 0; i--){
    if(commaIndex === 0){
      formatedNumber = ',' + formatedNumber
      commaIndex = 3;
    }
    commaIndex--
    formatedNumber = numberSplitArray[i] + formatedNumber
  }
  return formatedNumber
}

export function ConvertPriceToTenThousand(priceNumber){//->Number
  let priceNumberToTenThousand = priceNumber / 10000
  let priceNumberToTenThousandResult = priceNumberToTenThousand.toString()
  let howManyLeft = 5
  for(var i = priceNumberToTenThousandResult.length; i < howManyLeft; i++){
    priceNumberToTenThousandResult += '0'
  }

  return priceNumberToTenThousandResult
}

export function ConvertPriceToLargerNumber(priceNumber){
  return (Math.ceil(priceNumber / 100)) / 100
}

export function SaveLoginInfo(loginInfo = {accessToken:"",refreshToken:"",phoneNumber:"",userName:""}){
  const HMC_ACCESS_TOKEN = {
    accessToken:loginInfo.accessToken,
    accessTokenExpiresIn:loginInfo.accessTokenExpiresIn + new Date().getTime()
  }
  const HMC_REFRESH_TOKEN = {
    refreshToken:loginInfo.refreshToken,
    refreshTokenExpiresIn:loginInfo.refreshTokenExpiresIn + new Date().getTime()
  }
  const HMC_USER_LOGIN_INFO = {
    phoneNumber:loginInfo.phoneNumber
  }
  const HMC_USER_NAME = {
    userName:loginInfo.userName
  }

  SetLocalStorageInfo('HMC_ACCESS_TOKEN',HMC_ACCESS_TOKEN)
  SetLocalStorageInfo('HMC_REFRESH_TOKEN',HMC_REFRESH_TOKEN)
  SetLocalStorageInfo('HMC_USER_LOGIN_INFO',HMC_USER_LOGIN_INFO)
  SetLocalStorageInfo('HMC_USER_NAME',HMC_USER_NAME)

  // window.localStorage.HMC_ACCESS_TOKEN = JSON.stringify(HMC_ACCESS_TOKEN)
  // window.localStorage.HMC_REFRESH_TOKEN = JSON.stringify(HMC_REFRESH_TOKEN)
  // window.localStorage.HMC_USER_LOGIN_INFO = JSON.stringify(HMC_USER_LOGIN_INFO)
  // window.localStorage.HMC_USER_NAME = JSON.stringify(HMC_USER_NAME)

  if(loginInfo.highLevelAccessToken){
    const HMC_HIGH_LEVEL_ACCESS_TOKEN = {
      highLevelAccessToken:loginInfo.highLevelAccessToken
    }
    SetLocalStorageInfo('HMC_HIGH_LEVEL_ACCESS_TOKEN',HMC_HIGH_LEVEL_ACCESS_TOKEN)
  }
}

//#storage function
function removeRefreshToke(){
  localStorage.removeItem('HMC_REFRESH_TOKEN')
}
function removeAccessToken(){
  localStorage.removeItem('HMC_ACCESS_TOKEN')
}
function removeHighLevelAccessToken(){
  localStorage.removeItem('HMC_HIGH_LEVEL_ACCESS_TOKEN')
}
function removeUserName(){
  localStorage.removeItem('HMC_USER_NAME')
}
//use this function to get localStorageItem
export function GetLocalStorageInfo(localStorageItem){//->Object
  if(localStorage[localStorageItem]){
    return JSON.parse(localStorage[localStorageItem])
  }
  return null
}
export function SetLocalStorageInfo(localStorageKey,infoObject){
  window.localStorage[localStorageKey] = JSON.stringify(infoObject)
}

//login function
// function SetAccessTokenToHeader(){
//   let HMC_ACCESS_TOKEN = null
//   let HMC_HIGH_LEVEL_ACCESS_TOKEN = null
//
//   if(localStorage.HMC_ACCESS_TOKEN){
//     HMC_ACCESS_TOKEN = JSON.parse(localStorage.HMC_ACCESS_TOKEN).accessToken
//   }
// }

function removeUserLoginInfo(){
  removeAccessToken()
  removeHighLevelAccessToken()
  removeUserName()
}

function checkLoginExpire(){
  // if token is expired remove it
  const CurrentTime = new Date().getTime()
  //
  const AccessTokenExpireDate = GetLocalStorageInfo('HMC_ACCESS_TOKEN') && GetLocalStorageInfo('HMC_ACCESS_TOKEN').accessTokenExpiresIn

  if(AccessTokenExpireDate && CurrentTime > AccessTokenExpireDate){
    removeAccessToken()
  }

  const RefreshTokenExpireDate = GetLocalStorageInfo('HMC_REFRESH_TOKEN') && GetLocalStorageInfo('HMC_REFRESH_TOKEN').refreshTokenExpiresIn
  if(RefreshTokenExpireDate && CurrentTime > RefreshTokenExpireDate){
    removeRefreshToke()
  }

  const HighLevelAccessTokenExpireDate = GetLocalStorageInfo('HMC_HIGH_LEVEL_ACCESS_TOKEN') && GetLocalStorageInfo('HMC_HIGH_LEVEL_ACCESS_TOKEN').highLevelAccessTokenExpiresIn
  if(HighLevelAccessTokenExpireDate && CurrentTime > HighLevelAccessTokenExpireDate){
    removeHighLevelAccessToken()
  }
}

export function CheckLogin(){
  checkLoginExpire()

  const HMC_ACCESS_TOKEN = GetLocalStorageInfo('HMC_ACCESS_TOKEN') && GetLocalStorageInfo('HMC_ACCESS_TOKEN').accessToken

  return !!HMC_ACCESS_TOKEN
}

export function CheckHighLevelLogin(){
  checkLoginExpire()

  const HMC_HIGH_LEVEL_ACCESS_TOKEN = GetLocalStorageInfo('HMC_HIGH_LEVEL_ACCESS_TOKEN') && GetLocalStorageInfo('HMC_HIGH_LEVEL_ACCESS_TOKEN').highLevelAccessToken

  // console.log(HMC_HIGH_LEVEL_ACCESS_TOKEN)
  return !!HMC_HIGH_LEVEL_ACCESS_TOKEN
}

export function GetLoginInfo(){
  const phoneNumber = GetLocalStorageInfo('HMC_USER_LOGIN_INFO') && GetLocalStorageInfo('HMC_USER_LOGIN_INFO').phoneNumber

  const refreshToken = GetLocalStorageInfo('HMC_REFRESH_TOKEN') && GetLocalStorageInfo('HMC_REFRESH_TOKEN').refreshToken
  // }
  const accessToken = GetLocalStorageInfo('HMC_ACCESS_TOKEN') && GetLocalStorageInfo('HMC_ACCESS_TOKEN').accessToken
  const highLevelAccessToken = GetLocalStorageInfo('HMC_HIGH_LEVEL_ACCESS_TOKEN') && GetLocalStorageInfo('HMC_HIGH_LEVEL_ACCESS_TOKEN').highLevelAccessToken
  // console.log(phoneNumber);
  const userName = GetLocalStorageInfo('HMC_USER_NAME') && GetLocalStorageInfo('HMC_USER_NAME').userName

  return {
    phoneNumber:phoneNumber,
    refreshToken:refreshToken,
    accessToken:accessToken,
    highLevelAccessToken:highLevelAccessToken,
    userName:userName
  }
}

export function DoLogout(redirectTo = null){
  removeUserLoginInfo()
  if(!!redirectTo){
    window.location.href = redirectTo
  }
}

export function SaveAccessToken(tokenData){
  const HMC_ACCESS_TOKEN = {
    accessToken:tokenData.accessToken,
    accessTokenExpiresIn:tokenData.accessTokenExpiresIn + new Date().getTime()
  }
  SetLocalStorageInfo('HMC_ACCESS_TOKEN',HMC_ACCESS_TOKEN)
}

export function SaveHighLevelAccessToken(tokenData){
  const HMC_HIGH_LEVEL_ACCESS_TOKEN = {
    highLevelAccessToken:tokenData.highLevelAccessToken,
    highLevelAccessTokenExpiresIn:tokenData.highLevelAccessTokenExpiresIn + new Date().getTime()
  }
  SetLocalStorageInfo('HMC_HIGH_LEVEL_ACCESS_TOKEN',HMC_HIGH_LEVEL_ACCESS_TOKEN)
}

//config function
export function GetGlobalConfig(){
  return {
    platform:getPlatformFromUA(),
    env:GetEnv()
  }
}

function getPlatformFromUA(){
  const platformENUM = ["h5","ios","android","app"]
  const UA = window.navigator.userAgent.toLocaleLowerCase()
  let thePlatform = platformENUM[0]

  if(/hmchybrid/.test(UA)){
    thePlatform = platformENUM[3]
    if(/iphone|ipad|ipod/.test(UA)) {
      thePlatform = platformENUM[1]
    }
    if(/android/.test(UA)) {
      thePlatform = platformENUM[2]
    }
  }
  return thePlatform
}

function GetEnv(){
  // return 'http://api.easybuycar.com'
  /************************* TMP ***********************/
  return GLOBAL_API_DOMAIN
  // console.log(GLOBAL_API_DOMAIN)
  // const env = window.location.href;
  // const ApiLink = {
  //   qa:'http://yoda.hmc.com:10090',
  //   release:'http://api.easybuycar.com',
  //   production:'http://api.haomaiche.com'
  // }
  // return ApiLink.qa
  // if (env.indexOf('localhost') > -1 || env.indexOf('file:') > -1 || env.indexOf('10.0.0.10') > -1 || env.indexOf('yoda.hmc.com') > -1) {
  //   return ApiLink.release
  // } else if (env.indexOf('easybuycar.com') > -1) {
  //   return ApiLink.release
  // }
  // return ApiLink.production
}

//IM
export function CallPhone() {
  var userAgent = window.navigator.userAgent.toLocaleLowerCase();
  if(window.WebViewJavascriptBridge && window.WebViewJavascriptBridge.callHandler && /hmcimsupport/.test(userAgent)){
    _goContactService();
  }else{
    _goMakeServicePhoneCall();
  }
}

function _goContactService(){
  let userInfo = GetLoginInfo();
  let phoneNumber = userInfo && userInfo.phoneNumber || "";
  let currentUrl = window.location.href;
  let theDataObjectOfUser = {
    id:"",//
    title:"",//品牌+车型+生成时间
    brandId:"",
    brandName:"",
    carTypeId:"",
    carTypeName:"",
    carModelId:"",
    carModelName:"",
    orderCreatedTime:"",
    orderTitle:"",//订单号
    price:"",//指导价
    desc:"",//款型
    itemUrl:"",//当前页面链接
    queueName:"KEFU",//DCC,KEFU
    totalPrice:"",
    judgeMsg:"0",//是否发送车型信息
    itemUrl:currentUrl,
    phoneNumber:phoneNumber
  }

  window.WebViewJavascriptBridge.callHandler('goContactServicePage', {}, function(response) {});
}

function _goMakeServicePhoneCall() {
  easemobim.bind({
      tenantId: 15993,
      appKey: "haomaiche#haomaiche",
      to: "758l9c1yl5",
      xmppServer: "im-api.easemob.com",
      restServer: "a1.easemob.com",
      buttonText: "快联系我"
  });
  window.location.href = './webim/im.html?tenantId=15993&emgroup=KEFU';
}

export function convertNum(num) {
  var list = new String(num).split('').reverse();
  for(var i = 0; i < list.length; i++){
    if(i % 4 == 3){
      list.splice(i, 0, ',');
    }
  }
  return list.reverse().join('');
}

export function convertFormat(value) {
  return value < 10 ? '0' + value : value;
}

export function carInsurancePrice(carPrice){

  return carInsurance = 950 + [( 2109 + carPrice * 0.0141) * 1.15] * 0.855

}
