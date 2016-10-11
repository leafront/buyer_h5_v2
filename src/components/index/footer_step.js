import React from 'react'
import { Link } from 'react-router'

class FooterStep extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <div className="footer">
        <dl>
          <dt className="five_step_slogen"></dt>
          <dd>
            <div className="step_desc">
              <h5>步骤1</h5>
              <p>选车找店比价</p>
            </div>
          </dd>
          <dd>
            <div className="step_desc">
              <h5>步骤2</h5>
              <p>获得多家真实报价</p>
            </div>
          </dd>
          <dd>
            <div className="step_desc">
              <h5>步骤3</h5>
              <p>对比报价联系销售</p>
            </div>
          </dd>
          <dd>
            <div className="step_desc">
              <h5>步骤4</h5>
              <p>支付订金锁定报价</p>
            </div>
          </dd>
          <dd>
            <div className="step_desc">
              <h5>步骤5</h5>
              <p>免费协助提车</p>
            </div>
          </dd>
        </dl>
      </div>
    )
  }
}

export default FooterStep
