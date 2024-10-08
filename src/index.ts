import express from "express";
import dotenv from "dotenv";
import prisma from "./prismaClient";
import cursoRoutes from "./routes/cursoRoutes";
import estudantesRoutes from "./routes/estudanteRoutes"
import tarefaRoutes from "./routes/tarefaRoutes"
import atividadeRoutes from "./routes/atividadeRoutes"

// Carregar variáveis de ambiente do .env
dotenv.config();

const app = express();
app.use(express.json());
//usa as rotas do cursoRotes
app.use("/api", cursoRoutes);
app.use("/api", estudantesRoutes);
app.use("/api", tarefaRoutes)
app.use("/api", atividadeRoutes)

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
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app; // Exporta a instância do app para usar nos testes