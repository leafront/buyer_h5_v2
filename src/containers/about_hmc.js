import React, { PropTypes } from 'react'
import TopBar from '../components/common/top_bar'

class AboutHMCContent extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="about_hmc_content">
        <h2><img src={require('../../images/user_center/title.png')}/></h2>
        <p><strong>好买车（www.haomaiche.com）是上海轩言网络信息科技有限公司旗下的“网上比价购车”的O2O电商平台，团队成员拥有将近10年的行业经验，其创新的商业模式不仅获得业内好评，更是被投资人所追捧。</strong></p>
        <h3>我们的定位</h3>
        <h4>网上比价</h4>
        <p><b>&gt;</b>我们只与品牌专营的4S店合作，二级经销商及个人中介不在合作范围内；</p>
        <p><b>&gt;</b>我们提供本地在售的40个汽车品牌、超过400款车型、200家4S店供用户购买选择；</p>
        <p><b>&gt;</b>区别于网上团购和传统4S店，我们通过网上直销，让4S店充分竞争，并主动提供更高透明度的</p>
        <p>报价服务，挤掉多余车价水分，让用户享受优惠的车价与便捷的网上购车服务；</p>
        <h3>我们的服务</h3>
        <h4><b>&gt;</b>网上购买特价车</h4>
        <p>对于一车一价、限量底价的特价车，我们提供网上直售服务，用户可直接网上订车、4S店签单提车；</p>
        <h4><b>&gt;</b>网上询价购买热销车</h4>
        <p>对于一车一价、限量底价的特价车，我们提供网上直售服务，用户可直接网上订车、4S店签单提车；</p>
        <h4><b>&gt;</b>网上询价贷款购车</h4>
        <p>对于有贷款需求的用户，我们提供所有车型的贷款方案计算、贷款银行的预审服务；用户可在搞定贷款后，再通过询价、比价获得优惠的车价，网上订车、4S店签单提车；</p>
        <h3>我们的价值</h3>
        <p><b>&gt;</b>我们将互联网透明、高效机制引入传统汽车销售行业，为用户省去四处跑店、反复议价的沟通成本，得到最优惠的价格；</p>
        <p><b>&gt;</b>我们设置了透明总价原则，让用户购车获得最大的透明度与诚信服务；</p>
        <p><b>&gt;</b>我们制定了交易违约三倍赔付规则，最大程度保障了用户的利益；</p>
        <h3>我们的理念</h3>
        <p><b>&gt;</b>坚持为用户的购买决策提供透明度与诚信保障；</p>
        <p><b>&gt;</b>力求通过互联网创新，平衡用户和商户的利益；</p>
        <div><img src={require('../../images/user_center/license.jpg')}/></div>
      </div>
    )
  }
}

class AboutHMC extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="about_hmc">
        <TopBar pageTitle="关于好买车"/>
        <AboutHMCContent/>
      </div>
    )
  }
}

export default AboutHMC
