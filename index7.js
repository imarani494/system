import { json } from "body-parser";

let student = {
  name: "Alice",
  age: 22,
  course: "Computer Science"
};

const jsonString=json.stringify(student,null,2);
console.log(jsonString);