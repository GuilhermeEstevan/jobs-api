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

// Swagger
import { readFile } from 'fs/promises';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'
const jsonSwagger = JSON.parse(await readFile('./swagger.json', 'utf8'));

app.use('/', swaggerUi.serve, swaggerUi.setup(jsonSwagger))

// extra security packages
import helmet from 'helmet';
import { xss } from 'express-xss-sanitizer';

app.set('trust proxy', 1)

app.use(express.json());
app.use(
  cors({
    origin: [
      'https://temp-jobs-api-ogq6.onrender.com',
      'https://jobster-guilherme.netlify.app',
      'http://localhost:3000'
    ],
    optionsSuccessStatus: 200
  })
);

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
