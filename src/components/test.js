import React, { Component } from 'react'

class Test extends Component {
  constructor() {
    super()
  }

  render() {
    let styles = {
      width: '80%',
      height: '30px',
      textAlign: 'center',
      lineHeight: '30px',
      fontSize: '1.6rem',
      color: '#fff',
      backgroundColor: '#FA4D4D',
      display: 'block',
      margin: '0 auto 10px',
      borderRadius: '6px'
    }

    let callbacks = {
      getDeviceIdentify: function() {
        window.WebViewJavascriptBridge.callHandler('getDeviceIdentify', {}, function(response) {
          alert(response)
        })
      },
      callPhone: function() {
        window.WebViewJavascriptBridge.callHandler('callPhone', {'title':'demo','message':'this is demo','phone':'13512341234'}, function(response) {
          alert(response)
        })
      },
      IMsupported: function() {
        window.WebViewJavascriptBridge.callHandler('IMsupported', {}, function(response) {
          alert(response)
        })
      },
      share: function() {
        window.WebViewJavascriptBridge.callHandler('share', {'Pic':'a.jpg','Url':'http://www.baidu.com','Title':'demo','Desc':'this is demo','Type':'1'}, function(response) {
          alert(response)
        })
      },
      clearLogin: function() {
        window.WebViewJavascriptBridge.callHandler('clearLogin', {}, function(response) {
          alert(response)
        })
      },
      getCache: function() {
        window.WebViewJavascriptBridge.callHandler('getCache', {}, function(response) {
          alert(response)
        })
      },
      clearCache: function() {
        window.WebViewJavascriptBridge.callHandler('clearCache', {}, function(response) {
          alert(response)
        })
      },
      closeCache: function() {
        window.WebViewJavascriptBridge.callHandler('closeCache', {"url":''}, function(response) {
          alert(response)
        })
      },
      location: function() {
        window.WebViewJavascriptBridge.callHandler('location', {}, function(response) {
          alert(response)
        })
      },
      pay: function() {
        window.WebViewJavascriptBridge.callHandler('pay', {}, function(response) {
          alert(response)
        })
      },
      cutScreen: function() {
        window.WebViewJavascriptBridge.callHandler('cutScreen', {}, function(response) {
          alert(response)
        })
      },
      goContactServicePage: function() {
        window.WebViewJavascriptBridge.callHandler('goContactServicePage', {}, function(response) {
          alert(response)
        })
      }
    }

    return (
      <div>
        <button style={styles} onClick={callbacks.getDeviceIdentify.bind(this)}>getDeviceIdentify</button>
        <button style={styles} onClick={callbacks.callPhone.bind(this)}>callPhone</button>
        <button style={styles} onClick={callbacks.IMsupported.bind(this)}>IMsupported</button>
        <button style={styles} onClick={callbacks.share.bind(this)}>share</button>
        <button style={styles} onClick={callbacks.clearLogin.bind(this)}>clearLogin</button>
        <button style={styles} onClick={callbacks.getCache.bind(this)}>getCache</button>
        <button style={styles} onClick={callbacks.clearCache.bind(this)}>clearCache</button>
        <button style={styles} onClick={callbacks.closeCache.bind(this)}>closeCache</button>
        <button style={styles} onClick={callbacks.location.bind(this)}>location</button>
        <button style={styles} onClick={callbacks.pay.bind(this)}>pay</button>
        <button style={styles} onClick={callbacks.cutScreen.bind(this)}>cutScreen</button>
        <button style={styles} onClick={callbacks.goContactServicePage.bind(this)}>goContactServicePage</button>
      </div>
    )
  }
}

export default Test
