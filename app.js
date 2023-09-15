import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express, { json } from 'express';
const app = express();
import cors from 'cors'
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
import { xss } from 'express-xss-sanitizer';
app.set('trust proxy', 1)

app.use(express.json());
app.use(
  cors({
    origin: 'https://jobster-guilherme.netlify.app',
    optionsSuccessStatus: 200
  })
)

app.use(helmet())
app.use(xss())


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
