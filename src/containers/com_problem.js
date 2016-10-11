import React, { PropTypes } from 'react'
import TopBar from '../components/common/top_bar'
import { CollectClickData } from '../data_collection'

class ComProblemContent extends React.Component {
  constructor() {
    super()
    this.state = {
      activeClass1: 'active',
      activeClass2: '',
      activeClass3: '',
      activeClass4: '',
      activeClass5: '',
      activeClass6: '',
      activeClass7: ''
    }
  }

  showDetails(index) {
    let curClassName
    CollectClickData({poicode: 'MPG21'})
    switch(index) {
      case 1:
        curClassName = this.state.activeClass1 ? '' : 'active'
        this.setState({
          activeClass1: curClassName,
          activeClass2: '',
          activeClass3: '',
          activeClass4: '',
          activeClass5: '',
          activeClass6: '',
          activeClass7: ''
        })
        break;
      case 2:
        curClassName = this.state.activeClass2 ? '' : 'active'
        this.setState({
          activeClass1: '',
          activeClass2: curClassName,
          activeClass3: '',
          activeClass4: '',
          activeClass5: '',
          activeClass6: '',
          activeClass7: ''
        })
        break;
      case 3:
        curClassName = this.state.activeClass3 ? '' : 'active'
        this.setState({
          activeClass1: '',
          activeClass2: '',
          activeClass3: curClassName,
          activeClass4: '',
          activeClass5: '',
          activeClass6: '',
          activeClass7: ''
        })
        break;
      case 4:
        curClassName = this.state.activeClass4 ? '' : 'active'
        this.setState({
          activeClass1: '',
          activeClass2: '',
          activeClass3: '',
          activeClass4: curClassName,
          activeClass5: '',
          activeClass6: '',
          activeClass7: ''
        })
        break;
      case 5:
        curClassName = this.state.activeClass5 ? '' : 'active'
        this.setState({
          activeClass1: '',
          activeClass2: '',
          activeClass3: '',
          activeClass4: '',
          activeClass5: curClassName,
          activeClass6: '',
          activeClass7: ''
        })
        break;
      case 6:
        curClassName = this.state.activeClass6 ? '' : 'active'
        this.setState({
          activeClass1: '',
          activeClass2: '',
          activeClass3: '',
          activeClass4: '',
          activeClass5: '',
          activeClass6: curClassName,
          activeClass7: ''
        })
        break;
      case 7:
        curClassName = this.state.activeClass6 ? '' : 'active'
        this.setState({
          activeClass1: '',
          activeClass2: '',
          activeClass3: '',
          activeClass4: '',
          activeClass5: '',
          activeClass6: '',
          activeClass7: curClassName
        })
        break;
    }
  }

