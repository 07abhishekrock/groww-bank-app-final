const SampleBankItemObject = {
    bank_id : "60", 
    bank_name : "State Bank Of India",
    branch : "Jail Road",
    address : "ABHYUDAYA BANK BLDG., B.NO.71, NEHRU NAGAR, KURLA (E), MUMBAI-400024",
    ifsc : 'ABHY0065001',
    isFavourite : true
}


function BankItem(props){
    return (
        <div className="bank-item">
            <i>BANK ID - {props.bank_id || 'N/A'}</i>
            <div className="bank-name-info-wrapper">
                <div className="bank-name-info">
                    <h2>{props.bank_name}</h2>
                    <h4>{props.branch || 'Not Available'} Branch</h4>
                </div>
                <div className="special-label">
                    <i>IFSC Code</i>
                    <span>{props.ifsc || 'Not Provided'}</span>
                </div>
            </div>
            <div className="bottom-wrapper">
                <div className="address-with-label">
                    <span>ADDRESS</span>
                    <p>{props.address || 'Address Not Provided'}</p>
                </div>
                <button onClick={props.onFavourites} favourite={props.favourite ? "1" : "0"}>{props.favourite ? "Unmark as Favourite" : "Mark as Favourite"}</button>
            </div>
        </div>
    )
}

export default BankItem;
export {SampleBankItemObject};