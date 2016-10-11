import React from 'react'

import { CollectClickData } from '../../data_collection'


class TabsControl extends React.Component{

  constructor(){
    super()
    this.state = {
      currentIndex : 0
    }
  }

  check_title_index(index){
    return index === this.state.currentIndex ? "tab_title active" : "tab_title"
  }

  check_item_index(index){
    return index === this.state.currentIndex ? "tab_item show" : "tab_item"
  }

  render(){
    return(
      <div>
        <div className="tab_title_wrap">
          { React.Children.map( this.props.children , (element,index) => {
            return(
              <div onClick={ () => { this.setState({currentIndex : index}) } } className={ this.check_title_index(index) }>{ element.props.name }</div>
            )
          })}
        </div>
        <div className="tab_item_wrap">
          {React.Children.map(this.props.children,(element,index)=>{
            return(
              <div className={ this.check_item_index(index) }>{ element }</div>
            )
          })}
        </div>
      </div>
    )
  }
}


class DirectFlow extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    return (
      <div className="flow">
        <div className="method">
          <img src={require('../../../images/direct_sale_detail/function.png')}/>
        </div>
        <div className="staff">
          <img src={require('../../../images/direct_sale_detail/staff.png')}/>
        </div>
        <div className="flow">
          <img src={require('../../../images/direct_sale_detail/flow.jpg')}/>
        </div>
      </div>
    )
  }
}

class DirectService extends React.Component {
  constructor(props){
    super(props)
  }
  render(){

    // <div className="service">
    //   <img src={require('../../images/direct_sale_detail/qualifications.png')}/>
    // </div>
    return (
      <div className="serviceAdvantage">
        <div className="guarantee">
          <img src={require('../../../images/direct_sale_detail/guarantee.jpg')}/>
        </div>
      </div>
    )
  }
}


//NOT SHOWING NOW
// class CarModelInfo extends React.Component{
//   constructor(props) {
//     super(props)
//   }
//   render(){
//     return (
//       <div>
//         {this.props.carDetailList[this.props.currentCarModelIndex].modelPicsHtml}
//       </div>
//     )
//   }
// }

class CarProperties extends React.Component{
  constructor(props) {
    super(props)
  }
  render(){
    if(!this.props.carDetailList[this.props.currentCarModelIndex].carModelConfig){
      return null
    }
    let carDetailConf = this.props.carDetailList[this.props.currentCarModelIndex].carModelConfig
    let tables = []
    let carDetailConfArray = [
      {
        title:'基本参数',
        props:[
          {name:'发动机',value:carDetailConf.modelEngine},
          {name:'变速箱',value:carDetailConf.modelGearbox},
          {name:'长*宽*高(mm)',value:carDetailConf.modelDepth + '*' + carDetailConf.modelWidth + '*' + carDetailConf.modelHight},
          {name:'车身结构',value:carDetailConf.modelBody},
          {name:'最高车速(km/h)',value:carDetailConf.modelSpeedlimit},
          {name:'官方0-100km/h加速(s)',value:carDetailConf.modelAti},
          {name:'工信部综合油耗(L/100km)',value:carDetailConf.modelOil},
          {name:'整车质保',value:carDetailConf.modelPolicy},
          {name:'最小离地间隙(mm)',value:carDetailConf.modelClearance},
          {name:'整备质量(kg)',value:carDetailConf.modelWeight},
          {name:'车门数(个)',value:carDetailConf.modelDoor},
          {name:'座位数(个)',value:carDetailConf.modelSeating},
          {name:'油箱容积(L)',value:carDetailConf.modelOilbox},
          {name:'行李箱容积(L)',value:carDetailConf.modelBoot}
        ]
      },
      {
        title:'发动机',
        props:[
          {name:'发动机型号',value:carDetailConf.modelEngineModel},
          {name:'配气机构',value:carDetailConf.modelGasStructure},
          {name:'最大马力(Ps)',value:carDetailConf.modelPower},
          {name:'最大功率(kW)',value:carDetailConf.modelCapacity},
          {name:'最大功率转速(rpm)',value:carDetailConf.modelPowerrpm},
          {name:'最大扭矩(Nm)',value:carDetailConf.modelTorque},
          {name:'最大扭矩转速(rpm)',value:carDetailConf.modelTorquerpm},
          {name:'发动机特有技术',value:carDetailConf.modelEngineSpecial},
          {name:'燃料形式',value:carDetailConf.modelFuelType},
          {name:'燃料标号',value:carDetailConf.modelFuelCode},
          {name:'供油方式',value:carDetailConf.modelSupplyType},
          {name:'环保标准',value:carDetailConf.modelEvntStandards}
        ]
      },
      {
        title:'底盘转向',
        props:[
          {name:'驱动方式',value:carDetailConf.modelDrive},
          {name:'四驱形式',value:carDetailConf.modelFourDrivw},
          {name:'中央差速器结构',value:carDetailConf.modelCentralStructure},
          {name:'前悬架类型',value:carDetailConf.modelFSuspension},
          {name:'后悬架类型',value:carDetailConf.modelBSuspension},
          {name:'助力类型',value:carDetailConf.modelEps}
        ]
      },
      {
        title:'车轮制动',
        props:[
          {name:'前制动器类型',value:carDetailConf.modelFBrake},
          {name:'后制动器类型',value:carDetailConf.modelBBrake},
          {name:'驻车制动类型',value:carDetailConf.modelParkType},
          {name:'前轮胎规格',value:carDetailConf.modelFTyre},
          {name:'后轮胎规格',value:carDetailConf.modelBTyre},
          {name:'备胎规格',value:carDetailConf.modelSpareTyre}
        ]
      }
    ]

    carDetailConfArray.forEach((item,value) => {
      tables.push(
        <CarPropertyTable title={item.title} properties={item.props}/>
      )
    })

    return (
      <div className="car_properties">
        {tables}
      </div>
    )
  }
}

class CarPropertyTable extends React.Component{
  constructor(props) {
    super(props)
  }
  render(){
    let carProperties = []
    this.props.properties.forEach((item,value) => {
      carProperties.push(
        <tr>
          <td>{item.name}</td>
          <td>{item.value}</td>
        </tr>
      )
    })
    return (
      <table>
        <thead>
          <tr>
            <th colSpan="2">{this.props.title}:</th>
          </tr>
        </thead>
        <tbody>
          {carProperties}
        </tbody>
      </table>
    )
  }
}


class TabComponent extends React.Component{
  render(){
    if(this.props.carDetailList.length === 0){
      return null
    }
      // if(typeof(this.props.carDetailList.modelPicsHtml)=='undefined'){
      //   return null;
      // }
      // let carPicList=this.props.carDetailList.modelPicsHtml
      // let carPicListArr=carPicList.split("<img src=\"")
      // console.log(carPicListArr[1])
      // <div name="车型信息" style={{display:'none'}} onClick={CollectClickData.bind(null,{poicode:'MZ3C'})}></div>
    return(
      <div className="container">
        <TabsControl>
          <div name="购车服务" onClick={CollectClickData.bind(null,{poicode:'MZ3B'})}>
            <DirectFlow/>
            <DirectService/>
          </div>

          <div name="参数配置" onClick={CollectClickData.bind(null,{poicode:'MZ3D'})}>
            <CarProperties
              currentCarModelIndex={this.props.currentCarModelIndex}
              carDetailList={this.props.carDetailList}
            />
          </div>
        </TabsControl>
      </div>
    )
  }
}

export default TabComponent
