import { faCircleNotch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

const LoadingModal = ()=>{

    const {state , error} = useSelector(state => state.loading);
    const convertStateToLoadingAttr = (new_state)=>{
        switch(new_state){
            case 'idle' : return '0';
            case 'loading' : return '1';
            case 'error' : return '1';
        }
    }

    return (
        <div className='loading-modal-wrapper' loading={convertStateToLoadingAttr(state)} error={error ? "1" : "0"}>
            <div className='modal'>
                {!error ? <FontAwesomeIcon icon={faCircleNotch}/> : <FontAwesomeIcon icon={faTimes}/>}
                <p>{error || 'Page is Loading , Be Patient !!!'}</p>
                {/* <div>
                    <button disabled={error ? "1" : undefined}>Retry</button>
                    <button>Close</button>
                </div> */}
            </div>
        </div>
    )
}

export default LoadingModal;