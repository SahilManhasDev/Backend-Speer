const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  async up(db, client) {
    var collection = db.collection("users");
    const hash = bcrypt.hashSync("admin123456", saltRounds);
    collection.insertOne({
      name: "Pawan",
      email: "admin@laundryhut.com",
      phone: 9998765432,
      password_hash: hash,
      status: 'active',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date(),
    });
  },

  async down(db, client) {
    var collection = db.collection("users");
    collection.remove({});
  }
};
