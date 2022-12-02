import Koa from "koa";
import errorHandler from './error'
import logHandler from './log'

export function loadMiddware(app: Koa) {
    app.use(logHandler);
    app.use(errorHandler);
}