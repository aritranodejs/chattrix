# express-node-mysql
Local: npm start
Server: pm2 start --name "project-name"

# To install sequelize cli globally:
npm install -g sequelize-cli

# To create a table via migration:
sequelize migration:create --name create_users_table

# To add fields in a existing table:
sequelize migration:generate --name add_fields_to_users

# To run migration:
sequelize db:migrate

# To run migration for a specific env:
sequelize db:migrate --env staging

# To run specific migration:
sequelize db:migrate --name create_users_table

# To rollback the last batch of migration:
sequelize db:migrate:undo

# To rollback the specific migration:
sequelize db:migrate:undo --name create_users_table

# To rollback all the migrations:
sequelize db:migrate:undo:all

# To create seeder:
sequelize seed:generate --name create_users_seeder

# To run seeder:
sequelize db:seed:all

# To run seeder for a specific env:
sequelize db:seed --env staging

# To run specific seeder:
sequelize db:seed --seed create_users_seeder

# To rollback the last batch of seeder:
sequelize db:seed:undo

# To rollback specific seeder:
sequelize db:seed:undo --seed create_users_seeder

# To rollback all the seeders:
sequelize db:seed:undo:all

# To run migrations with seeders:
sequelize db:migrate && sequelize db:seed:all

# If sequelize cli not installed globally:
npx sequelize-cli
instead of
sequelize

# **************************** For MongoDB ******************************
# Install mongodb
npm install mongodb

# Install mongoose
npm install mongoose

# Install migrate-mongo globally
npm install -g migrate-mongo

# Setup migrate-mongo
npx migrate-mongo init

# To create a table via migration:
migrate-mongo create users_table

# Apply the Migration
migrate-mongo up

# Revert the Migration (if needed)
migrate-mongo down

# ******* Mongo Methods *********#
# 1. Retrieving Documents #
find(query, [fields], [options]): Retrieves all documents matching the query.
findById(id, [fields], [options]): Retrieves a document by its _id.
findOne(query, [fields], [options]): Retrieves a single document matching the query.
findOneAndUpdate(query, update, [options]): Finds a document and updates it, returning either the old or new document.
findOneAndDelete(query, [options]): Finds a document and deletes it.
findOneAndRemove(query, [options]): Finds and removes a document, similar to findOneAndDelete.
findByIdAndUpdate(id, update, [options]): Finds a document by its _id and updates it.
findByIdAndDelete(id, [options]): Finds a document by its _id and deletes it.
findByIdAndRemove(id, [options]): Finds and removes a document by its _id.
countDocuments(query): Returns the count of documents matching the query.
distinct(field, query): Finds distinct values for a specified field.

# 2. Inserting Documents #
create(doc(s)): Inserts one or more documents into the collection.
insertMany(docs, [options]): Inserts multiple documents at once.

# 3. Updating Documents #
updateOne(query, update, [options]): Updates a single document.
updateMany(query, update, [options]): Updates multiple documents that match the query.
replaceOne(query, doc, [options]): Replaces a single document that matches the query.

# 4. Deleting Documents #
deleteOne(query): Deletes a single document.
deleteMany(query): Deletes multiple documents.

# 5. Aggregation & Population #
aggregate(pipeline): Runs an aggregation pipeline.
populate(path): Populates references for specified fields.

# 6. Query Helpers #
Mongoose allows chaining of query helpers to modify the behavior of queries.

sort(fields): Sorts the result documents by one or more fields.
skip(n): Skips the first n documents.
limit(n): Limits the result set to n documents.
select(fields): Specifies which fields to include or exclude in the result.
lean(): Returns plain JavaScript objects instead of Mongoose documents.
exec(): Executes the query.

# 7. Document Methods #
These methods are available on individual Mongoose documents.

save(): Saves the current document to the database.
remove(): Removes the current document from the database.
toObject(): Converts the Mongoose document to a plain JavaScript object.
toJSON(): Converts the Mongoose document to a JSON object.

# 8. Model Static Methods #
You can define your own static methods directly on the model.
statics.methodName: Custom static methods defined in your model.

# 9. Model Instance Methods #
These are methods that are available on instances of the model.
methods.methodName: Custom instance methods defined in your model.

# 10. Virtuals #
Virtuals are document properties that are not stored in MongoDB but are computed from existing fields.
virtual('fieldName'): Defines a virtual field.

# 11. Hooks / Middleware #
Mongoose supports middleware that can be used to execute logic before or after certain operations.

pre('save', callback): Runs before saving a document.
post('save', callback): Runs after saving a document.
pre('remove', callback): Runs before removing a document.
post('remove', callback): Runs after removing a document.

# 12. Indexes #
Mongoose provides methods to work with indexes.

index(fields, [options]): Defines an index on a schema.
ensureIndexes(): Ensures that indexes are built on the model.
createIndexes(): Creates indexes on the model.

# 13. Transaction Support #
Mongoose supports MongoDB transactions (in replica set or sharded cluster setups).

startSession(): Starts a new session for transactions.
withTransaction(callback): Runs operations within a transaction.
#   c h a t t r i x 
 
 
