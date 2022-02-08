const mongoose = require("mongoose")

const connectDB = (url) => {
	return mongoose
		.connect(url)
		.then(() => console.log("banco offchain rodando"))
		.catch((err) => console.log(err))
}

module.exports = connectDB
