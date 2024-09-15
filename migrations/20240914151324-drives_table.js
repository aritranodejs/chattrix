module.exports = {
  async up(db, client) {
    await db.createCollection("drives");
  },

  async down(db, client) {
    db.dropCollection("drives");
  }
};
