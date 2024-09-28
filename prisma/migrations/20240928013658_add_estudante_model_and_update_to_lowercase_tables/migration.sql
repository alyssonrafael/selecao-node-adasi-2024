/*
  Warnings:

  - You are about to drop the `Curso` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Curso";

-- CreateTable
CREATE TABLE "curso" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estudantes" (
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,

    CONSTRAINT "estudantes_pkey" PRIMARY KEY ("cpf")
);

-- CreateIndex
CREATE UNIQUE INDEX "estudantes_cpf_key" ON "estudantes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "estudantes_matricula_key" ON "estudantes"("matricula");

-- AddForeignKey
ALTER TABLE "estudantes" ADD CONSTRAINT "estudantes_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
