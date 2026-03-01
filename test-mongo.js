const mongoose = require('mongoose');
const uri = "mongodb+srv://dattarajornaments_db_user:j3CRLgHCAu36K5u0@dattarajornaments.mu8k2v5.mongodb.net/dattarajornaments";

async function test() {
  try {
    await mongoose.connect(uri, { family: 4 });
    console.log("Connected successfully");
    process.exit(0);
  } catch (err) {
    console.error("Connection failed", err.message);
    process.exit(1);
  }
}
test();
