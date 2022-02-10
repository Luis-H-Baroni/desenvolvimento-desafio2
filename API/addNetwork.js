const {
	FileSystemWallet,
	Wallet,
	Wallets,
	Gateway,
	X509WalletMixin,
} = require("fabric-network")
const fs = require("fs")
const path = require("path")
const FabricCAServices = require("fabric-ca-client")

// capture network variables from config.json
const configPath = path.join(process.cwd(), "config.json")
const configJSON = fs.readFileSync(configPath, "utf8")
const config = JSON.parse(configJSON)
let connection_file = config.connection_file
//let appAdmin = config.appAdmin

const ccpPath = path.join(process.cwd(), connection_file)
const ccpJSON = fs.readFileSync(ccpPath, "utf8")
const ccp = JSON.parse(ccpJSON)
let caName = config.caName

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = {
	registerOnNetwork: async (usuarioID, rh) => {
		const walletPath = path.join(process.cwd(), "/wallet")
		const wallet = await Wallets.newFileSystemWallet(walletPath)
		console.log(`Wallet path: ${walletPath}`)

		let secret
		try {
			const caURL = ccp.certificateAuthorities[caName].url
			const ca = new FabricCAServices(caURL)

			const adminIdentity = await wallet.get("admin")

			const provider = wallet
				.getProviderRegistry()
				.getProvider(adminIdentity.type)
			const adminUser = await provider.getUserContext(adminIdentity, "admin")

			// Register the user, enroll the user, and import the new identity into the wallet.
			// check if 'rh' flag is true
			if (rh) {
				secret = await ca.register(
					{
						affiliation: "org1.department1",
						enrollmentID: usuarioID,
						role: "client",
						attrs: [{ name: "rh", value: "true", ecert: true }],
					},
					adminUser
				)
			} else {
				secret = await ca.register(
					{
						affiliation: "org1.department1",
						enrollmentID: usuarioID,
						role: "client",
					},
					adminUser
				)
			}

			const enrollment = await ca.enroll({
				enrollmentID: usuarioID,
				enrollmentSecret: secret,
			})

			const x509Identity = {
				credentials: {
					certificate: enrollment.certificate,
					privateKey: enrollment.key.toBytes(),
				},
				mspId: "Org1MSP",
				type: "X.509",
			}
			wallet.put(usuarioID, x509Identity)
			console.log(
				"Successfully registered and enrolled user " +
					usuarioID +
					" and imported it into the wallet"
			)
		} catch (err) {
			//print and return error
			console.log(err)
			let error = {}
			error.error = err.message
			return error
		}

		await sleep(2000)

		return await submitRegisterTransaction(usuarioID, wallet)
	},
}
const submitRegisterTransaction = async (usuarioID, wallet) => {
	try {
		// Create a new gateway for connecting to our peer node.
		const gateway2 = new Gateway()
		await gateway2.connect(ccp, {
			wallet,
			identity: usuarioID,
			discovery: { enabled: true, asLocalhost: true },
		})

		// Get the network (channel) our contract is deployed to.
		const network = await gateway2.getNetwork("mychannel")

		// Get the contract from the network.
		const contract = network.getContract("smart-contract")

		// Submit the specified transaction.
		console.log("\nSubmit Create Member transaction.")

		await contract.submitTransaction("createUsuario", usuarioID)

		// Disconnect from the gateway.
		await gateway2.disconnect()

		return true
	} catch (err) {
		//print and return error
		console.log(err)
		let error = {}
		error.error = err.message
		return error
	}
}
