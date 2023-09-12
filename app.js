import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express, { json } from 'express';
const app = express();

// connectDB
import connectDB from './db/connect.js';
import authenticateUser from './middleware/authentication.js'
// routers
import authRouter from './routes/auth.js'
import jobsRouter from './routes/jobs.js'

// error handler
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

// extra security packages
import helmet from 'helmet';
import cors from 'cors'
import { xss } from 'express-xss-sanitizer';
import rateLimiter from 'express-rate-limit';

app.set('trust proxy', 1)
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)

})

app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(limiter)

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
