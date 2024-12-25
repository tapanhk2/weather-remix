import { PrismaClient } from "@prisma/client";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');



export async function findUser (authData:any){
  
    const isUser =  await prisma.users.findUnique({
      where: {
        username: authData.username,
        is_active: 'Y'
      }
    }); 
    if(isUser){
      const passwordMatched = await bcrypt.compare(authData.password, isUser?.password);      
      if(passwordMatched){  
        return {
            username: isUser?.username,
            id: isUser?.id,
            role: 'admin'
        }
      }
    }
    return null;   

}

export async function createUser(
    username: string,
    password: string
  ) {
    
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.users.create({
      data: {
        username: username,
        password: hashedPassword,
        is_active: 'Y'
      }
    });
  }
  
