import express from 'express'


import {
    getAllPort, getPortDetail, createPort, updatePort, deletePort
} from '../controllers/port.controller.js'

const router = express.Router()

router.route('/').get(getAllPort)
router.route('/:id').get(getPortDetail)
router.route('/').post(createPort)
router.route('/:id').patch(updatePort)
router.route('/:id').delete(deletePort)

export default router