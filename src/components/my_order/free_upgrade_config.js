import React from 'react'
import {GetLocalStorageInfo} from '../../common'

class FreeUpgradeConfig extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const CityCode = GetLocalStorageInfo('HMC_USER_CURRENT_CITY').cityCode
    if(CityCode=='330100'){
      return null;
    }
    return (
      <div className="free_upgrade_config">
        <div className="container">
          <img src={require('../../../images/my_order/gift.jpg')}/>
        </div>
      </div>
    )
  }
}

export default FreeUpgradeConfig
