


class Users {
  constructor () {
    this.users = [];
  }

  addUser (id, name, room) {
    var user = {id, name, room}
    this.users.push(user);
    return user;
  }
  removeUser (id) {
    var user = this.users.find((user) => user.id === id);
    this.users = this.users.filter((user) => user.id !== id);
    return user;
  }
  getUser (id) {
    var user = this.users.find((user) => user.id === id);
    return user;
  }
  getUserList(room) {
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => user.name);

    return namesArray;
  }
}

var users = new Users();

console.log(users.addUser('123', 'Test', 'Mol'));
console.log(users.addUser('1234', 'Test1', 'Mol'));

console.log(users.getUserList('Mol'));

console.log(users.removeUser('123'));

console.log(users.getUserList('Mol'));

console.log(users.getUser('1234'));

module.exports = {Users};
