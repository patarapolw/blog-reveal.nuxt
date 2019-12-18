import ApiBuilder from "../utils/build-api";
import { ServerMiddleware } from "@nuxt/types";

const dirApi: ServerMiddleware = (req, res, next) => {
  const m = /(\S+)\.json$/.exec(req.url!);
  if (m) {
    const builder = new ApiBuilder();
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(builder.getDirTree(m[1] as any)));
  }
  next();
}

export default dirApi;