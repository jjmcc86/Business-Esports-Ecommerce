const fs = require(`fs`);
const crypto = require(`crypto`);
const util = require(`util`);
const Repository = require(`./repository`);

const scrypt = util.promisify(crypto.scrypt);

class UserRepository extends Repository {
	async create(attrs) {
		//assume attrs always is email and password
		attrs.id = this.randomId();
		//{email: alshs@gmail.com, password:`password`}
		const salt = crypto.randomBytes(8).toString(`hex`);
		const buff = await scrypt(attrs.password, salt, 64);

		const records = await this.getAll();
		const record = { ...attrs, password: `${buff.toString(`hex`)}.${salt}` };
		records.push(record);
		//write updated 'records' array back to this.filename
		await this.writeAll(records);
		return record;
	}
	//saved -> password saved in database.hashed string.salt
	//supplied -> password given to us by a user trying to sign in
	async comparePasswords(saved, supplied) {
		// const result = saved.split(`.`);
		// const hashed = result[0];
		// salt = result[1];
		//SAME CODE FOR THOSE THREE LINES BELOW

		const [ hashed, salt ] = saved.split(`.`);
		const hashedSuppliedBuf = await scrypt(supplied, salt, 64);
		console.log(supplied);
		return hashed === hashedSuppliedBuf.toString(`hex`);
	}
}

//Test code
// const test = async () => {
// 	const repo = new UserRepository(`users.json`);
// 	// await repo.create({ email: `test@test.com`, password: `password` });
// 	// const users = await repo.getOne(`f1149aea`);
// 	// await repo.update({ email: `testing@test.com`, password: `mypassword` });
// 	// console.log(user);
// 	const user = await repo.getOneBy({ email: `test@test.com`, password: `password` });
// 	console.log(user);
// };

// test();
module.exports = new UserRepository(`users.json`);
