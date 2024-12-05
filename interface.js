// Interface class which is used to create objects of data which
// can be passed to different services for communication.
class Interfaces {
  name;
  email;
  password;
  age;
  address;
  type;
  balance;
  account;
  tokens;
  transactions;

  createUser(body) {
    let obj = {
      name: body.name,
      email: body.email,
      password: body.password,
      age: body.age,
      address: body.address,
    };

    if (body.type) {
      obj.type = body.type;
    }

    return obj;
  }

  loginUser(body) {
    const obj = {
      email: body.email,
      password: body.password,
    };

    return obj;
  }

  transaction(accountId, amount) {
    const obj = {
      accountId,
      amount,
    };

    return obj;
  }

  transfer(sourceAccountId, destinationAccountId, amount) {
    const obj = {
      sourceAccountId,
      destinationAccountId,
      amount,
    };

    return obj;
  }
}

module.exports = Interfaces;
