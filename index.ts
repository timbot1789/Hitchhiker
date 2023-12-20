await Bun.write("example.txt", "This is random garbage");
const file = Bun.file("example.txt");
console.log(await file.text());
