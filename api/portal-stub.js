export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    id: "0123456789ABCDEF",
    name: "Stub Portal",
    isPortal: true,
    portalMode: "singletenant",
    helperServices: {},
  });
}
