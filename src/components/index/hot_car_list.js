import React from 'react'
import { Link } from 'react-router'
import { CollectClickData } from '../../data_collection'
// import Loading from '../../components/common/loading'

class IndexHotCarList extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    let indexBrandListNodes = []
    // console.log(this.props.carList)

    this.props.carList.forEach((carInfo) =>
      indexBrandListNodes.push(
        <li key={carInfo.typeId}>
          <Link to={"/car_model/" + carInfo.typeId} onClick={CollectClickData.bind(null,{poicode:'MB14'})}>
            <img src={carInfo.tpicPath}/>
            <p className="car_name">{carInfo.brandName} {carInfo.typeName}</p>
            <p className="">
              <b className="price">{carInfo.typeMinPrice / 10000}万</b>
              <span className="customer_count">{carInfo.askCount}人比价购车</span>
            </p>
          </Link>
        </li>
      )
    )
    return (
      <div className="hot_car">
        <ul className="list">{indexBrandListNodes}</ul>
      </div>
    )
  }
}

export default IndexHotCarList
