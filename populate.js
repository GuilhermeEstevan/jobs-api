import dotenv from 'dotenv'
dotenv.config()
import connectDB from './db/connect.js'
import Job from './models/Job.js'
import MOCK_DATA from './MOCK_DATA.json' assert {type: 'json'}

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)

        await Job.create(MOCK_DATA)
        console.log('success');
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

start()