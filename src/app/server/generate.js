var faker = require('faker');

var database = { users: []};

for (var i = 1; i<= 10; i++) {
  database.users.push({
    id: i,
    name: faker.name.findName(),
    email: faker.internet.email(),
    type: faker.random.arrayElement(["User","Admin","ReadOnly"])
  });
}

console.log(JSON.stringify(database));