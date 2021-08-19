import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useEffect, useState} from 'react';

export default function ComboBox(props){
    const [visible , set_visible] = useState(0);
    useEffect(()=>{
        props.changeOption(props.options[0].toUpperCase())
    },[])
    return (
        <div className="combo-box">
            <span tabIndex={1}
            onFocus={set_visible.bind(null , 1)}
            onBlur={set_visible.bind(null , 0)}
            >
                {props.currentOption}
                <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
            </span>
            <i className="hover-bg"></i>
            <ul visible={visible}>
                {props.options.map((option , index)=>{
                    return <li onFocus={()=>{
                        props.changeOption(option.toUpperCase());
                    }} tabIndex={index + 1} key={index}>{option}</li>
                })}
            </ul>
        </div>
    )
}