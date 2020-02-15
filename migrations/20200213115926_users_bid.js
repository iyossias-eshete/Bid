
exports.up = function (knex) {
    return knex.schema.createTable('usersBid', table => {
        table.increments();

        table.integer('userId')
            .references('id')
            .inTable('user')
            .onDelete('CASCADE')
            .index();

        table.integer('bidId')
            .references('id')
            .inTable('bid')
            .onDelete('CASCADE')
            .index();

        table.float('amount')
            .notNullable();

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('usersBid');
};
