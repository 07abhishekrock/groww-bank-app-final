import { configureStore } from "@reduxjs/toolkit";
import { BankSlice } from "../bank/BankSlice";
const store =  configureStore({
    reducer : BankSlice.reducer
})

export default store;