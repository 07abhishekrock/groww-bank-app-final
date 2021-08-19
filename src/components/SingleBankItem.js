import { Link, useParams } from "react-router-dom";
import { useSelector , useDispatch } from "react-redux";
import { useEffect , useState } from "react";
import { populateBankStoreWithCity, refreshBankListWithNewCity } from "../bank/BankSlice";

const GoToHomeLinks = ()=>{
    return  <div className="single-bank-item-buttons" style={{
                display:'flex',
                gap:'0.5em',
                justifyContent:'center'
            }} className="styled-anchor-container">
                <Link to="/all-banks">Go Home</Link>
            </div>
}

const checkIfIFSCisValid = (ifsc)=>{
    let regex = /^([A-Z]|[a-z]){4}0([A-Z]|[a-z]|[0-9]){6}$/;
    if(!ifsc){
        return false;
    }
    else{
        if(ifsc.match(regex)) return true;
    }
    return false;
}


const SingleBankItemPage = (props)=>{

    const dispatch = useDispatch();
    const {ifsc} = useParams();
    const all_banks_in_all_cities = useSelector(state => state.banks);
    const [cities_checked , set_cities_checked] = useState([]);
    const [found , set_found] = useState(null);
    const [finding , set_finding] = useState(true);
    const [invalid , set_invalid] = useState(false);
    useEffect(async ()=>{
        const cities = ['MUMBAI' , 'DELHI' , 'RANCHI' , 'LUCKNOW' , 'PUNE']
        for(let city of cities){
            dispatch(await populateBankStoreWithCity(city , false));
        }
    },[])
    useEffect(()=>{
        set_found(null);
        set_finding(true);
        set_invalid(false);

        if(!checkIfIFSCisValid(ifsc)){
            set_invalid(true);
            set_finding(false);
            return;
        }


        for(let city of cities_checked){
            set_finding(true);
            let flag = 0;
            for(let bank of all_banks_in_all_cities[city]){
                if(bank.ifsc === ifsc){
                    set_found(bank);
                    set_finding(false);
                    flag = 1;
                    break;
                }
                if(flag === 1) break;
            }
        }
        if(!found) set_finding(false);
    },[ifsc])
    useEffect(()=>{
        if(!all_banks_in_all_cities || found || invalid) return;
        if(cities_checked.length === 5) 
        {
            set_finding(false);
            return;
        }
        for(let city in all_banks_in_all_cities){
            if(!cities_checked.includes(city)){
                set_finding(true);
                let flag = 0;
                for(let bank of all_banks_in_all_cities[city]){
                    if(bank.ifsc === ifsc){
                        set_found(bank);
                        set_finding(false);
                        flag = 1;
                        break;
                    }
                }
                set_cities_checked([...cities_checked , city]);
                if(flag === 1) break;
            }
        }
    },[all_banks_in_all_cities])
    if(invalid && !finding){
        return <div className="single-bank-item"> 
                <h1>Please Enter a Valid ifsc code.</h1>
                <GoToHomeLinks/>
            </div>
    }
    else if(found){

        return <div className="single-bank-item" style={{textAlign : 'center' , padding : '2em 0px'}}>
            <h2>Individual Bank Details</h2>
            <h1 className="single-bank-ifsc">{found.ifsc}</h1>
            <div className="single-bank-id-and-name">
                <span>BANK ID : {found.bank_id}</span>
                <h1>{found.bank_name}</h1>
            </div>
            <h3>{props.branch}</h3>
            <div className="single-bank-item-address" style={{
                borderTop : "2px solid black",
                marginTop : '2em',
                paddingTop : '1em',
            }}>
                <h2>Address</h2>
                <p>{found.address}</p>
            </div>
            <GoToHomeLinks/>
        </div>
    }
    else if(!found && finding){
        return <div className="single-bank-item">
                <h1>Finding Your Bank , Be Patient ...</h1>
                <GoToHomeLinks/>
            </div>
    }
    else if(!found && !finding){
        return <div className="single-bank-item">
            <h1>Your Bank could not be found , try a different ifsc code ...</h1>
            <GoToHomeLinks/>
        </div>
    }
        
}


export {SingleBankItemPage};