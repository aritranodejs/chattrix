module.exports = {
  async up(db, client) {
    await db.createCollection("loggeddevices");
  },

  async down(db, client) {
    db.dropCollection("loggeddevices");
  }
};
