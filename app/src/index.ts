import 'dotenv/config' // Must be the first line which execute cross the project
import fastify from 'fastify'
import {IReqProps, IUser} from "./types";
import {ingestCanHelp} from "./routes/ingestCanHelp";
import {ingestNeedHelp} from "./routes/ingestNeedHelp";
import {queryHelpToNeeded} from "./routes/queryHelpToNeeded";

const server = fastify()
server.get('/', async () => {
    return 'pong\n'
})

server.post('/ingestCanHelp', async (request, reply) => {
    const body = request.body as { props: IReqProps, user: IUser };
    const id = await ingestCanHelp(body.user, body.props);
    return {id}
})
server.post('/ingestNeedHelp', async (request, reply) => {
    request.body
    const body = request.body as { props: IReqProps, user: IUser };
    const id = await ingestNeedHelp(body.user, body.props);
    return {id}
})

server.get('/queryHelpToNeeded', async (request, reply) => {
    const {id} = request.query as { id: string };
    const res = await queryHelpToNeeded(Number(id));
    return res;
})

server.listen({port: 3000, host: '0.0.0.0'}, (err: any, address: string) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})