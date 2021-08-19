export const getAllFavouriteItems = ()=>{
    const favourite_id_strings = localStorage.getItem('favourites');
    if(favourite_id_strings){
        return JSON.parse(favourite_id_strings);
    }
    else{
        localStorage.setItem('favourites',JSON.stringify([]));
        return [];
    }
}

export const setNewFavourites = (new_list)=>{
    localStorage.setItem('favourites',JSON.stringify(new_list));
}

export const toggleItemFromFavourites = (ifsc)=>{
    const all_favourites = getAllFavouriteItems();
    if(checkItemInFavourites(ifsc)){
        setNewFavourites(all_favourites.filter(fav => fav != ifsc));
        return;
    }
    else{
        all_favourites.push(ifsc);
    }
    setNewFavourites(all_favourites);
    
}

export const checkItemInFavourites = (ifsc)=>{
    const all_favourites = getAllFavouriteItems();
    return all_favourites.filter(fav => fav === ifsc).length > 0;
}