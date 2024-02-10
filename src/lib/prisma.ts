import { PrismaClient } from "@prisma/client"; //para conectar com o banco de dados


export const prisma = new PrismaClient({
    log: ['query']
}); 