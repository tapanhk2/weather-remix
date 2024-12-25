
import { useEffect, useState } from "react";
  

export function Autocomplete(props:any) {
    
    const { sendDataToParent, handleAutoSearch, searchCities } = props
    
    const [typedStr, setTypedStr] = useState("");

    const onchangeFunc = (e:any) => {
        setTypedStr(e?.target?.value)
        handleAutoSearch(e?.target?.value)
    }

    const addCity = (city:string) => {
        setTypedStr('');
        sendDataToParent(city);
    }
      

    return (<div id="hs-combobox-basic-usage" className="relative" data-hs-combo-box="">
    
    <div className="relative">
        <input className="py-3 ps-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" type="text" role="combobox" aria-expanded="false" data-hs-combo-box-input="" placeholder="Please type a city" onChange={onchangeFunc} value={typedStr} />    
    
        <div className="absolute top-1/2 end-3 -translate-y-1/2" aria-expanded="false" data-hs-combo-box-toggle="">
            <svg className="shrink-0 size-3.5 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m7 15 5 5 5-5"></path>
                <path d="m7 9 5-5 5 5"></path>
            </svg>
        </div>
    </div>
    {searchCities?.length>0 &&
    <div className="absolute z-50 w-full max-h-72 p-1 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700" data-hs-combo-box-output="">
        {searchCities && searchCities?.map((city:any) => (
        <div className="cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800" tabIndex={city?.id} data-hs-combo-box-output-item="" data-hs-combo-box-item-stored-data='{
        "id": {city?.id},
        "name": {city?.name}
        }'>
        <div className="flex justify-between items-center w-full" onClick={()=>addCity(city?.name)}>
            <span data-hs-combo-box-search-text={city?.name} data-hs-combo-box-value=""><b>{city?.name}</b>, {city?.country}</span>
            <span className="hidden hs-combo-box-selected:block">
            <svg className="shrink-0 size-3.5 text-blue-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"></path>
            </svg>
            </span>
        </div>
        </div>
        ))}
        
    </div>
    }
    </div>
)
}