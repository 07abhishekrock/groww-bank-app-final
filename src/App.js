import BankList from './BanksList';
import { SingleBankItemPage } from './components/SingleBankItem';
import NavBarWithSearch from './components/NavBarWithSearch';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { singleBankDetails } from './BanksList';
import { useState } from 'react';
import './sass/main.scss';
import LoadingModal from './components/LoadingModal';





export default function App(props){
  return <>
    <Router>
    <NavBarWithSearch/>
    <LoadingModal/>
      <Switch>
          <Route exact path="/all-banks">
            <BankList key="1" filter="all"/>
          </Route>
          <Route exact path="/favourites">
            <BankList key="2" filter="fav"/>
          </Route>
          <Route exact path="/bank-details/:ifsc">
            <SingleBankItemPage {...singleBankDetails} key="3"/>
          </Route>
      </Switch>
    </Router>
    </>
}