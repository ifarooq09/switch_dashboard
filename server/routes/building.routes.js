import express from 'express'

import {
    createBuilding, deleteBuilding, getAllBuilding, getBuildingDetail, updateBuilding, getFloorByBuildingId
} from '../controllers/building.controller.js'


const router = express.Router()

router.route('/:buildingId').get(getFloorByBuildingId)
router.route('/').get(getAllBuilding)
router.route('/:id').get(getBuildingDetail)
router.route('/').post(createBuilding)
router.route('/:id').patch(updateBuilding)
router.route('/:id').delete(deleteBuilding)

export default router