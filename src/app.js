import React , { PropTypes } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { Router, Route , Link , Redirect , hashHistory, IndexRoute } from 'react-router'
// import { createBrowserHistory } from 'history'
import 'babel-polyfill'

import App from './entry'
import Index from './containers/index'
import BrandList from './containers/brand_list'
import CarSeries from './containers/car_series'
import CarModel from './containers/car_model'
import CarShop from './containers/car_shop'
import UserCenter from './containers/user_center'
import MyInquire from './containers/my_inquire'
import MyInquireDetail from './containers/my_inquire_detail'
import Account from './containers/account'
import About from './containers/about'
import AboutHMC from './containers/about_hmc'
import ComProblem from './containers/com_problem'
import Protocol from './containers/protocol'
import Setting from './containers/setting'
import LoginAndReg from './containers/login_and_reg'
import CarParity from './containers/car_parity'
import Inquire from './containers/inquire'
import Auth from './containers/auth'
import DirectSaleList from './containers/direct_sale_list'
import DirectSaleDetail from './containers/direct_sale_detail'
import MyOrder from './containers/my_order'
import MyOrderInquireDetail from './containers/my_order_inquire_detail'
import MyOrderBuyDetail from './containers/my_order_buy_detail'
import PaySuccess from './containers/pay_success.js'
import PayDeposit from './containers/pay_deposit.js'
import DirectSaleInquire from './containers/direct_sale_inquire'
import Price from './containers/price'

import { GetGlobalConfig } from './common'
// import { CollectVisitData } from './data_collection'

import './style/app.scss'
require('./thirdlib/pingpp')
// import TopBar from './top_bar.js'

// import { Router, useRouterHistory } from 'react-router'
// import { createHashHistory } from 'history'
// useRouterHistory creates a composable higher-order function
// const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })
// <Router history={appHistory}/>

// import { Router, useRouterHistory } from 'react-router'
// import { createHashHistory } from 'history'
// // useRouterHistory creates a composable higher-order function
// const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })
// <Router history={appHistory}/>
// const Response = fetch(GetGlobalConfig().env + '/hybrid/ask/getIPCode')

// import { Router, useRouterHistory } from 'react-router'
// import { browserHistory } from 'react-router'
// <Router history={browserHistory} />

// const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })
// <Router history={appHistory}/>
// import createBrowserHistory from 'history/lib/createBrowserHistory'
// const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })


import RootReducer from './reducers'
let store = createStore(RootReducer)

render ((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route name="app" path="/" component={App}>
        <IndexRoute component={Index}/>
        <Route path="brand_list" component={BrandList}/>
        <Route path="car_series" component={CarSeries}>
          <Route path=":brandId" component={CarSeries}/>
        </Route>
        <Route path="car_model" component={CarModel}>
          <Route path=":seriesId" component={CarModel}/>
        </Route>
        <Route path="car_parity" component={CarParity}>
          <Route path=":seriesId" component={CarParity}>
            <Route path=":modelId" component={CarParity}/>
          </Route>
        </Route>
        <Route path="car_shop" component={CarShop}/>
        <Route path="inquire/:timeToResponse" component={Inquire}/>
        <Route path="user_center" component={UserCenter}>
          <Route path=":userName" component={UserCenter}/>
        </Route>
        <Route path="my_inquire" component={MyInquire}/>
        <Route path="my_inquire_detail/:askpid/:currentTab" component={MyInquireDetail}/>
        <Route path="account" component={Account}/>
        <Route path="about" component={About}/>
        <Route path="about_hmc" component={AboutHMC}/>
        <Route path="com_problem" component={ComProblem}/>
        <Route path="com_problem/:hideheader" component={ComProblem}/>
        <Route path="protocol" component={Protocol}/>
        <Route path="setting" component={Setting}/>
        <Route path="login_and_reg" component={LoginAndReg}>
          <Route path=":fromPage" component={LoginAndReg}>
            <Route path=":orderNo" component={LoginAndReg}/>
          </Route>
        </Route>
        <Route path="auth" component={Auth}>
          <Route path=":fromPage" component={Auth}>
            <Route path=":orderNo" component={Auth}/>
          </Route>
        </Route>
        <Route path="direct_sale_list" component={DirectSaleList}/>
        <Route path="direct_sale_detail" component={DirectSaleDetail}>
          <Route path=":directSaleCarId/:directSaleCarModelId" component={DirectSaleDetail}/>
        </Route>
        <Route path="direct_sale_car_price" component={Price}/>
        <Route path="direct_sale_inquire/:dsrp" component={DirectSaleInquire}/>
        <Route path="my_order" component={MyOrder}/>
        <Route path="my_order_inquire_detail/:piId" component={MyOrderInquireDetail}/>
        <Route path="my_order_buy_detail/:piId" component={MyOrderBuyDetail}/>
        <Route path="pay_success/:piId" component={PaySuccess}/>
        <Route path="pay_deposit/:piId" component={PayDeposit}/>
        <Route path="price/:carModelId" component={Price}/>
        <Redirect from="*" to="/"/>
      </Route>
    </Router>
  </Provider>
), document.getElementById('content'))
