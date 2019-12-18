import { URL } from "./url";

export async function fetchOrLocal(url: string, h: string | null) {
  const isJson = /\.json$/i.test(url);

  if (process.env.outDir && typeof window === "undefined") {
    try {
      const req = require.context(process.env.outDir, true, /\.(json|md|html?)$/i);
      if (isJson) {
        return JSON.stringify(req(`.${url}`))
      } else {
        return req(`.${url}`).default as string;
      }
    } catch(e) {
      console.error(e);
    }
  }

  const u = new URL(url, process.env.baseUrl);
  if (h) {
    u.searchParams.set("h", h);
  }

  return await fetch(u.href).then((r) => r.text());
}