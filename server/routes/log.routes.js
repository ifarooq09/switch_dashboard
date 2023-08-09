import express from "express";

import { getPortLogDetail } from "../controllers/log.controller.js";


const router = express.Router()

router.route('/:id').get(getPortLogDetail)


export default router