"use strict"

const FabricCAServices = require("fabric-ca-client")
const { FileSystemWallet, Wallets, X509WalletMixin } = require("fabric-network")
const fs = require("fs")
const path = require("path")

// capture network variables from config.json
const configPath = path.join(process.cwd(), "config.json")
const configJSON = fs.readFileSync(configPath, "utf8")
const config = JSON.parse(configJSON)
let connection_file = config.connection_file
let appAdmin = config.appAdmin
let appAdminSecret = config.appAdminSecret
let caName = config.caName

const ccpPath = path.join(process.cwd(), connection_file)
const ccpJSON = fs.readFileSync(ccpPath, "utf8")
const ccp = JSON.parse(ccpJSON)

async function main() {
	try {
		// Create a new CA client for interacting with the CA.
		const caURL = ccp.certificateAuthorities[caName].url
		const ca = new FabricCAServices(caURL)

		// Create a new file system based wallet for managing identities.
		const walletPath = path.join(process.cwd(), "wallet")
		const wallet = await Wallets.newFileSystemWallet(walletPath)
		console.log(`Wallet path: ${walletPath}`)

		// Enroll the admin user, and import the new identity into the wallet.
		const enrollment = await ca.enroll({
			enrollmentID: appAdmin,
			enrollmentSecret: appAdminSecret,
		})

		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: "Org1MSP",
			type: "X.509",
		}
		wallet.put(appAdmin, x509Identity)
		console.log(
			"msg: Successfully enrolled admin user " +
				appAdmin +
				" and imported it into the wallet"
		)
	} catch (error) {
		console.error("Failed to enroll admin user " + appAdmin + ": " + error)
		process.exit(1)
	}
}

main()
