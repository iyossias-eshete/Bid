exports.up = function(knex) {
    return knex.schema.createTable('user', table =>{
      table.increments();
  
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('firstName').notNullable();
      table.string('lastName').notNullable();
      table.integer('accountNumber').notNullable();
      table.string('string').notNullable();      
  
      table.timestamps( true, true );  
  
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('user');
  };