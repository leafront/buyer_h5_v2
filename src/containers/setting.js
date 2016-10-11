import React, { PropTypes } from 'react'
import TopBar from '../components/common/top_bar'
import { CollectClickData } from '../data_collection'

class SettingList extends React.Component {
  constructor(){
    super()
    this.state = {
      cache: 0
    }
  }

  clearData(){
      CollectClickData({poicode: 'MPS02'})
      window.localStorage.clear();
      /*App.isHybird() && window.WebViewJavascriptBridge.callHandler('clearCache', {}, function (response) {
          if(response == "1"){
              self.$el.html(_.template(tpl)({"cache":"0M"}));
          }
      })*/
  }

  render() {
    return (
      <div className="setting_list">
        <p onClick={this.clearData.bind(this)}><span>清除缓存</span><span>{this.state.cache}M</span></p>
      </div>
    )
  }
}

class Setting extends React.Component {
  constructor(){
    super()
  }

  render(){
    return (
      <div className="setting">
        <TopBar pageTitle="设置"/>
        <SettingList/>
      </div>
    )
  }
}

export default Setting
