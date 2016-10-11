import React from 'react'
import { Link } from 'react-router'

import { CollectClickData } from '../../data_collection'

class BottomNavButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let page = this.props.page
    return (
      <div className="bottom_nav_button">
        <Link to="/" className={ "nav_home " + (page == 'home' ? 'current' : '') } ><span>主页</span></Link>
        <Link to="/brand_list" onClick={CollectClickData.bind(null,{poicode:'MA06'})} className={ "nav_inquire " + (page == 'inquire' ? 'current' : '') }><span>比价</span></Link>
        <Link to="/direct_sale_list" onClick={CollectClickData.bind(null,{poicode:'MA07'})} className={ "nav_direct_sale " + (page == 'direct_sale' ? 'current' : '') }><span>直销</span></Link>
        <Link to="/user_center" onClick={CollectClickData.bind(null,{poicode:'MA05'})} className={ "nav_mine " + (page == 'mine' ? 'current' : '') }><span>我的</span></Link>
      </div>
    )
  }
}

export default BottomNavButton
