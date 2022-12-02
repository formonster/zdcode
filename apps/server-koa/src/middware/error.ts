import { resError } from "../utils/common";
import Router from "@koa/router";

const errorHandler = async (ctx: Router.RouterContext, next: () => Promise<unknown>) => {
    try {
        await next();

        // 404 处理
        if (ctx.status === 404) {
            ctx.status = 404;
            ctx.body = "404";
        }
    } catch (error: any) {

        ctx.status = error.status || 500;
        console.log("💥", error);

        if (error.isAxiosError) {
            console.error("💥", error.response.data);
            ctx.body = resError(error.response.data.msg);
            return;
        }
        ctx.body = resError(error.message || error.toString());
    }
};
export default errorHandler;
