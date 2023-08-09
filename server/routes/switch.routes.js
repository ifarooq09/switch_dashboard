import express from 'express'


import {
    getAllSwitch, getSwitchDetail, createSwitch, updateSwitch, deleteSwitch, getIpBySwitchId
} from '../controllers/switch.controller.js'

const router = express.Router()

router.route('/:switchId').get(getIpBySwitchId)
router.route('/').get(getAllSwitch)
router.route('/:id').get(getSwitchDetail)
router.route('/').post(createSwitch)
router.route('/:id').patch(updateSwitch)
router.route('/:id').delete(deleteSwitch)

export default router