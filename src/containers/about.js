import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { CollectClickData } from '../data_collection'
import TopBar from '../components/common/top_bar'

class AboutList extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="about_list">
        <ul>
          <li>
            <Link to="/about_hmc" onClick={CollectClickData.bind(null, {poicode: 'MPG01'})}>关于好买车</Link>
          </li>
          <li>
            <Link to="/com_problem" onClick={CollectClickData.bind(null, {poicode: 'MPG02'})}>常见问题</Link>
          </li>
          <li>
            <Link to="/protocol" onClick={CollectClickData.bind(null, {poicode: 'MPG03'})}>服务协议</Link>
          </li>
        </ul>
      </div>
    )
  }
}

class About extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="about">
        <TopBar pageTitle="关于"/>
        <AboutList/>
      </div>
    )
  }
}

export default About
