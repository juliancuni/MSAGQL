import http from "http";
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
const graphqlHTTP = require('express-graphql');
import { buildSchema } from 'graphql';
import path from 'path';
import mongoose from 'mongoose';
import { PerdoruesModel } from './models/perdoruesit.model'
import { AppConfig } from './app.config';

const appCfg = new AppConfig;

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'templates')))

app.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.render('index')
})

app.use('/gql', graphqlHTTP({
    schema: buildSchema(`
        type Perdorues {
            _id: ID!
            username: String!
            password: String
            email: String
            enabled: Boolean
        }

        input PerdoruesitInput {
            username: String!
            password: String
            email: String
            enabled: Boolean
        }

        type RootQuery {
            perdoruesit: [Perdorues!]!
        }
        type RootMutation {
            krijoPerdorues(perdoruesInput: PerdoruesitInput): Perdorues
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        perdoruesit: () => {
            PerdoruesModel.find().then((res: any) => {
                return res.map((perdorues: any) => {
                    return { ...perdorues._doc, id: perdorues._doc._id.toString() }
                })
            }).catch((err) => {
                throw err;
            })
        },
        krijoPerdorues: (args: any) => {
            const perdoruesModel = new PerdoruesModel(args.perdoruesInput);
            return perdoruesModel
                .save()
                .then((res: any) => {
                    return { ...res._doc }
                })
                .catch((err) => {
                    console.log(err);
                    throw err;
                });
        }
    },
    graphiql: true
}))

const server: http.Server = app.listen(appCfg.APP_PORT);

server.on("listening", () => {
    console.info(`Server Gati! http://localhost:${appCfg.APP_PORT}`);
    mongoose.connect(appCfg.MONGO_URI, appCfg.MONGO_OPTIONS);
    mongoose.connection.on('open', () => { console.log("MongoDBConnected!") });
})
