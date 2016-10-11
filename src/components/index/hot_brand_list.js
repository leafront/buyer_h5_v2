import React from 'react'
import { Link } from 'react-router'
import IndexBrandListData from '../../data/index_brand_list_data'
import { CollectClickData } from '../../data_collection'

class IndexHotBrandList extends React.Component {
  constructor(props) {
    super(props)

    this.hotBrandList = this.makeBrandList()
  }
  makeBrandList(){
    let hotBrandList = []
    const indexBrandListData = new IndexBrandListData();
    const indexBrandListDataList = indexBrandListData.getData();
    for(var i = 0; i < 11; i++){
      hotBrandList.push(
        <li key={i}>
          <Link to={"/car_series/" + indexBrandListDataList[i].brandId} onClick={CollectClickData.bind(null,{poicode:'MB12'})}>
            <img height="35" src={indexBrandListDataList[i].brandLogo}/>
          </Link>
        </li>
      )
    }
      hotBrandList.push(
        <li>
          <Link to="/brand_list" onClick={CollectClickData.bind(null,{poicode:'MB13'})}>
            <p>更多</p>
          </Link>
        </li>
        )
    return hotBrandList
  }
  render(){
    return (
      <div className="hot_brand">
        <ul className="list">{this.hotBrandList}</ul>
      </div>
    )
  }
}

export default IndexHotBrandList
