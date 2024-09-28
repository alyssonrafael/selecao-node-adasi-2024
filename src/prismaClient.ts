import { PrismaClient } from "@prisma/client";

// Instância única do PrismaClient para nao gerar multiplas instacias do prisma, dessa forma e possivel aproveitar as chamadas ao banco.
const prisma = new PrismaClient();

export default prisma;
