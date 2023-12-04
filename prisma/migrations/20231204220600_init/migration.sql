-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partido" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "mapa" TEXT NOT NULL,
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
CREATE UNIQUE INDEX "Player_tag_key" ON "Player"("tag");

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
ALTER TABLE "_EquipoCT" ADD CONSTRAINT "_EquipoCT_A_fkey" FOREIGN KEY ("A") REFERENCES "Partido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipoCT" ADD CONSTRAINT "_EquipoCT_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipoTT" ADD CONSTRAINT "_EquipoTT_A_fkey" FOREIGN KEY ("A") REFERENCES "Partido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipoTT" ADD CONSTRAINT "_EquipoTT_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
