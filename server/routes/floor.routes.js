import express from 'express'



import {
    getAllFloor, getFloorDetail, createFloor, updateFloor, deleteFloor, getSwitchByFloorId
} from '../controllers/floor.controller.js'



const router = express.Router()

router.route('/:floorId').get(getSwitchByFloorId)
router.route('/').get(getAllFloor)
router.route('/:id').get(getFloorDetail)
router.route('/').post(createFloor)
router.route('/:id').patch(updateFloor)
router.route('/:id').delete(deleteFloor)



export default router