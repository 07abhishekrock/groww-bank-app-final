import { createSlice } from "@reduxjs/toolkit";

export const BankSlice = createSlice({
    name : 'banks',
    initialState : {
        banks : {},
        citySelected : null,
        search_query : null,
        loading : {state : 'idle' , error : null},
        last_checked_index : 0,
        rows_per_page : 10
    },
    reducers : {
        idle_state_loading : (state)=>{
            state.loading = {
                state : 'idle',
                error : null
            }
        },
        load_state_loading : (state)=>{
            state.loading = {
                state : 'loading',
                error : null
            }
        },
        error_state_loading : (state , action)=>{
            state.loading = {
                state : 'error',
                error : action.payload
            }
        },
        refreshBankListWithNewCity : (state , action)=>{
            const {new_city , bank_list , updateCity} = action.payload;
            if(updateCity) state.citySelected = new_city;
            if(bank_list){
                state.banks[new_city] = bank_list;
            }
        },
        changeRowsPerIndex : (state , action)=>{
            state.rows_per_page = action.payload;
        },
        changeLastCheckedIndex : (state , action)=>{
            state.last_checked_index = action.paylod;
        },
        changeSearchQuery : (state , action)=>{
            state.search_query = action.payload;
        }

    }
})


export const populateBankStoreWithCity = (city , updateCity = true) => async (dispatch , getState) =>{

    dispatch(load_state_loading());

    if(getState().citySelected === city){
        dispatch(idle_state_loading());
        return;
    }
    else if(getState().banks[city]){
        dispatch(refreshBankListWithNewCity(
            {
                new_city : city , bank_list : null , updateCity
            }
        ));
    }
    if(getState().citySelected !== city && getState()){
        //new city
        if(localStorage.getItem(city)){
            dispatch(refreshBankListWithNewCity(
                {
                    new_city : city ,
                    bank_list : JSON.parse(localStorage.getItem(city)),
                    updateCity
                }
            ));
        }

        else{
            try{
                const response = await Promise.race([fetch('https://vast-shore-74260.herokuapp.com/banks?city=' + city) , 
                    new Promise((resolve , reject)=>{
                        setTimeout(()=>{
                            reject('Connection Timed Out');
                        },5000)
                    }) 
                ]);
                if(response.ok){
                    const json_data = await response.json();
                    dispatch(refreshBankListWithNewCity(
                        {
                            new_city : city,
                            bank_list : json_data,
                            updateCity
                        }
                    ));
                    localStorage.setItem(city , JSON.stringify(json_data));
                }
            }
            catch(e){
                const error = e.message;
                console.log(error);
                dispatch(error_state_loading(error));
                return;
            }
        }

    }
    dispatch(idle_state_loading());
}


export const {idle_state_loading , error_state_loading , load_state_loading , refreshBankListWithNewCity , changeSearchQuery} = BankSlice.actions;
export default BankSlice.reducer;