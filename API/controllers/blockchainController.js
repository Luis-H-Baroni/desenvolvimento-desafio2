const { Wallets, Gateway } = require("fabric-network")
const fs = require("fs")
const path = require("path")
const Usuario = require("../models/usuarioModel")
const Network = require("../addNetwork")

// capture network variables from config.json
const configPath = path.join(process.cwd(), "config.json")
const configJSON = fs.readFileSync(configPath, "utf8")
const config = JSON.parse(configJSON)
let connection_file = config.connection_file

const ccpPath = path.join(process.cwd(), connection_file)
const ccpJSON = fs.readFileSync(ccpPath, "utf8")
const ccp = JSON.parse(ccpJSON)

const userExists = async (req, res) => {
	const { userId } = req.body
	console.log("teste")
	try {
		const walletPath = path.join(process.cwd(), "wallet")
		const wallet = await Wallets.newFileSystemWallet(walletPath)

		const gateway = new Gateway()
		await gateway.connect(ccp, {
			wallet,
			identity: "Org1 Admin",
			discovery: { enabled: true, asLocalhost: true },
		})

		const network = await gateway.getNetwork("mychannel")

		const contract = await network.getContract("smart-contract")

		const response = await contract.submitTransaction("usuarioExists", userId)

		console.log(response)

		res.status(200).json(JSON.parse(response.toString()))
	} catch (error) {
		console.log(error)
	}
}

//creates a user on offchain db, generates a id, and then register the user on blockchain with that id
const createUser = async (req, res) => {
	//generates a random 6 number id
	const getIdNumber = () => {
		var n = Math.floor(Math.random() * 1000000)
		if (n < 100000) {
			return getIdNumber()
		} else {
			return n
		}
	}

	const payload = {
		userID: String(getIdNumber()),
		nome: req.body.nome,
		email: req.body.email,
		rh: req.body.rh,
	}
	console.log("Payload to be sent:")
	console.log(payload)

	//create user on offchain db
	await Usuario.create(payload).then((response) => {
		console.log("1 - Create offchain db register")
		if (
			typeof response === "object" &&
			"error" in response &&
			response.error !== null
		) {
			console.log("1 - Error")
			return res.status(500).json({
				error: response.error,
			})
		} else {
			//check if 'rh' flag is true
			if (payload.rh) {
				//register user on blockchain with 'rh' attributes
				console.log("2 - Register RH on network")
				Network.registerRhOnNetwork(payload.userID, payload.rh).then(
					(response) => {
						//return error if error in response
						if (
							typeof response === "object" &&
							"error" in response &&
							response.error !== null
						) {
							console.log(response.error)
							res.status(500).json({
								error: response.error,
							})

							//deletes previous created user
							Usuario.findOneAndDelete({ userID: payload.userID }).then(() => {
								console.log("2 - Error")
								console.log("2 - Delete offchain db register")
								return
							})
						} else {
							//else return success
							console.log("2 - Registered on network")
							return res.status(201).json({ success: response })
						}
					}
				)
			} else {
				//register user on blockchain without 'rh' attributes
				console.log("2 - Register on network")
				Network.registerOnNetwork(payload.userID, payload.rh).then(
					(response) => {
						//return error if error in response
						if (
							typeof response === "object" &&
							"error" in response &&
							response.error !== null
						) {
							console.log(response.error)
							res.status(500).json({
								error: response.error,
							})

							//deletes previous created user
							Usuario.findOneAndDelete({ userID: payload.userID }).then(() => {
								console.log("2 - Error")
								console.log("2 - Delete offchain db register")
								return
							})
						} else {
							//else return success
							console.log("2 - Registered on network")
							return res.status(201).json({ success: response })
						}
					}
				)
			}
		}
	})
}

const readUser = async (req, res) => {
	const { userId } = req.body
	try {
		const walletPath = path.join(process.cwd(), "wallet")
		const wallet = await Wallets.newFileSystemWallet(walletPath)

		const gateway = new Gateway()
		await gateway.connect(ccp, {
			wallet,
			identity: "Org1 Admin",
			discovery: { enabled: true, asLocalhost: true },
		})

		const network = await gateway.getNetwork("mychannel")

		const contract = await network.getContract("smart-contract")

		const response = await contract.submitTransaction("readUsuario", userId)

		console.log(response)

		res.status(200).json(JSON.parse(response.toString()))
	} catch (error) {
		console.log(error)
		res.status(400).json(error)
	}
}

