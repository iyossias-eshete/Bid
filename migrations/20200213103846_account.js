
exports.up = function(knex) {
  return knex.schema.createTable('account', table =>{
    table.increments();
    table.string('holdersFirstName').notNullable();
    table.string('holdersLastName').notNullable();
    table.string('holdersEmail').notNullable().unique();
    table.timestamps(true,true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('account');
};
