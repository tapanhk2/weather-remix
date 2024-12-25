import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

    export const getWeatherBulk = async (payload:any) => {   
        const rawResponse = await fetch(`${process.env.WEATHER_API_BASE}/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=bulk`, {
            method: 'POST',        
            body: JSON.stringify(payload)
            
        })
    
        return rawResponse    
    };

    export const getCities = async (str:string) => {
        return await fetch(
            `${process.env.WEATHER_API_BASE}/v1/search.json?key=${process.env.WEATHER_API_KEY}&q=${str}`
        );      
    };  

    export const getWeatherCity = async () => {
        return await fetch(
            `${process.env.WEATHER_API_BASE}/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=Del`
        );      
    };

    export const addFavCity = async (city:string, userId:number) => {        
        return prisma.favourite_cities.create({

            data: {
                city: city,
                user_id: userId
            }
          });
             
    };

    

    export const getFavCity = async (userId:number) => {        
        return prisma.favourite_cities.findMany({
            where: {
                user_id: userId
            }
        });  
    };

    export const removeFavCity = async (id:number, userId:number) => {        
        return prisma.favourite_cities.delete({
            where: {
                id: id,
                user_id: userId
            }
          });
             
    };

    
    