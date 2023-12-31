import express from 'express'
const router = express.Router()
import {
    getAllJobs,
    getJob,
    createJob,
    updatedJob,
    deleteJob,
    showStats
} from '../controllers/jobs.js'

router.route('/').get(getAllJobs).post(createJob)
router.route('/stats').get(showStats)
router.route('/:id').get(getJob).delete(deleteJob).patch(updatedJob)

export default router