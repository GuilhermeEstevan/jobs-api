import Job from "../models/Job.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, NotFoundError } from "../errors/index.js"

export const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}


export const getJob = async (req, res) => {
    const userId = req.user.userId
    const jobId = req.params.id

    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId
    })
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}


export const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create({ ...req.body })

    res.status(StatusCodes.CREATED).json({ job })
}


export const updatedJob = async (req, res) => {
    const userId = req.user.userId
    const jobId = req.params.id
    const { company, position, status } = req.body
    // check for empty fields
    if (company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty')
    }
    // find and update
    const job = await Job.findOneAndUpdate(
        {
            _id: jobId,
            createdBy: userId
        },
        req.body,
        { new: true, runValidators: true }
    )
    // check if job exists
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.json({ job })
}

export const deleteJob = async (req, res) => {
    const userId = req.user.userId
    const jobId = req.params.id

    const job = await Job.findOneAndRemove({
        _id: jobId,
        createdBy: userId
    })

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).send()
}