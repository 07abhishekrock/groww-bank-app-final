import { useDispatch , useSelector } from 'react-redux';
import PaginationComponent from './components/PaginationComponent';
import BankItem from './components/BankItem';
import { useEffect, useState } from 'react';
import { checkItemInFavourites, toggleItemFromFavourites } from './localStorage';



export const singleBankDetails = {
  bank_id : "60", 
  bank_name : "State Bank Of India",
  branch : "Jail Road",
  address : "ABHYUDAYA BANK BLDG., B.NO.71, NEHRU NAGAR, KURLA (E), MUMBAI-400024",
  ifsc : 'ABHY0065001',
}

export default function BankList({filter}){
  const current_city_banks_list = useSelector(state => state.banks[state.citySelected] || []);
  const {state , error} = useSelector(state => state.loading);
  const [rows_per_page , set_rows_per_page] = useState(10);
  const [current_page , set_current_page] = useState(1);
  const [search_results , set_search_results] = useState([]);
  const [last_checked_index , set_last_checked_index] = useState(0);
  const [last_page_index , set_last_page_index] = useState(null);
  const search_query = useSelector(state => state.search_query);


  const convertStateToLoadingAttr = (new_state)=>{
    switch(new_state){
        case 'idle' : return '0';
        case 'loading' : return '1';
        case 'error' : return '1';
    }
  }

  useEffect(()=>{

    set_last_checked_index(0);
    set_search_results([]);
    set_current_page(1);
    set_last_page_index(null);
    console.log('hello world' , current_city_banks_list);

    const [last_page_reached , new_results , current_index] = getNextSetOfResults(0 , rows_per_page , search_query);
    if(last_page_reached){
      set_last_page_index(current_page);
    }
    set_last_checked_index(current_index);
    set_search_results(new_results);
  },[current_city_banks_list , search_query])

  useEffect(()=>{
    const shift_current_page = (current_page)=>{
      if(current_page === 1){
        set_last_checked_index(0);
        set_last_page_index(null);
        set_current_page(1);
        return;
      }
      const sliced_results = search_results.slice((current_page - 1) * rows_per_page , current_page * rows_per_page);
      console.log(sliced_results.length , 'length');
      if(sliced_results.length === 0){
        return shift_current_page(current_page - 1);
      }
      else{
        set_current_page(current_page);
        set_last_page_index(null);
        return;
      }
    }

    if(current_page === 1){
      const sliced_results = search_results.slice( -1 , rows_per_page);
      if(sliced_results.length < rows_per_page){
        const [last_page_reached , new_results , current_index] = getNextSetOfResults(last_checked_index , rows_per_page - sliced_results.length , search_query);
        set_search_results(search_results.concat(new_results));
        if(last_page_reached){
          set_last_page_index(current_page);
        }
        set_last_checked_index(current_index);
      }
    }
    else{
      shift_current_page(current_page);
    }
  },[rows_per_page])

  useEffect(()=>{
    const sliced_results = search_results.slice((current_page - 1) * rows_per_page , current_page * rows_per_page);
    if(sliced_results.length < rows_per_page){
      if(!last_page_index){
        const [last_page_reached , new_results , current_index] = getNextSetOfResults(last_checked_index , rows_per_page - sliced_results.length , search_query);
        if(last_page_reached){
          set_last_page_index(current_page);
        }
        set_last_checked_index(current_index);
        set_search_results(search_results.concat(new_results));
      }
    }
  },[current_page])

  const getNextSetOfResults = (last_checked_index , req_count , search_query)=>{
    let new_results = [];
    let last_page_reached = false;
    let current_index = 0;
    for(let i = last_checked_index; i < current_city_banks_list.length ; i++){
      current_index = i;
      if(new_results.length === req_count){
        //target achieved
        break;
      }
      const bank_item = current_city_banks_list[i];
      if(search_query === null){
        //all are valid
        if(filter === 'fav'){
          checkItemInFavourites(bank_item.ifsc) && new_results.push({...bank_item , favourite : true});   
        }
        else{
          new_results.push({...bank_item , favourite : checkItemInFavourites(bank_item.ifsc)} );
        }
        continue;
      }

      const [key , value] = search_query;
      switch(key){
        case 'bank_id' : 
        if(bank_item.bank_id == value) {
          if(filter === 'fav'){
            checkItemInFavourites(bank_item.ifsc) && new_results.push({...bank_item , favourite : checkItemInFavourites(bank_item.ifsc)});   
          }
          else{
            new_results.push({...bank_item , favourite : checkItemInFavourites(bank_item.ifsc)} );
          }
        }
          break;
        default : 
          if(bank_item[key].toLowerCase().includes(value.toLowerCase())){
            if(filter === 'fav'){
              checkItemInFavourites(bank_item.ifsc) && new_results.push({...bank_item , favourite : checkItemInFavourites(bank_item.ifsc)});   
            }
            else{
              new_results.push({...bank_item , favourite : checkItemInFavourites(bank_item.ifsc)} );
            }
          }
          break;
      }
    }

    if(current_city_banks_list.length > 0 && new_results.length < req_count){
      last_page_reached = true;
    }



    return [last_page_reached , new_results , current_index];
  }

  if(last_page_index && last_page_index === current_page){
    if(filter === 'fav'){
      return <div className="bank-item-list">
      <h1 style={{textAlign : 'center' , margin:'2em 0px'}}>No Favourites Found</h1>
      <PaginationComponent {...{current_page , set_current_page , last_page_index , rows_per_page , set_rows_per_page}} />
      </div>
    }
    else{
      return <div className="bank-item-list">
      <h1 style={{textAlign : 'center' , margin : '2em 0px'}}>No Banks Found</h1>
      <PaginationComponent {...{current_page , set_current_page , last_page_index , rows_per_page , set_rows_per_page}} />
      </div>
    }
  }

  return (
    <div className="bank-item-list" loading={convertStateToLoadingAttr(state)}>
      {
        search_results.slice((current_page - 1) * rows_per_page , current_page * rows_per_page).map((search_result)=>{
          if((filter === 'fav' && search_result.favourite === true) || filter !== 'fav'){
            return <BankItem key={search_result.ifsc} {...search_result} onFavourites={()=>{
              set_search_results(search_results.map((loop_search_result)=>{
                if(loop_search_result.ifsc === search_result.ifsc){
                  toggleItemFromFavourites(search_result.ifsc);
                  loop_search_result.favourite = !loop_search_result.favourite;
                }
                return loop_search_result;
              }))
            }}/>
          }
        })
      }
      <PaginationComponent {...{current_page , set_current_page , last_page_index , rows_per_page , set_rows_per_page}} />
    </div>  
  )
}