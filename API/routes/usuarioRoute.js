const express = require("express")
const router = express.Router()
const {
	listaTodosUsuarios,
	listaUmUsuario,
	updateUsuario,
	deleteUsuario,
} = require("../controllers/usuarioController")

router.route("/").get(listaTodosUsuarios)
router.route("/").post()
router.route("/:id").get(listaUmUsuario)
router.route("/:id").put(updateUsuario)
router.route("/:id").delete(deleteUsuario)

module.exports = router
