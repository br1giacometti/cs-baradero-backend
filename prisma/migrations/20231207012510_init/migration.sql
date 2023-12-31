-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "totalPuntos" INTEGER DEFAULT 0,
    "totalGanados" INTEGER NOT NULL DEFAULT 0,
    "totalPerdidos" INTEGER NOT NULL DEFAULT 0,
    "totalJornadasGanadas" INTEGER NOT NULL DEFAULT 0,
    "totalJornadasPerdidas" INTEGER NOT NULL DEFAULT 0,
    "totalJornadasEmpatadas" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partido" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "mapa" TEXT NOT NULL,
    "rondasCT" INTEGER NOT NULL,
    "rondasTT" INTEGER NOT NULL,
    "jornadaId" INTEGER,

    CONSTRAINT "Partido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jornada" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jornada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Puntuacion" (
    "id" SERIAL NOT NULL,
    "puntosObtenidos" INTEGER NOT NULL,
    "jugadorId" INTEGER NOT NULL,
    "partidoId" INTEGER NOT NULL,
    "partidosGanados" INTEGER NOT NULL DEFAULT 0,
    "partidosPerdidos" INTEGER NOT NULL DEFAULT 0,
    "jornadasEmpatados" INTEGER NOT NULL DEFAULT 0,
    "jornadasGanadas" INTEGER NOT NULL DEFAULT 0,
    "jornadasPerdidas" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Puntuacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EquipoCT" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EquipoTT" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_EquipoCT_AB_unique" ON "_EquipoCT"("A", "B");

-- CreateIndex
CREATE INDEX "_EquipoCT_B_index" ON "_EquipoCT"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EquipoTT_AB_unique" ON "_EquipoTT"("A", "B");

-- CreateIndex
CREATE INDEX "_EquipoTT_B_index" ON "_EquipoTT"("B");

-- AddForeignKey
ALTER TABLE "Partido" ADD CONSTRAINT "Partido_jornadaId_fkey" FOREIGN KEY ("jornadaId") REFERENCES "Jornada"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Puntuacion" ADD CONSTRAINT "Puntuacion_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Puntuacion" ADD CONSTRAINT "Puntuacion_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "Partido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipoCT" ADD CONSTRAINT "_EquipoCT_A_fkey" FOREIGN KEY ("A") REFERENCES "Partido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipoCT" ADD CONSTRAINT "_EquipoCT_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipoTT" ADD CONSTRAINT "_EquipoTT_A_fkey" FOREIGN KEY ("A") REFERENCES "Partido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipoTT" ADD CONSTRAINT "_EquipoTT_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
