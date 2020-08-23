import { fstat } from "fs";
import encrypt from "quick-encrypt";

function generateAndWriteKeys() {
  const keys = encrypt.generate(1024);

  fs.writeFile("db/keys.json", JSON.stringify(keys), {}, () => {});
}
