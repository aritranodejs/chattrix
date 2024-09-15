module.exports = {
  async up(db, client) {
    await db.createCollection("friends");
  },

  async down(db, client) {
    db.dropCollection("friends");
  }
};
