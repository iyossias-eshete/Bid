
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        {firstName: "Birhan", lastName: 'Mulu', password: '$2a$10$Dt0kaRKMGXFFu0KgNrM4dOH5S5exWUW7bNxvIj03CXWXDLN3dQ2Du', email: 'abc2@gmail.com', accountNumber : 2, sex : 'Male' },
        {firstName: "Collins", lastName: 'Muler', password: '$2a$10$Dt0kaRKMGXFFu0KgNrM4dOH5S5exWUW7bNxvIj03CXWXDLN3dQ2Du', email: 'abc1@gmail.com', accountNumber : 1, sex : 'Male' },
      ]);
    });
};
