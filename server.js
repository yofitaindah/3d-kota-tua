/**
 * ============================================================
 * server.js — Express Server untuk 3D WebGIS Lebak Bulus
 * ============================================================
 * Fungsi:
 *  1. Serve static files (index.html, style.css, app.js)
 *  2. CORS Proxy: forward request ke tataruang.jakarta.go.id
 *     agar browser tidak kena CORS block
 * ============================================================
 * Cara pakai:
 *   npm install
 *   node server.js
 *   Buka: http://localhost:3000
 * ============================================================
 */

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

/* ── Target server yang di-proxy ──────────────────────────── */
const JAKARTA_BASE = "https://tataruang.jakarta.go.id";

/* ============================================================
    1. MIDDLEWARE
============================================================ */

// Logger request (format singkat di terminal)
app.use(morgan("dev"));

// Allow semua origin (development only)
app.use(cors());

/* ============================================================
    Helper: inject CORS headers ke setiap proxy response
============================================================ */
function injectCorsHeaders(proxyRes) {
  proxyRes.headers["Access-Control-Allow-Origin"] = "*";
  proxyRes.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
  proxyRes.headers["Access-Control-Allow-Headers"] =
    "Content-Type, Authorization, X-Requested-With";
  // Hapus header yang bisa block browser
  delete proxyRes.headers["x-frame-options"];
  delete proxyRes.headers["content-security-policy"];
}

/* ============================================================
    2a. INTERCEPT /portals/self — kembalikan response palsu
    ────────────────────────────────────────────────────────
============================================================ */
app.get("/portal-intercept/sharing/rest/portals/self", (req, res) => {
  console.log("[INTERCEPT] /portals/self → returning stub response");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  // Response minimal yang membuat ArcGIS JS API tidak crash
  res.json({
    id: "0123456789ABCDEF",
    name: "Stub Portal",
    isPortal: true,
    portalMode: "singletenant",
    helperServices: {},
  });
});

/* ============================================================
    2b. CORS PROXY — /arcgis-proxy/*
    Semua request ke /arcgis-proxy/... akan di-forward ke
    tataruang.jakarta.go.id/...
============================================================ */
app.use(
  "/arcgis-proxy",
  createProxyMiddleware({
    target: JAKARTA_BASE,
    changeOrigin: true,
    secure: false,
    pathRewrite: { "^/arcgis-proxy": "" },
    on: {
      proxyReq: (proxyReq, req) => {
        const targetPath = req.path.replace("/arcgis-proxy", "");
        console.log(`[PROXY →] ${req.method} ${JAKARTA_BASE}${targetPath}`);
        proxyReq.setHeader("Origin", JAKARTA_BASE);
        proxyReq.setHeader("Referer", JAKARTA_BASE + "/");
      },
      proxyRes: (proxyRes, req) => {
        console.log(`[PROXY ←] ${proxyRes.statusCode} ${req.path}`);
        injectCorsHeaders(proxyRes);
      },
      error: (err, req, res) => {
        console.error("[PROXY ERROR]", err.message);
        res.status(502).json({
          error: "Proxy gagal terhubung ke server Jakarta.",
          detail: err.message,
        });
      },
    },
  })
);

/* ============================================================
    3. STATIC FILES — serve folder /public
    index.html, style.css, app.js disimpan di folder public/
============================================================ */
app.use(express.static(path.join(__dirname, "public")));

/* ============================================================
    4. FALLBACK ROUTE
============================================================ */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ============================================================
    5. START SERVER
============================================================ */
app.listen(PORT, () => {
  console.log("\n============================================");
  console.log(`  🗺️  3D WebGIS Server berjalan!`);
  console.log(`  URL  : http://localhost:${PORT}`);
  console.log(`  Proxy: http://localhost:${PORT}/arcgis-proxy/...`);
  console.log("============================================\n");
});
