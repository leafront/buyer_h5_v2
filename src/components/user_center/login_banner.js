import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { CollectClickData } from '../../data_collection'
import { GetLoginInfo , DoLogout, GetGlobalConfig } from '../../common'

class LoginBanner extends React.Component {
  constructor(props) {
    super(props)
  }

  doDoLogout() {
    CollectClickData({poicode: 'MP19'})
    DoLogout("/")
  }

  render() {
    const LoginInfo = GetLoginInfo()
    const AccessToken = LoginInfo.accessToken
    const PhoneNumber = LoginInfo.phoneNumber
    const UserName = LoginInfo.userName

    const LoginButton = <Link className="login_button" to={"/login_and_reg/" + this.props.currentPath} onClick={CollectClickData.bind(null, {poicode: 'MP10'})}>登录／注册</Link>
    const LoginUserInfo = (
      <div className="login_user_info">
        <div className="id_phonenumber">
          <p>{UserName}</p>
          <p>{PhoneNumber}</p>
        </div>
        <div className="logout_button">
          <button onClick={this.doDoLogout}>退出账号</button>
        </div>
      </div>
    )
    let loginStatusComp = LoginButton
    if(AccessToken){
      loginStatusComp = LoginUserInfo
    }
    return (
      <div className="login_button_wrapper">
        {loginStatusComp}
      </div>
    )
  }
}

export default LoginBanner
