import React, { PropTypes } from 'react'
import { CollectClickData } from '../../data_collection'
import { GetGlobalConfig } from '../../common'
import 'whatwg-fetch'

class Feedback extends React.Component {
  constructor() {
    super()
    this.state = {
      adviseComment: '',
      adviseTags: [],
      /*adviseTags: [
        {clicked: false, tag: '价格没优势', index: 0},
        {clicked: false, tag: '产品不好用', index: 1},
        {clicked: false, tag: '找车不方便', index: 2},
        {clicked: false, tag: '价格不真实', index: 3},
        {clicked: false, tag: '操作太繁琐', index: 4}
      ],*/
      adviseContent: '',
      adviseLinkWay: ''
    }
  }

  async componentDidMount() {
    const Response = await fetch(GetGlobalConfig().env + '/api/webadvise/getAdviseTags', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    })
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    const Status = await ResponseJSON.status

    if (ResponseOK && Status === 1) {
      let adviseTags = null

      if (ResponseJSON.data && ResponseJSON.data.length > 0) {
        adviseTags =  ResponseJSON.data.map((item, index) => {
          return {clicked: false, tag: item.webAdviseFlagName, index: index}
        })
        this.setState({
          adviseTags: adviseTags
        })
      }
    }
  }

  resetFeedbackState() {
    let that = this
    let adviseTags =  this.state.adviseTags.map((item, index) => {
      return {clicked: false, tag: item.tag, index: index}
    })
    this.props.onHideFeedback()
    setTimeout(function() {
      that.setState({
        adviseComment: '',
        adviseTags: adviseTags,
        adviseContent: '',
        adviseLinkWay: ''
      })
    }, 1100)
  }

  changeAdviseComment(type) {
    this.setState({adviseComment: type})
  }

  toggleAdviseTags(val) {
    this.state.adviseTags.map((item) => {
      if (item.index == val) {
        this.state.adviseTags[val].clicked = !item.clicked
        this.setState({adviseTags: this.state.adviseTags})
      }
    })
  }

  showTocaoBtn() {
    let items = this.state.adviseTags.map((item) => {
      let activeClass = ''
      if (item.clicked) {
        activeClass = 'active'
      } else {
        activeClass = ''
      }
      return <li className={activeClass} onClick={this.toggleAdviseTags.bind(this, item.index)}>{item.tag}</li>
    })

    return (
      <div>
        {items}
      </div>
    )
  }

  changeAdviseContent(e) {
    CollectClickData({poicode: 'MPF01'})
    this.setState({adviseContent: e.target.value})
  }

  changeAdviseLinkWay(e) {
    CollectClickData({poicode: 'MPF01'})
    this.setState({adviseLinkWay: e.target.value})
  }

  getSendSource() {
    let source
    const platform = GetGlobalConfig.platform
    switch(platform) {
      case 'h5':
        source = '2'
        break
      case 'ios':
        source = '3'
        break
      case 'android':
        source = '4'
        break
      default:
        source = '2'
    }
    return source
  }

  async submit(adviseTags) {
    let source = this.getSendSource()
    const Response = await fetch(GetGlobalConfig().env + '/api/webadvise/addWebAdviseInfo', {
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: 'userId=&adviseComment=' + this.state.adviseComment + '&adviseTags=' + adviseTags
        + '&adviseOrigin=' + source + '&adviseLinkWay=' + this.state.adviseLinkWay + '&adviseContent=' + this.state.adviseContent,
      method: 'POST'
    })
    const ResponseOK = await Response.ok
    const ResponseJSON = await Response.json()
    const Status = await ResponseJSON.status
    if (ResponseOK && Status === 1) {
      //console.log(ResponseJSON)
      this.resetFeedbackState()
      this.props.showAttentionMessage('感谢您对好买车的支持，我们将尽快处理您的反馈')
    } else {
      this.props.showAttentionMessage('您的输入不合法')
    }
  }

  submitFeedback() {
    CollectClickData({poicode: 'MPF02'})
    if (this.state.adviseComment == '') {
      this.props.showAttentionMessage('请选择对我们的评价')
    } else {
      let adviseTags = []
      for (var i = 0; i < this.state.adviseTags.length; i++) {
        if (this.state.adviseTags[i].clicked == true) {
          adviseTags.push(this.state.adviseTags[i].tag)
        }
      }
      this.submit(adviseTags.join())
    }
  }

  render() {
    let comment = this.state.adviseComment
    let color = ''
    let commentAClass, commentBClass, commentCClass
    let tocaoTab = this.showTocaoBtn()
    let enterClass = this.props.animation.enter ? 'enter': ''
    let leaveClass = this.props.animation.leave ? 'leave': ''

    switch(comment) {
      case '':
        color = 'A'
        commentAClass = ''
        commentBClass = ''
        commentCClass = ''
        break;
      case '1':
        color = 'A'
        commentAClass = 'active'
        commentBClass = ''
        commentCClass = ''
        break;
      case '2':
        color = 'B'
        commentAClass = ''
        commentBClass = 'active'
        commentCClass = ''
        break;
      case '3':
        color = 'C'
        commentAClass = ''
        commentBClass = ''
        commentCClass = 'active'
        break;
    }

    return (
      <div className="feedback_wrapper">
        <div className={"shadow " + enterClass + " " + leaveClass}></div>
        <div className={"feedback_content color" +  color + " " + enterClass + " " + leaveClass}>
          <div className="close" onClick={this.resetFeedbackState.bind(this)}></div>
          <div className="animation">
                <div className="abg">
                  <img className="atree" src={require('../../../images/feedback/atree.png')}/>
                  <img className="ainfo" src={require('../../../images/feedback/ainfo.png')}/>
                  <img className="amoon" src={require('../../../images/feedback/amoon.png')}/>
                  <img className="astar" src={require('../../../images/feedback/astar.png')}/>
                </div>
                <div className="bbg">
                  <img className="btree" src={require('../../../images/feedback/btree.png')}/>
                  <img className="bsun" src={require('../../../images/feedback/bsun.png')}/>
                  <img className="bcloud1" src={require('../../../images/feedback/bcloud1.png')}/>
                  <img className="bcloud2" src={require('../../../images/feedback/bcloud2.png')}/>
                  <img className="bcloud3" src={require('../../../images/feedback/bcloud3.png')}/>
                  <img className="binfo" src={require('../../../images/feedback/binfo.png')}/>
                </div>
                <div className="cbg">
                  <img className="ctree" src={require('../../../images/feedback/ctree.png')}/>
                  <img className="cinfo" src={require('../../../images/feedback/cinfo.png')}/>
                  <img className="csun" src={require('../../../images/feedback/bsun.png')}/>
                  <img className="ccloud1" src={require('../../../images/feedback/bcloud1.png')}/>
                  <img className="ccloud2" src={require('../../../images/feedback/bcloud2.png')}/>
                  <img className="ccloud3" src={require('../../../images/feedback/bcloud3.png')}/>
                </div>
                <div className="car-container">
                  <img className="gas" src={require('../../../images/feedback/gas.png')}/>
                  <img className="car" src={require('../../../images/feedback/car.png')}/>
                  <img className="alight" src={require('../../../images/feedback/alight.png')}/>
                </div>
          </div>
          <div className="item comment">
            <p>＊评价</p>
            <ul>
              <li className={"dislike " + commentAClass} onClick={this.changeAdviseComment.bind(this, '1')}>朕不喜欢</li>
              <li className={"normal " + commentBClass} onClick={this.changeAdviseComment.bind(this, '2')}>朕觉得一般</li>
              <li className={"satisfy " + commentCClass} onClick={this.changeAdviseComment.bind(this, '3')}>朕很满意</li>
            </ul>
          </div>
          <div className="item tucao">
            <p>来吐槽</p>
            <ul>
              {tocaoTab}
            </ul>
          </div>
          <div className="item improve">
            <p>改进意见</p>
            <textarea placeholder="说说您的对我们的改进意见吧~" maxlength="500" onInput={this.changeAdviseContent.bind(this)} value={this.state.adviseContent}></textarea>
          </div>
          <div className="item contact">
            <p>联系方式</p>
            <input type="text" placeholder="留下联系方式，方便我们联系您~" onInput={this.changeAdviseLinkWay.bind(this)} value={this.state.adviseLinkWay}/>
            <span onClick={this.submitFeedback.bind(this)}>提交</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Feedback
