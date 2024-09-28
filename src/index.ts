import express from "express";
import dotenv from "dotenv";
import prisma from "./prismaClient";
import cursoRoutes from "./routes/cursoRoutes";
import estudantesRoutes from "./routes/estudanteRoutes"

// Carregar variáveis de ambiente do .env
dotenv.config();

const app = express();
app.use(express.json());
//usa as rotas do cursoRotes
app.use("/api", cursoRoutes);
app.use("/api", estudantesRoutes);

const PORT = process.env.PORT || 3333;

// Função para testar a conexão com o banco de dados
async function testConnection() {
  try {
    // Tenta conectar ao banco de dados
    await prisma.$connect();
    console.log("Conexão com o banco de dados bem-sucedida!");
    prisma.$disconnect();
    console.log("Conexão de teste encerrada!");
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
  }
}
// Testar a conexão ao iniciar o servidor
testConnection();

//fica ouvindo na porta 3333 ou na porta configurada no .env
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});