import { faPiggyBank, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ComboBox from './ComboBox';
import { useRef, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { populateBankStoreWithCity ,changeSearchQuery } from "../bank/BankSlice";
import { Link } from "react-router-dom";

const categories = [
    {
        label : 'BANK ID',
        param : 'bank_id'
    },
    {
        label : 'IFSC CODE',
        param : 'ifsc'
    },
    {
        label : 'BRANCH',
        param : 'branch'
    },
    {
        label : 'BANK NAME',
        param : 'bank_name'
    },
    {
        label : 'ADDRESS',
        param : 'address'
    },
];

function NavBarWithSearch(){
    const dispatch = useDispatch();
    const current_city = useSelector(state => state.citySelected);
    const input_search = useRef(null);
    const location = useLocation();

    const [current_category , set_current_category] = useState(0);
    const interval_ref = useRef(-1);

    return (
        <div className="navbar-wrapper">
            <div className="navbar-search-container">
                <div className="navbar-logo">
                    <FontAwesomeIcon icon={faPiggyBank}></FontAwesomeIcon>
                    Find Your Bank
                </div>
                <div className="navbar-search">
                    <div onClick={()=>{
                        set_current_category( (current_category + 1) % categories.length);
                        clearInterval(interval_ref.current);
                        interval_ref.current = setTimeout(()=>{
                            if(input_search.current.value.trim() !== ''){
                                dispatch(changeSearchQuery([
                                    categories[(current_category + 1) % categories.length].param , 
                                    input_search.current.value.trim()
                                ]));
                            }
                            else{
                                dispatch(changeSearchQuery(
                                    null
                                ));
                            }
                        } , 800)
                    }}>
                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                        <span>
                            <i>CATEGORY</i>
                           {categories[current_category].label} 

                        </span>
                    </div>
                    <input type="text" ref={input_search} placeholder={"Enter Your Search Query Here ..."} onChange={(e)=>{
                        clearInterval(interval_ref.current);
                        interval_ref.current = setTimeout(()=>{
                            if(e.target.value.trim() !== ''){
                                dispatch(changeSearchQuery([
                                    categories[current_category].param , 
                                    e.target.value.trim()
                                ]));
                            }
                            else{
                                dispatch(changeSearchQuery(
                                    null
                                ));
                            }
                        } , 800)
                    }}/>
                </div>
            </div>
            <div className="navbar-city-dropdown-wrapper">
                <span>SELECT CITY</span>
                <ComboBox options={['Mumbai' , 'Pune' , 'Lucknow' , 'Ranchi' , 'Delhi']} currentOption={current_city} changeOption={(option_name)=>{
                    dispatch(populateBankStoreWithCity(option_name));
                }}/>
            </div>
            <div className="navbar-nav-options">
                <Link to="/all-banks" select={location.pathname === '/all-banks' ? "1" : "0"}>All Banks</Link>
                <Link to="/favourites" select={location.pathname === '/favourites' ? "1" : "0"}>Favourites</Link>
                <Link to="/bank-details/ABHY0065001" select={location.pathname.split('/')[1] === "bank-details" ? "1" : "0" }>Single Page</Link>
            </div>
        </div>
    )
}

export default NavBarWithSearch;