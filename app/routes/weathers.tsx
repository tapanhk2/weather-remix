import { useEffect, useState } from "react";


import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, redirect, redirectDocument, useActionData, useLoaderData, useSubmit } from "@remix-run/react";

import { addFavCity, getCities, getFavCity, getWeatherBulk, removeFavCity } from "~/models/weather.server";
import { Autocomplete } from "~/components/autocomplete";
import { WeatherBox } from "~/components/weatherbox";
import { destroySession, getSession } from "~/session.server";



const getCityPayload = async (userId:number = 0) => {
  if(userId)
  {
    const currentFavCity = await getFavCity(userId);
 
    const locations = currentFavCity.map((e:any) => {
      return {
        "q": e.city,
        "custom_id": e.id
      }
    })
    return {
      locations,
      currentFavCity
    }
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get("cookie"));
  // redirect to / if the user is logged-in
  if (!session.has("userId")){ 
    return redirect("/login")
  }
  console.log('session', session)
  const payload = await getCityPayload(session?.data?.userId)

  const response = await getWeatherBulk({locations: payload?.locations}); 
  const weatherList:any = await response.json(); 
  return json({ weatherList, session, currentFavCity: payload?.currentFavCity});
}

const getSearchCityWeather= async (city:string) => {
  const paload  = {
    "locations": [
        {
            "q": city,
            "custom_id": city+"001"
        },
        
    ]
  }
  
  const response = await getWeatherBulk(paload); 
  const weatherListLocal:any = await response.json(); 
  
  
  return json({ weatherListLocal, searchCities: null });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  console.log('sessionaction', session.data)
  if (request.method === 'POST') {
    let formData = await request.formData();
    console.log('formData', session.data.userId)
  
    const formname = formData?.get("formname") || ''
       
    if(formname === 'add_to_favorite') {
      const city = formData?.get("cityname") || '';
      if(city && session?.data?.userId){
        let user = await addFavCity(city+'', session.data.userId) 
      } 
    }
    else if(formname === 'remove_from_favorite') {
      
      const city = formData?.get("id") || null;
      
      if(city && session?.data?.userId){
        let user = await removeFavCity(parseInt(city.toString()), session.data.userId) 
      } 
    } 
    else if(formname === 'search') {
      const city = formData?.get("city") || null;      
      return getSearchCityWeather(city+'')
    } 
    else if(formname === 'autosearch') {
      const searchStr = formData?.get("searchStr") || '';
      if(searchStr){
        const responseRaw = await getCities(searchStr+'') 
        const searchCities = await responseRaw.json();
        return json({ searchCities, weatherListLocal: null});
      } 
    }  
        
    return redirect('/');  
  }
   
}

export default function  WeatherComponent() {
  const submit = useSubmit();
  const { weatherList, session, currentFavCity } = useLoaderData<typeof loader>();
  const actionProps = useActionData<typeof action>();
  let weatherListLocals:any;

  
  let searchCities:any;
  if(actionProps){
    if(actionProps.hasOwnProperty('weatherListLocal')){
      weatherListLocals = actionProps.weatherListLocal
    }
    if(actionProps.hasOwnProperty('searchCities')){
      searchCities = actionProps.searchCities
    }
  }
  
  console.log(weatherList, weatherListLocals, 'weatherListLocals')
  
  async function handleDataFromChild(data:string) {
    let ifCity = null;
    if(currentFavCity)    {
      ifCity = currentFavCity.find((x:any) => x.city === data)
    }
    if(!ifCity){
      submit({
        formname: 'search',
        city: data
      }, 
      { method: "POST" });
    }  
    
  }

  async function handleAutoSearch(data:string) {
    submit({
      formname: 'autosearch',
      searchStr: data
    }, 
    { method: "POST" });
  }
  async function handleAddRemoveAction(city:string, id:number, isFavorite:boolean) {
    

    if(isFavorite){
      submit({
        formname: 'remove_from_favorite',
        id: id
      }, 
      { method: "POST" });
    } 
    
    else if(currentFavCity && currentFavCity?.length>=5){
      alert('You can add upto 5 favorite city')
    } 
    else{
      submit({
        formname: 'add_to_favorite',
        cityname: city
      }, 
      { method: "POST" });
      
    }
  }
  
    return (<div className="min-h-full">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <img className="size-8" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  
                  <a href="#" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Weather Dashboard</a>
                  <div className="px-3 py-2 text-sm font-medium text-white"> Welcome to the weather app {session?.data?.username}</div>
                </div>                  
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">              

                <Form action="/logout" method="post">
                  <button  type="submit" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    Logout
                  </button>
                </Form>                  
                <div className="relative ml-3">
                  <div>
                    <button type="button" className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                      <span className="absolute -inset-1.5"></span>
                      <span className="sr-only">Open user menu</span>
                      <img className="size-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
    
        
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            
            <a href="#" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Dashboard</a>
          </div>
          <div className="border-t border-gray-700 pb-3 pt-4">
            
          </div>
        </div>
      </nav>
    
      <header className="bg-white shadow">
        
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex flex-row">
                  <div className="basis-1/3"><h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1></div>
                  <div className="basis-2/3"><Autocomplete 
                  sendDataToParent={handleDataFromChild} 
                  searchCities={searchCities}
                  handleAutoSearch={handleAutoSearch} 
                  /></div>
              </div>
          
          </div>  
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {(!weatherListLocals || weatherListLocals.length===0) && (!weatherList || weatherList?.error?.code) &&
          <>
          <div className="px-3 py-2 text-sm font-medium text-grey"> Welcome to the weather app, <b>{session?.data?.username}</b>.</div>
          <div className="px-3 py-2 text-sm font-medium text-grey"> Please search city to know the current weather details.</div>
        
          </>
          }
            <div className="grid grid-cols-12 gap-4">
                {weatherListLocals && weatherListLocals?.bulk.map((weatherDetails:any) => (
                <div className="col-span-12 sm:col-span-6 lg:col-span-4"><WeatherBox weatherDetails={weatherDetails} isFavorite={false} addRemoveAction={handleAddRemoveAction}/></div>
                ))}
            </div> 
              {weatherList && weatherList?.bulk && <>
              <h2 className="text-xl font-semibold tracking-tight text-gray-500 py-2 mt-2">My Favorite Cities</h2>
              <div className="grid grid-cols-12 gap-4">
                  {weatherList?.bulk?.map((weatherDetails:any) => (
                  <div className="col-span-12 sm:col-span-6 lg:col-span-4"><WeatherBox weatherDetails={weatherDetails} isFavorite={true} addRemoveAction={handleAddRemoveAction}/></div>
                  ))}
              </div>
              </> 
              }   
  
        </div>
      </main>
    </div>)

  }


      