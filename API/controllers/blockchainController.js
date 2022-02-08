const { Wallets, Gateway } = require("fabric-network")
const fs = require("fs")
const path = require("path")

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

const createUser = async (req, res) => {
	const { userId, value } = req.body
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
			"createUsuario",
			userId,
			value
		)

		console.log(response)

		res.status(200).json(JSON.parse(response.toString()))
	} catch (error) {
		res.status(400).json(error)
	}
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
