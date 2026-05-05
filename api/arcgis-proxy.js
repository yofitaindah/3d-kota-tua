export default async function handler(req, res) {
  const target = "https://tataruang.jakarta.go.id";
  const token = process.env.ARCGIS_TOKEN || "";

  // Inject token ke URL
  const separator = req.url.includes("?") ? "&" : "?";
  const urlWithToken = `${target}${req.url}${separator}token=${token}`;

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    return res.status(200).end();
  }

  try {
    const response = await fetch(urlWithToken, {
      method: req.method,
      headers: {
        Origin: target,
        Referer: target + "/",
      },
    });
    const data = await response.arrayBuffer();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/json"
    );
    res.status(response.status).send(Buffer.from(data));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}