const deleteUser = async (req, res) => {
	const { userId } = req.body
	try {
		const walletPath = path.join(process.cwd(), "wallet")
		const wallet = await Wallets.newFileSystemWallet(walletPath)

		const gateway = new Gateway()
		await gateway.connect(ccp, {
			wallet,
			identity: "Org1 Admin",
			discovery: { enabled: true, asLocalhost: true },
		})

		const network = await gateway.getNetwork("mychannel")

		const contract = await network.getContract("smart-contract")

		const response = await contract.submitTransaction("deleteUsuario", userId)

		console.log(response)

		res.status(200).json(JSON.parse(response.toString()))
	} catch (error) {
		res.status(400).json(error)
	}
}

const sendValue = async (req, res) => {
	const { userId1, userKey, userId2, value } = req.body
	try {
		const walletPath = path.join(process.cwd(), "wallet")
		const wallet = await Wallets.newFileSystemWallet(walletPath)

		const gateway = new Gateway()
		await gateway.connect(ccp, {
			wallet,
			identity: "Org1 Admin",
			discovery: { enabled: true, asLocalhost: true },
		})

		const network = await gateway.getNetwork("mychannel")

		const contract = await network.getContract("smart-contract")

		const response = await contract.submitTransaction(
			"eviarSaldo",
			userId1,
			userKey,
			userId2,
			value
		)

		console.log(response)

		res.status(200).json(JSON.parse(response.toString()))
	} catch (error) {
		res.status(400).json(error)
	}
}

const startCycle = async (req, res) => {
	try {
		const walletPath = path.join(process.cwd(), "wallet")
		const wallet = await Wallets.newFileSystemWallet(walletPath)

		const gateway = new Gateway()
		await gateway.connect(ccp, {
			wallet,
			identity: "vini",
			discovery: { enabled: true, asLocalhost: true },
		})

		const network = await gateway.getNetwork("mychannel")

		const contract = await network.getContract("smart-contract")

		const response = await contract.submitTransaction("iniciaCiclo")

		console.log(response)

		res.status(200).json(JSON.parse(response.toString()))
	} catch (error) {
		res.status(400).json(error)
	}
}

const redeemPoints = async (req, res) => {
	const { userId, userKey, value } = req.body
	try {
		const walletPath = path.join(process.cwd(), "wallet")
		const wallet = await Wallets.newFileSystemWallet(walletPath)

		const gateway = new Gateway()
		await gateway.connect(ccp, {
			wallet,
			identity: "Org1 Admin",
			discovery: { enabled: true, asLocalhost: true },
		})

		const network = await gateway.getNetwork("mychannel")

		const contract = await network.getContract("smart-contract")

		const response = await contract.submitTransaction(
			"retirarPontos",
			userId,
			userKey,
			value
		)

		console.log(response)

		res.status(200).json(response)
	} catch (error) {
		res.status(400).json(error)
	}
}

const endCycle = async (req, res) => {
	try {
		const walletPath = path.join(process.cwd(), "wallet")
		const wallet = await Wallets.newFileSystemWallet(walletPath)

		const gateway = new Gateway()
		await gateway.connect(ccp, {
			wallet,
			identity: "001",
			discovery: { enabled: true, asLocalhost: true },
		})

		const network = await gateway.getNetwork("mychannel")

		const contract = await network.getContract("smart-contract")

		const response = await contract.submitTransaction("finalizaCiclo")

		console.log(response)

		res.status(200).json(JSON.parse(response.toString()))
	} catch (error) {
		res.status(400).json(error)
	}
}

const getHistory = async (req, res) => {
	try {
		const walletPath = path.join(process.cwd(), "wallet")
		const wallet = await Wallets.newFileSystemWallet(walletPath)

		const gateway = new Gateway()
		await gateway.connect(ccp, {
			wallet,
			identity: "Org1 Admin",
			discovery: { enabled: true, asLocalhost: true },
		})

		const network = await gateway.getNetwork("mychannel")

		const contract = await network.getContract("smart-contract")

		const response = await contract.submitTransaction("TxHistory")

		console.log(response)

		res.status(200).json(response)
	} catch (error) {
		res.status(400).json(error)
	}
}

module.exports = {
	userExists,
	createUser,
	readUser,
	deleteUser,
	sendValue,
	startCycle,
	redeemPoints,
	endCycle,
	getHistory,
}
