import * as isEmail from "isemail";

const email = process.argv[2];

try {
  isEmail.validate(email);
} catch (e) {
  console.error(`invalid email "${email}"`);
  process.exit(1);
}

console.log(`welcome ${email}`);
