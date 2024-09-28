-- CreateTable
CREATE TABLE "atividade" (
    "id" TEXT NOT NULL,
    "tarefaId" TEXT NOT NULL,
    "estudanteId" TEXT NOT NULL,
    "data" DATE NOT NULL,
    "horaAgendamentoInicio" TIME NOT NULL,
    "horaAgendamentoTermino" TIME NOT NULL,
    "horaInicio" TIME,
    "horaTermino" TIME,

    CONSTRAINT "atividade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "atividade" ADD CONSTRAINT "atividade_tarefaId_fkey" FOREIGN KEY ("tarefaId") REFERENCES "tarefa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividade" ADD CONSTRAINT "atividade_estudanteId_fkey" FOREIGN KEY ("estudanteId") REFERENCES "estudantes"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;
