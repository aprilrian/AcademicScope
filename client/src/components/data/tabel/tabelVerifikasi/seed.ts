import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

import { Angkatan } from "./data";

const tasks = Array.from({ length: 100 }, () => ({
  nim: `TASK-${faker.datatype.number({ min: 1000, max: 9999 })}`,
  nama: faker.internet.userName(),
  angkatan: faker.helpers.arrayElement(Angkatan).value,
  nilai: faker.datatype.number({ min: 0, max: 100 }),
}));

fs.writeFileSync(
  path.join(__dirname, "mahasiswa.json"),
  JSON.stringify(tasks, null, 2)
);

console.log("✅ Tasks data generated.");
