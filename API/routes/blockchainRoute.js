const express = require('express')
const router = express.Router()
const { userExists, createUser, readUser, deleteUser, sendValue, startCycle, redeemPoints, endCycle, getHistory } = require('../controllers/blockchainController')


router.route('/user').get(userExists);
router.route('/create').post(createUser);
router.route('/read').get(readUser);
router.route('/delete').delete(deleteUser);
router.route('/sendvalue').post(sendValue);
router.route('/start').get(startCycle);
router.route('/reedem').get(redeemPoints);
router.route('/end').get(endCycle);
router.route('/history').get(getHistory);



module.exports = router