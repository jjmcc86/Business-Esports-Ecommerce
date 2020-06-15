// console.log('hi there');

const express = require(`express`);
const bodyParser = require(`body-parser`);
const cookieSession = require(`cookie-session`);
// const usersRepo = require(`./repositories/users`);
const authRouter = require(`./routes/admin/auth`);
const adminProductsRouter = require(`./routes/admin/products`);
const productsRouter = require(`./routes/product`);
const cartsRouter = require(`./routes/carts`);

const app = express();

app.use(express.static(`public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: [ `juddouhdoudhoudhssu` ]
	})
);
//hook up the router from the auth.js
app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);
app.use(cartsRouter);

//connect to the server
app.listen(3000, () => {
	console.log(`Server has started`);
});
// const bodyParser = (req, res, next) => {
// 	if (req.method === `POST`) {
// 		req.on(`data`, (data) => {
// 			const parsed = data.toString(`utf8`).split(`&`);
// 			//take the array of strings and loop over it
// 			const formData = {};
// 			for (let pair of parsed) {
// 				const [ key, value ] = pair.split(`=`);
// 				formData[key] = value;
// 				console.log(formData);
// 			}
// 			req.body = formData;
// 			next();
// 		});
// 	} else {
// 		next();
// 	}
// };
