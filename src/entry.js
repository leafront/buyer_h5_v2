import React, { Component } from 'react'
import { connect } from 'react-redux'
import GlobalLoading from './components/common/global_loading'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
  	  <div className="content_wrap">
          {
            this.props.common.isLoading ? <GlobalLoading /> : null
          }
          { this.props.children }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    common: state.common
  }
}

export default connect(mapStateToProps)(App)
