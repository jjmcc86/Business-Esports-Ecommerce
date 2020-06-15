//Copy in route handlers
const express = require(`express`);

const { handleErrors } = require(`./middlewares`);
const usersRepo = require(`../../repositories/users`);
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require(`../../views/admin/auth/signin`);
const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	requireEmailExists,
	requireValidPasswordForUser
} = require(`./validators`);

const router = express.Router();
//SIGNUP LOGIC
router.get(`/signup`, (req, res) => {
	res.send(signupTemplate({ req }));
});

//POST REQUEST
router.post(
	`/signup`,
	[ requireEmail, requirePassword, requirePasswordConfirmation ],
	handleErrors(signupTemplate),
	async (req, res) => {
		const { email, password } = req.body;

		//create a user in our user repo to represent this person
		const user = await usersRepo.create({ email, password });
		//store the id of that user inside the users cookie
		req.session.userId = user.id; //added by cookie session
		//get access to email, password, password confirmation
		res.redirect(`/admin/products`);
	}
);

//SIGNOUT LOGIC
router.get(`/signout`, (req, res) => {
	req.session = null;
	res.send(`You are logged out`);
});

//SIGNIN LOGIC
router.get(`/signin`, (req, res) => {
	res.send(signinTemplate({}));
});

//SIGNIN POST REQUEST
router.post(
	`/signin`,
	[ requireEmailExists, requireValidPasswordForUser ],
	handleErrors(signinTemplate),
	async (req, res) => {
		const { email } = req.body;
		const user = await usersRepo.getOneBy({ email });

		req.session.userId = user.id;
		res.redirect(`/admin/products`);
	}
);

module.exports = router;
