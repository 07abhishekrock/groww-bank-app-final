import { useState , useRef, useEffect } from "react"


export default function PaginationComponent({current_page , set_current_page , last_page_index , rows_per_page , set_rows_per_page}){

    const page_label_count = 4;
    const row_count_input_ref = useRef(null);
    const [group_index , set_group_index] = useState(Math.floor(current_page / page_label_count));
    const generatePageLabels = ()=>{
        const start_page = (group_index * page_label_count) + 1;
        const end_page = (group_index + 1) * page_label_count;
        const final_pages_array = [];
        for(let i = start_page ; i <= end_page; i++){
            final_pages_array.push(i);
        }
        return final_pages_array;
    }
    useEffect(()=>{
        set_group_index(Math.floor((current_page - 1) / page_label_count));
    },[current_page , last_page_index])

    useEffect(()=>{
        row_count_input_ref.current.value = rows_per_page;
    },[])


    
    return (
        <div className="pagination-wrapper">
            <div className="page-limit-input">
                <span>Results Per Page</span>
                <input type="number" ref={row_count_input_ref}/>
                <span onClick={()=>{
                    const value = row_count_input_ref.current.value;
                    if(+value > 0 && +value !== rows_per_page){
                        set_rows_per_page(+value);
                    }
                }}>Change</span>
            </div>
            <div className="page-selector">
                <span onClick={()=>{
                    if(current_page > 1){
                        set_current_page(current_page - 1);    
                    }
                }}>Prev</span>
                    <div className="page-number-preview">
                        {generatePageLabels().map((page_label)=>{
                                    if(page_label === current_page){
                                        console.log(current_page); 
                                        return <span className="currentPage">{page_label}</span>
                                    }
                                    return <span>{page_label}</span>
                                }
                            )}
                    </div> 
                <span onClick={()=>{
                    if(!last_page_index ||  current_page < last_page_index ){
                        set_current_page(current_page + 1);
                    }
                }}>Next</span>
            </div>
        </div>
    )
}