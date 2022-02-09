const Usuario = require("../models/usuarioModel")
const Network = require("../addNetwork")

const listaTodosUsuarios = async (req, res) => {
	try {
		const todosUsuarios = await Usuario.find()
		res.status(200).json(todosUsuarios)
	} catch (error) {
		res.status(500).json({ msg: error })
	}
}

//cria um usuario no banco offchain, gera um id, e registra o usuario na blockchain pelo id gerado
const criaUsuario = async (req, res) => {
	//gera id de 6 digitos aleatorio
	const getNumber = () => {
		var n = Math.floor(Math.random() * 1000000)
		if (n < 100000) {
			return getNumber()
		} else {
			return n
		}
	}
	const payload = {
		userID: String(getNumber()),
		nome: req.body.nome,
		email: req.body.email,
		rh: req.body.rh,
	}
	console.log(payload)

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
			if (payload.rh) {
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

							Usuario.findOneAndDelete({ userID: payload.userID }).then(() => {
								console.log("2 - Error")
								console.log("2 - Delete offchain db register")
								return
							})
						} else {
							console.log("2 - Registered on network")

							return res.status(201).json({ success: response })
						}
						//else return success
					}
				)
			} else {
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
							Usuario.findOneAndDelete({ userID: payload.userID }).then(
								(response) => {
									console.log("2 - Error")
									console.log("2 - Delete offchain db register")
									return res.status(500).json({
										error: response.error,
									})
								}
							)
						}
						//else return success
						console.log("2 - Registered on network")
						return res.status(201).json({ success: response })
					}
				)
			}
		}
	})
}

const listaUmUsuario = async (req, res) => {
	try {
		const { id: usuarioId } = req.params
		const umUsuario = await Usuario.findOne({ _id: usuarioId })
		if (!umUsuario) {
			return res
				.status(404)
				.json({ msg: `Nao existe um usuario com o id: ${usuarioId}` })
		}
		res.status(200).json(umUsuario)
	} catch (error) {
		res.status(500).json({ msg: error })
	}
}

const updateUsuario = async (req, res) => {
	try {
		const { id: usuarioId } = req.params
		const umUsuario = await Usuario.findOneAndUpdate(
			{ _id: usuarioId },
			req.body,
			{
				new: true,
				runValidators: true,
			}
		)
		if (!umUsuario) {
			return res
				.status(404)
				.json({ msg: `Nao existe um usuario com o id: ${usuarioId}` })
		}
		res.status(200).json(umUsuario)
	} catch (error) {
		res.status(500).json({ msg: error })
	}
}

const deleteUsuario = async (req, res) => {
	try {
		const { id: usuarioId } = req.params
		const umUsuario = await Usuario.findOneAndDelete({ userID: usuarioId })
		if (!umUsuario) {
			return res
				.status(404)
				.json({ msg: `Nao existe um usuario com o id: ${usuarioId}` })
		}
		res.status(204).json({ msg: "deletado com sucesso!" })
	} catch (error) {
		res.status(500).json({ msg: error })
	}
}

module.exports = {
	listaTodosUsuarios,
	criaUsuario,
	listaUmUsuario,
	updateUsuario,
	deleteUsuario,
}
