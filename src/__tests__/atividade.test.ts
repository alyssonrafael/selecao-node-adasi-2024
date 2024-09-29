import request from "supertest";
import app from "../index";
import prisma from "../prismaClient";

let cursoId: string;
let estudanteCpf: string;
let tarefaId: string;

beforeAll(async () => {
  // Criar um curso para os testes
  const cursoResponse = await request(app)
    .post("/api/cursos")
    .send({ nome: "Curso de Teste" });
  cursoId = cursoResponse.body.id;

  // Criar um estudante para os testes
  const estudanteResponse = await request(app).post("/api/estudante").send({
    cpf: "12345678900",
    nome: "Rafael",
    matricula: "987654321",
    cursoId,
  });
  estudanteCpf = estudanteResponse.body.cpf;

  // Criar uma tarefa para os testes
  const tarefaResponse = await request(app)
    .post("/api/tarefa")
    .send({ nome: "Nova Tarefa" });
  tarefaId = tarefaResponse.body.id;
});

afterAll(async () => {
  // Limpar os dados após os testes
  await prisma.atividade.deleteMany({});
  await prisma.estudante.deleteMany({});
  await prisma.curso.deleteMany({});
  await prisma.tarefa.deleteMany({});
});

describe("Atividades", () => {
  describe("POST /api/atividade", () => {
    it("deve criar uma atividade com sucesso", async () => {
      const response = await request(app).post("/api/atividade").send({
        tarefaId: tarefaId,
        estudanteId: estudanteCpf,
        data: "2024-09-28",
        horaAgendamentoInicio: "10:00:00",
        horaAgendamentoTermino: "10:30:00",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
    });

    it("não deve criar uma atividade com campos vazios", async () => {
      const response = await request(app).post("/api/atividade").send({
        tarefaId,
        estudanteId: "",
        data: "",
        horaAgendamentoInicio: "",
        horaAgendamentoTermino: "",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("não deve criar uma atividade com ID de tarefa inválido", async () => {
        const response = await request(app).post("/api/atividade").send({
          tarefaId: "invalid-tarefa-id", //id invalido
          estudanteId: estudanteCpf,
          data: "2024-09-28",
          horaAgendamentoInicio: "10:00:00",
          horaAgendamentoTermino: "10:30:00",
        });
    
        expect(response.status).toBe(404); // Ajuste conforme sua implementação
        expect(response.body).toHaveProperty("error", "Tarefa não encontrada."); // Ajuste a mensagem conforme sua implementação
      });
    
      it("não deve criar uma atividade com ID de estudante inválido", async () => {
        const response = await request(app).post("/api/atividade").send({
          tarefaId,
          estudanteId: "invalid-estudante-id", //id do estudante invalido
          data: "2024-09-28",
          horaAgendamentoInicio: "10:00:00",
          horaAgendamentoTermino: "10:30:00",
        });
    
        expect(response.status).toBe(404); // Ajuste conforme sua implementação
        expect(response.body).toHaveProperty("error", "Estudante não encontrado."); // Ajuste a mensagem conforme sua implementação
      });

    it("Não deve criar uma atividade com mais de 6h", async () => {
      const response = await request(app).post("/api/atividade").send({
        tarefaId,
        estudanteId: estudanteCpf,
        data: "2024-09-28",
        horaAgendamentoInicio: "10:00:00",
        horaAgendamentoTermino: "17:30:00",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "A duração da atividade não pode ultrapassar 6 horas."
      );
    });
    it("Não deve criar uma atividade com a hora de termino menor que a de inicio", async () => {
      const response = await request(app).post("/api/atividade").send({
        tarefaId,
        estudanteId: estudanteCpf,
        data: "2024-09-28",
        horaAgendamentoInicio: "10:00:00",
        horaAgendamentoTermino: "09:00:00",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "A data e hora de término não podem ser anteriores e nem iguais à data e hora de início."
      );
    });
  });

  describe("GET /api/atividades", () => {
    it("deve retornar todas as atividades", async () => {
      const response = await request(app).get("/api/atividades");
  
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true); // Verifica se a resposta é um array
    });
  
    it("deve retornar uma atividade específica", async () => {
      // Primeiro, crie uma atividade para garantir que haja dados para buscar
      const atividadeResponse = await request(app).post("/api/atividade").send({
        tarefaId,
        estudanteId: estudanteCpf,
        data: "2024-09-28",
        horaAgendamentoInicio: "10:00:00",
        horaAgendamentoTermino: "10:30:00",
      });
      
      const atividadeId = atividadeResponse.body.id;
  
      const response = await request(app).get(`/api/atividade/${atividadeId}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", atividadeId); // Verifica se o ID está correto
    });
  
    it("deve retornar 404 para atividade não encontrada", async () => {
      const response = await request(app).get("/api/atividade/invalid-id"); //id invalido
  
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Atividade não encontrada."); // Ajuste a mensagem conforme sua implementação
    });
  });

  describe("PUT /api/atividade/:id", () => {
    let atividadeId: string;
  
    beforeAll(async () => {
      // Criar uma atividade para usar nos testes
      const atividadeResponse = await request(app).post("/api/atividade").send({
        tarefaId,
        estudanteId: estudanteCpf,
        data: "2024-09-28",
        horaAgendamentoInicio: "10:00:00",
        horaAgendamentoTermino: "10:30:00",
      });
      atividadeId = atividadeResponse.body.id;
    });
  
    it("deve atualizar uma atividade com sucesso", async () => {
      const response = await request(app).put(`/api/atividade/${atividadeId}`).send({
        tarefaId,
        estudanteId: estudanteCpf,
        data: "2024-09-29",
        horaAgendamentoInicio: "11:00:00",
        horaAgendamentoTermino: "11:30:00",
      });
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", atividadeId);
    });
  
    it("não deve atualizar uma atividade com campos vazios", async () => {
      const response = await request(app).put(`/api/atividade/${atividadeId}`).send({
        tarefaId,
        estudanteId: "",
        data: "",
        horaAgendamentoInicio: "",
        horaAgendamentoTermino: "",
      });
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Todos os campos são obrigatórios."); // Ajuste conforme sua implementação
    });
  
    it("não deve atualizar uma atividade com ID de tarefa inválido", async () => {
      const response = await request(app).put(`/api/atividade/${atividadeId}`).send({
        tarefaId: "invalid-tarefa-id",
        estudanteId: estudanteCpf,
        data: "2024-09-29",
        horaAgendamentoInicio: "11:00:00",
        horaAgendamentoTermino: "11:30:00",
      });
  
      expect(response.status).toBe(404); // Ajuste conforme sua implementação
      expect(response.body).toHaveProperty("error", "Tarefa não encontrada."); // Ajuste a mensagem conforme sua implementação
    });
  
    it("não deve atualizar uma atividade com ID de estudante inválido", async () => {
      const response = await request(app).put(`/api/atividade/${atividadeId}`).send({
        tarefaId,
        estudanteId: "invalid-estudante-id",
        data: "2024-09-29",
        horaAgendamentoInicio: "11:00:00",
        horaAgendamentoTermino: "11:30:00",
      });
  
      expect(response.status).toBe(404); // Ajuste conforme sua implementação
      expect(response.body).toHaveProperty("error", "Estudante não encontrado."); // Ajuste a mensagem conforme sua implementação
    });
  
    it("não deve atualizar uma atividade com duração maior que 6 horas", async () => {
      const response = await request(app).put(`/api/atividade/${atividadeId}`).send({
        tarefaId,
        estudanteId: estudanteCpf,
        data: "2024-09-29",
        horaAgendamentoInicio: "10:00:00",
        horaAgendamentoTermino: "17:00:00", // Duração de 7 horas
      });
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', "A duração da atividade não pode ultrapassar 6 horas.");
    });
  
    it("não deve atualizar uma atividade se a hora de término for anterior à hora de início", async () => {
      const response = await request(app).put(`/api/atividade/${atividadeId}`).send({
        tarefaId,
        estudanteId: estudanteCpf,
        data: "2024-09-29",
        horaAgendamentoInicio: "12:00:00",
        horaAgendamentoTermino: "11:00:00", // Hora de término antes da hora de início
      });
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', "A data e hora de término não podem ser anteriores e nem iguais à data e hora de início.");
    });
  });

  describe("DELETE /api/atividade/:id", () => {
    let atividadeId: string;
  
    beforeAll(async () => {
      // Criar uma atividade para usar nos testes
      const atividadeResponse = await request(app).post("/api/atividade").send({
        tarefaId,
        estudanteId: estudanteCpf,
        data: "2024-09-28",
        horaAgendamentoInicio: "10:00:00",
        horaAgendamentoTermino: "10:30:00",
      });
      atividadeId = atividadeResponse.body.id;
    });
  
    it("deve deletar uma atividade com sucesso", async () => {
      const response = await request(app).delete(`/api/atividade/${atividadeId}`);
      
      expect(response.status).toBe(204); 
    });
  
    it("não deve deletar uma atividade com ID inválido", async () => {
      const response = await request(app).delete(`/api/atividade/invalid-id`);
  
      expect(response.status).toBe(404); 
      expect(response.body).toHaveProperty("message", "Atividade não encontrada."); 
    });
  });
  
  describe("PATCH /api/atividade/:id/iniciar", () => {
    let atividadeId: string;
  
    beforeAll(async () => {
      // Criar uma atividade para usar nos testes
      const atividadeResponse = await request(app).post("/api/atividade").send({
        tarefaId,
        estudanteId: estudanteCpf,
        data: "2024-09-28",
        horaAgendamentoInicio: "10:00:00",
        horaAgendamentoTermino: "10:30:00",
      });
      atividadeId = atividadeResponse.body.id;
    });
  
    it("deve iniciar uma atividade com sucesso", async () => {
      const response = await request(app)
        .patch(`/api/atividade/${atividadeId}/iniciar`)
        .send({ horaInicio: "10:00:00" });
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("horaInicio");
    });

    it("não deve iniciar uma atividade com hora de início vazia", async () => {
        const response = await request(app)
          .patch(`/api/atividade/${atividadeId}/iniciar`)
          .send({ horaInicio: "" }); // Campo vazio
      
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Hora de início e(ou) hora de término são obrigatórias.");
      });
  
    it("não deve iniciar uma atividade com um id inválido", async () => {
      const response = await request(app)
        .patch("/api/atividade/invalid-id/iniciar") //id invalido
        .send({ horaInicio: "10:00:00" });
  
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Atividade não encontrada.");
    });
    
    it("não deve iniciar uma atividade 15 minutos antes do horário de agendamento", async () => {
      const response = await request(app)
        .patch(`/api/atividade/${atividadeId}/iniciar`)
        .send({ horaInicio: "09:45:00" }); // 15 minutos antes de 10:00
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "A atividade só pode ser iniciada com uma tolerância de 15 minutos para mais ou para menos em relação à hora de agendamento.");
    });

    it("não deve iniciar uma atividade 15 minutos depois do horário de agendamento", async () => {
      const response = await request(app)
        .patch(`/api/atividade/${atividadeId}/iniciar`)
        .send({ horaInicio: "10:15:00" }); // 15 minutos antes de 10:00
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "A atividade só pode ser iniciada com uma tolerância de 15 minutos para mais ou para menos em relação à hora de agendamento.");
    });
  });

  describe("PATCH /api/atividade/:id/finalizar", () => {
    let atividadeId: string;
    beforeAll(async () => {
      // Criar uma atividade para usar nos testes
      const atividadeResponse = await request(app).post("/api/atividade").send({
        tarefaId,
        estudanteId: estudanteCpf,
        data: "2024-09-28",
        horaAgendamentoInicio: "10:00:00",
        horaAgendamentoTermino: "10:30:00",
      });
      atividadeId = atividadeResponse.body.id;
    });

    it("não deve finalizar uma atividade que não foi iniciada", async () => {
        const response = await request(app)
            .patch(`/api/atividade/${atividadeId}/finalizar`)
            .send({ horaTermino: "12:00:00" }); // Horário de término

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "A atividade deve ser iniciada antes de ser encerrada.");
    });

    it("deve finalizar a atividade com sucesso", async () => {
        // Primeiro, inicie a atividade
        await request(app)
            .patch(`/api/atividade/${atividadeId}/iniciar`)
            .send({ horaInicio: "10:00:00" });

        // Agora finalize a atividade
        const response = await request(app)
            .patch(`/api/atividade/${atividadeId}/finalizar`)
            .send({ horaTermino: "10:30:00" });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", atividadeId);
    });
  
    it("não deve finalizar uma atividade com campo vazio", async () => {
      const response = await request(app)
        .patch(`/api/atividade/${atividadeId}/finalizar`)
        .send({ horaTermino: "" }); // Campo vazio
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Hora de início e(ou) hora de término são obrigatórias.");
    });
  
    it("não deve finalizar uma atividade se hora de fim for antes da hora de início", async () => {
      const response = await request(app)
        .patch(`/api/atividade/${atividadeId}/finalizar`)
        .send({ horaTermino: "09:00:00" }); // Hora de fim antes da hora de início
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "A hora de término deve ser posterior à hora de início e à hora de agendamento.");
    });
  });

});
