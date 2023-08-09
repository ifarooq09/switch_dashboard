import express from 'express'

import { createUser, getAllUsers, getUserInfoByID, login, editUser, deleteUser } from "../controllers/user.controller.js";

const router = express.Router()

router.route('/:login').post(login)
router.route('/').get(getAllUsers)
router.route('/').post(createUser)
router.route('/:id').get(getUserInfoByID)
router.route('/:id').patch(editUser)
router.route('/:id').delete(deleteUser)

export default router