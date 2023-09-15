import Job from "../models/Job.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, NotFoundError } from "../errors/index.js"
import mongoose from "mongoose"
import moment from 'moment'

export const getAllJobs = async (req, res) => {


    const { status, jobType, sort, search } = req.query

    // Filter user
    const queryObject = {
        createdBy: req.user.userId
    }
    // Search
    if (search) {
        queryObject.position = { $regex: search, $options: 'i' }
    }
    // Status
    if (status && status !== 'all') {
        queryObject.status = status
    }
    // Job Type
    if (jobType && jobType !== 'all') {
        queryObject.jobType = jobType
    }

    // FIND 
    let result = Job.find(queryObject)

    // Sort
    if (sort === 'latest') {
        result = result.sort('-createdAt')
    }
    if (sort === 'oldest') {
        result = result.sort('createdAt')
    }
    if (sort === 'a-z') {
        result = result.sort('position')
    }
    if (sort === 'z-a') {
        result = result.sort('-position')
    }

    // PAGINATION
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    const jobs = await result
    const totalJobs = await Job.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalJobs / limit)

    res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages })
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

export const showStats = async (req, res) => {

    // STATS

    let stats = await Job.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    stats = stats.reduce((accumulator, current) => {
        const { _id: title, count } = current
        accumulator[title] = count
        return accumulator
    }, {})

    const defaultStats = {
        pending: stats.pending || 0,
        declined: stats.declined || 0,
        interview: stats.interview || 0
    }

    // MONTHLY APPLICATIONS

    let monthlyApplications = await Job.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
    ])

    monthlyApplications = monthlyApplications.map((item) => {
        const { _id: { year, month }, count } = item
        const date = moment().month(month - 1).year(year).format('MMM Y')
        return { date, count }
    }).reverse()


    

    res.status(StatusCodes.OK).json({
        defaultStats,
        monthlyApplications
    })
}