module.exports = {
  async up(db, client) {
    await db.createCollection("chats");
  },

  async down(db, client) {
    db.dropCollection("chats");
  }
};
