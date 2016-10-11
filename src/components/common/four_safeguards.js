import React from 'react'

class FourSafeguards extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="four_safeguards">
          <div className="tips_container">
              <div className="tips">
                  <p className="tip">
                      <span>安全</span> 4S店货源，享受质保三包
                  </p>
                  <p className="tip">
                      <span>便宜</span> 批发直销，便宜买得到
                  </p>
                  <p className="tip">
                      <span>方便</span> 上门服务，手续在家办
                  </p>
                  <p className="tip">
                      <span>透明</span> 无隐形消费，单据齐全
                  </p>
              </div>
          </div>
          <div className="icon_container">
              <i className="ico"></i>
          </div>
      </div>
    )
  }
}

export default FourSafeguards
