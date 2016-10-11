import React, { PropTypes } from 'react'
import TopBar from '../components/common/top_bar'
import BottomOptionButton from '../components/common/bottom_option_button'
import AttentionMessage from '../components/common/attention_message'
import BottomNavButton from '../components/common/bottom_nav_button'
import Feedback from '../components/user_center/feedback'
import LoginBanner from '../components/user_center/login_banner'
import UserOptions from '../components/user_center/user_options'
import { CollectClickData } from '../data_collection'

class UserCenter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUserId: props.params.userName,
      currentPath: props.route.path,
      showFeedback: false,
      attetionMessage: {
        isAttentionMessageVisible: false,
        attentionMessageText: null
      },
      animation: {
        enter: false,
        leave: false
      }
    }
  }

  async showAttentionMessage(message = null) {
    if (this.state.attetionMessage.isAttentionMessageVisible) {
      return false
    }
    this.setState({
      attetionMessage:{
        isAttentionMessageVisible: true,
        attentionMessageText: message
      }
    })
    await setTimeout(() => {
      this.setState({
        attetionMessage: {
          isAttentionMessageVisible: false,
          attentionMessageText: null
        }
      })
    }, 1500)
  }

  showFeedback() {
    CollectClickData({poicode: 'MP15'})
    this.setState({animation: {
        enter: true,
        leave: false
      }
    })
  }

  hideFeedback() {
    this.setState({animation: {
        enter: false,
        leave: true
      }
    })
  }

  render() {
    return (
      <div className="user_center">
        <TopBar pageTitle="我的个人中心" currentRoute={this.props.route.path}/>
        <LoginBanner currentPath={this.state.currentPath}/>
        <UserOptions onShowFeedback={this.showFeedback.bind(this)}/>
        <BottomNavButton page="mine" />
        <Feedback
          onHideFeedback={this.hideFeedback.bind(this)}
          showAttentionMessage={this.showAttentionMessage.bind(this)}
          showFeedback={this.state.showFeedback}
          animation={this.state.animation}
        />
        <AttentionMessage attetionMessage={this.state.attetionMessage}/>
      </div>
    )
  }
}

export default UserCenter
