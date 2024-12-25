
//humidity temp_f wind_kph wind_kph last_updated dewpoint_c
//vis_km

import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { HeartFilledIcon } from "./heartFilled.icon";
import { HeartIcon } from "./heart.icon";



  export async function action({ request }: ActionFunctionArgs) {
    //&& request.name === 'add_to_favorite'
    console.log('sdakjn', request)
    if (request.method === 'POST' ) {
        let formData = await request.formData();
        const city = formData?.get("cityname") || ''
        
        return redirect('/');
    }
  }

  
  

export function WeatherBox(props:any) {
    const { weatherDetails, isFavorite, addRemoveAction } = props;     

    const currentWeather = weatherDetails?.query?.current 
    const currentCity = weatherDetails?.query?.location ;
    return (<div className="group/item shadow-md bg-slate-100 p-3 hover:bg-slate-200">


        <div className="flex flex-row">
            <div className="basis-4/5"><h3 className="text-lg text-slate-400 font-semibold">{currentCity?.name}, {currentCity?.country}</h3></div>

            <div className="basis-1/5">             
            <div className="flex-row-reverse flex" style={{'position':"relative"}}> 
                <button title={ !isFavorite ? 'Add to favorite': 'Remove from favorite' } type="button" className="group/edit invisible hover:bg-slate-200 group-hover/item:visible" onClick={()=>addRemoveAction(currentCity?.name, weatherDetails?.query?.custom_id, isFavorite)}>
                    { !isFavorite ? <HeartFilledIcon/> : <HeartIcon/> }
                </button>
                

                {/* <Form method="post">
                    <input type="hidden" name="cityname" value={currentCity?.name}/>
                    <input type="hidden" name="id" value={weatherDetails?.query?.custom_id}/>
                    <input type="hidden" name="formname" value={isFavorite?'remove_from_favorite':'add_to_favorite'} />
                    <button type="submit" formMethod="post">
                        { isFavorite ? <HeartFilledIcon/> : <HeartIcon/> }
                    </button>
                </Form> */}
            </div>
            </div>
            
        </div>
            
        

        <div className="flex flex-row">
            <div className="basis-2/3">
            

                <h2 className="text-xl font-bold">{currentWeather?.temp_c} &deg;C, <span className="text-sm text-slate-400">{currentWeather?.condition?.text}</span></h2>
                <p className="text-sm text-slate-400">Feel Like: {currentWeather?.feelslike_c} &deg;C</p>
                <p className="text-sm text-slate-400">Humidity: {currentWeather?.humidity}</p>
                <p className="text-sm text-slate-400">Precipitation: {currentWeather?.precip_mm} MM</p>
                <p className="text-sm text-slate-400">Dew Point: {currentWeather?.dewpoint_c} &deg;C</p>
                <p className="text-sm text-slate-400">Pressure: {currentWeather?.pressure_mb} MB</p>
                <p className="text-sm text-slate-400">Wind: {currentWeather?.wind_kph} KPH</p>
            </div>
            <div className="basis-1/3"><img src={currentWeather?.condition?.icon} /></div>
        </div>        
        <p className="text-sm text-slate-400">Latest Report: {currentWeather?.last_updated}</p>
    </div>)

}