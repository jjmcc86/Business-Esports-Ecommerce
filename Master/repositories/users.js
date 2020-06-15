const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UserRepository extends Repository {
	// create user
	async create(attrs) {
		// attrs : {email, password}
		attrs.id = this.randomId();

		const salt = crypto.randomBytes(8).toString('hex');
		const buff = await scrypt(attrs.password, salt, 64);

		const records = await this.getAll();
		const record = {
			...attrs,
			password: `${buff.toString('hex')}.${salt}`
		};

		records.push(record);
		// write back to file
		await this.writeAll(records);

		return record;
	}

	async comparePasswords(saved, supplied) {
		// saved = pass.hashed.salt
		// supplied = pass from user
		// const result = saved.split(".");
		// const hashed = result[0];
		// const salt = result[1];
		const [ hashed, salt ] = saved.split('.');
		const hashedSuppliedBuf = await scrypt(supplied, salt, 64);
		return hashed === hashedSuppliedBuf.toString('hex');
	}
}

module.exports = new UserRepository('users.json');

// // testing
// const test = async () => {
//   const repo = new UserRepository("users.json");
//   // await repo.create({ email: "test@test.com", password: "password" });
//   // const users = await repo.getAll();
//   // const user = await repo.getOne("1cd3ba17");
//   // delete
//   // await repo.delete("8d976ebd");

//   // update
//   // repo.update("1cd3ba17", { address: "home" });
//   // repo.update("123", { address: "home" });

//   // get one by
//   const user = await repo.getOneBy({
//     email: "test@test.com",
//     password: "password123",
//     id: "1cd3ba17",
//   });

//   console.log(user);
// };

// test();
