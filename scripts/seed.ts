const { PrismaClient } = require("@prisma/client");
require('dotenv').config(); // Charger les variables d'environnement

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Fulfulde" },
        { name: "Chadian Arabic" },
        { name: "Bantu Languages" },
        { name: "Afro-Asiatic Languages" },
        { name: "Niger-Congo Languages" },
        { name: "Nilo-Saharan Languages" },
      ]
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();