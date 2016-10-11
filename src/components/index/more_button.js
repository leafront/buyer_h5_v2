import React from 'react'
import { Link } from 'react-router'
import { CollectClickData } from '../../data_collection'

class MoreButton extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <div className="more_button">
        <Link to="/brand_list" className="more_btn" onClick={CollectClickData.bind(null,{poicode:'MB16'})}>更多车型</Link>
      </div>
    )
  }
}

export default MoreButton
