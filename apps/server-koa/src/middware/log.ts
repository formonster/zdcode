import Router from "@koa/router";

const errorHandler = async (ctx: Router.RouterContext, next: () => Promise<unknown>) => {
    // console.log(ctx.request.url);
    await next();
    // console.log(ctx.body);
};
export default errorHandler;
