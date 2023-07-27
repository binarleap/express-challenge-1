import express, { Express } from 'express';
import dotenv from 'dotenv';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import mongoose from 'mongoose';
import apiRouter from './src/routes/api.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// setup json parser
app.use(express.json())

// setup routes
app.use('/api', apiRouter);

// setup swagger
const swaggerOptions = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Ellingsen Senior Back End Developer Challenge by Reza Shams",
            version: "0.0.0",
            description: "Ellingsen Senior Back End Developer Challenge by Reza Shams",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "RezaShams",
                url: "",
                email: "rezashams.work@gmail.com",
            },
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
    },
    apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsdoc(swaggerOptions);
app.use(
    "/documentation",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

// connect to mongodb
const mongoString = process.env.DATABASE_URL ?? ''
mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error: any) => {
    console.log(error)
})
database.once('connected', () => {
    console.log('Database Connected');
})

// run the server
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
