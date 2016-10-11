import React from 'react'
import MyInquireItem from './my_inquire_item'

class MyInquireList extends React.Component {
  constructor() {
    super()
  }

  render() {
    let items = this.props.lists.map((item) => {
      return (
        <MyInquireItem
          item={item}
          now={this.props.now}
          elapsedTime={this.props.elapsedTime}
        />
      )
    })

    return (
      <div className="my_inquire_list">
        {items}
      </div>
    )
  }
}

export default MyInquireList
