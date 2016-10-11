import React from 'react'

import { CollectClickData } from '../../data_collection'

class OptionItem extends React.Component {
  constructor(props) {
    super(props)
  }

  clickDataCodeOption(index,e){
    this.props.optionClicked(index)
    CollectClickData({poicode:this.props.clickDataCode})
  }

  render(){
    let optionItems = []

    this.props.optionItems.forEach((item, index) => {
      // console.log(item.type)
      // if (typeof(item) == 'object' && item.name) {
      //   optionItems.push(
      //     <dd className={this.props.selectedIndex === index ? 'active' : null} onClick={this.props.optionClicked.bind(this, index)}>
      //       { item.name }
      //     </dd>
      //   )
      // } else if (typeof(item) == 'object' && !!item.type) {
      //   optionItems.push(
      //     <dd className={this.props.selectedIndex === index ? 'active' : null} onClick={this.props.optionClicked.bind(this, index)}>
      //       { item.type }
      //     </dd>
      //   )
      // } else {
      // console.log(item)
        optionItems.push(
          <dd className={this.props.selectedIndex === index ? 'active' : null} onClick={this.clickDataCodeOption.bind(this,index)}>
            { item }
          </dd>
        )
      // }
    })

    return (
      <dl className={ this.props.optionClassName }>
        <dt>{ this.props.optionName }</dt>
        { optionItems }
      </dl>
    )
  }
}

export default OptionItem