  render() {
    return (
      <div className="com_problem_content">
        <ul>
          <li>
              <span className={this.state.activeClass1} onClick={this.showDetails.bind(this, 1)}>你们的车价为什么这么便宜？</span>
              <p className={this.state.activeClass1}>我们做的是批发价，好买车与4S店签了包销协议，每月必须包销一定量，4S店给我们批发价。我们整合了所有4S店的优势资源，4S店有自己的门店有自己的营运成本，但网站没有，这是其一。第二，我们做的是资源整合，利用平台接触更多的购车用户，快进快出，走的是量，这就是价差的原因。</p>
          </li>
          <li>
               <span className={this.state.activeClass2} onClick={this.showDetails.bind(this, 2)}>你们的车子是从哪里来的？</span>
               <p className={this.state.activeClass2}>我们所有车源都是4S店供货。好买车网站是和上海300家4S店合作的一个汽车询价购车平台，平台就是做资源整合和咨询的，所有车源全部都有三包凭证、整车质保，与4S店的新车无任何区别。</p>
          </li>
          <li>
               <span className={this.state.activeClass3} onClick={this.showDetails.bind(this, 3)}>既然你们也是从4S店拿车，那我为什么不直接去4S店？</span>
               <p className={this.state.activeClass3}>您当然可以直接去4S店买车，但是第一，我们网站有300家4S店的库存资源，您买车不可能跑遍全上海，车源上，我们比全上海车源最丰富的4S店还有优势。第二，我们和4S店是签包销协议，走的都是批发渠道，价格我们也有优势。更不用说我们可以提供一条龙的上门服务，所有流程手续您在家好好享受周末就可以办理，不用工作时间请假去4S店排队（4S店财务周末不上班，所有和钱相关的流程手续必须工作日办理）。</p>
          </li>
          <li>
                <span className={this.state.activeClass4} onClick={this.showDetails.bind(this, 4)}>你们和团购有什么区别？</span>
                <p className={this.state.activeClass4}>有本质的区别，首先团购是靠人数去压价，但成交量是不确定的，所以每次团购价格都是有高有低，（例如今年的双十一，某厂方在某猫上靠团购卖了2000台某越轿车，但提车率不足10%，就是因为这次的团购都有提车的附加条件）；而好买车网站是靠每月稳定的包销的销量压低进货价，就像京东的自营商品，价格实惠，品质又有保障，我们是把所有的4S店的资源掌握了再去找合适的车主；其次团购的车型数量少，会让用户去买精装车，我们可以卖裸车；再次，团购有附加的费用，如今已经被包装成打包价，消费很不透明，我们的运营成本低，没有店面，不会有额外的费用产生；</p>
          </li>
          <li>
                <span className={this.state.activeClass5} onClick={this.showDetails.bind(this, 5)}>您们和二级经销商有什么区别？</span>
                <p className={this.state.activeClass5}> 二级经销商其实传统意义叫中介，黄牛，他们其实是二道贩子，先找到用户，再拿用户的需求去找车。但我们直销做的更彻底，我们自建平台，与上海300多家合作经销商共享资源， 我们效率更高，成本更低。所以经销商的收费肯定没有我们便宜，而且我们更保险，经销商可能会出现今天买车明天不见人的情况，但我们花那么大精力做平台，线下签了300多家4S店，不论是从规模还是实力上，我们都比经销商强太多。最后，我们的服务人员比经销商更专业，我们所有线下销售顾问都是高薪从4S店聘请的销售，起码都有4年上的服务经验，可以帮您搞定汽车环节的所有问题。</p>
          </li>
          <li>
                <span className={this.state.activeClass6} onClick={this.showDetails.bind(this, 6)}> 如果在你们平台买车，合同是和谁签呢？ </span>
                <p className={this.state.activeClass6}> 购车时合同是和我们好买车网站签，我们已经与发货4S店协商好，由他们提供发票，敲的也是发货4S店的公章。这么做也是为了让您放心，保证您以后的三包和质保没有任何问题，我们会在您交全款的时候带您去4S店的。</p>
          </li>
          <li>
                <span className={this.state.activeClass7} onClick={this.showDetails.bind(this, 7)}>  在你们这里买车，售后和质保的问题怎么解决？  </span>
                <p className={this.state.activeClass7}> 我们所有销售车辆均由4S店供货，都有详细的三包凭证，质保和售后可以找供货4S店，当然如果需要我们帮助，也可以代为联系，购车结束之后，我们会给到您双重保障，我们可以针对您购买的品牌，在全上海搜索距离最近或价格最优的专营店供选择。售后服务我们为您保驾护航，您可以直接去供货的4S店保养维修，如果您对他家的服务不满意，我们可以另行推荐直到您满意为止，并终生提供服务。</p>
          </li>
        </ul>
      </div>
    )
  }
}

class ComProblem extends React.Component {
  constructor() {
    super()
  }

  render() {
    const hideheader = this.props.params.hideheader
    const style = {marginTop:'-44px'}
    return (
      <div className="com_problem">
        {
          hideheader ? '' : <TopBar pageTitle="常见问题"/>
        }
        {
          hideheader ?
          <div style={style}><ComProblemContent/></div> :
          <ComProblemContent/>
        }
      </div>
    )
  }
}

export default ComProblem
