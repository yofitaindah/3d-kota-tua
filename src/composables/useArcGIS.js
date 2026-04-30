/**
 * useArcGIS — composable untuk semua logika ArcGIS Maps SDK
 *
 * Composable = fungsi yang berisi reactive state + logic,
 * bisa di-import & dipakai di komponen mana pun.
 */
import { ref, reactive } from "vue";
import { CONFIG } from "../config/index.js";

export function useArcGIS() {
  // ── State ──────────────────────────────────────────────────
  const isLoading = ref(true);
  const loadingProgress = ref(10);
  const loadingText = ref("Menginisialisasi peta 3D...");

  const statusState = ref("loading");
  const statusText = ref("Memuat scene…");
  const coordText = ref("–.–°, –.–°");

  const popupVisible = ref(false);
  const popupTitle = ref("");
  const popupLayerName = ref("");
  const popupRows = ref([]);

  const bannerVisible = ref(false);
  const bannerType = ref("info");
  const bannerHtml = ref("");

  // is2D default true → landing dalam mode 2D top-down
  const is2D = ref(true);

  // ArcGIS instance references (non-reactive, tidak perlu di-wrap)
  let view = null;
  let map = null;
  let highlightHandle = null; // menyimpan handle highlight aktif

  // ── Helpers ───────────────────────────────────────────────
  function setProgress(pct) {
    loadingProgress.value = Math.min(pct, 100);
  }

  function setStatus(state, text) {
    statusState.value = state;
    statusText.value = text;
  }

  function showBanner(type, html) {
    bannerType.value = type;
    bannerHtml.value = html;
    bannerVisible.value = true;
  }

  function hideOverlay() {
    setTimeout(() => {
      isLoading.value = false;
    }, 400);
  }

  // ── ArcGIS Init ───────────────────────────────────────────
  function initArcGIS() {
    // ArcGIS SDK di-load secara dynamic (sama seperti sebelumnya)
    // karena SDK-nya tidak tersedia sebagai npm package yang ringan
    require([
      "esri/config",
      "esri/Map",
      "esri/views/SceneView",
      "esri/layers/SceneLayer",
      "esri/layers/FeatureLayer",
      "esri/layers/ElevationLayer",
      "esri/widgets/LayerList",
      "esri/core/reactiveUtils",
    ], function (
      esriConfig,
      Map,
      SceneView,
      SceneLayer,
      FeatureLayer,
      ElevationLayer,
      LayerList,
      reactiveUtils
    ) {
      // CORS & proxy config
      esriConfig.request.proxyUrl = "/arcgis-proxy";
      esriConfig.request.trustedServers.push("tataruang.jakarta.go.id");
      esriConfig.request.timeout = 60000;

      esriConfig.request.interceptors.push({
        urls: "https://tataruang.jakarta.go.id/portal/sharing/rest/portals/self",
        before(params) {
          params.url = `${window.location.origin}/portal-intercept/sharing/rest/portals/self`;
          if (params.requestOptions) {
            params.requestOptions.authMode = "anonymous";
            params.requestOptions.useFetch = true;
          }
        },
      });
      esriConfig.request.interceptors.push({
        urls: "https://tataruang.jakarta.go.id/portal/sharing/rest",
        before(params) {
          if (params.requestOptions)
            params.requestOptions.authMode = "anonymous";
        },
        error(err) {
          const url = err?.details?.url || err?.message || "";
          if (url.includes("portal/sharing")) return Promise.resolve({});
          return Promise.reject(err);
        },
      });
      esriConfig.request.interceptors.push({
        urls: "https://tataruang.jakarta.go.id/server/rest",
        before(params) {
          if (params.requestOptions)
            params.requestOptions.authMode = "anonymous";
        },
      });

      // ── Terrain / Elevation ────────────────────────────────
      // Opsi 1 (aktif): pakai World Elevation Esri (default, sudah global)
      // Opsi 2 (komentar): pakai DTM kustom → ganti URL ke Image Service kamu
      //
      // const dtmKustom = new ElevationLayer({
      //   url: 'https://your-server/arcgis/rest/services/DTM_Jakarta/ImageServer'
      // })
      // ground: { layers: [dtmKustom] }

      map = new Map({
        basemap: CONFIG.defaultBasemap,
        ground: "world-elevation", // ← DTM global Esri (SRTM + lokal)
      });

      // Feature Layers (opsional)
      CONFIG.featureLayers?.forEach((cfg) => {
        const fl = new FeatureLayer({
          url: cfg.url,
          title: cfg.title,
          outFields: ["*"],
          opacity: 0.6,
          elevationInfo: { mode: "on-the-ground" },
          renderer: cfg.renderer,
        });
        fl._originalUrl = cfg.originalUrl;
        fl._popupFields = cfg.popupFields;
        map.add(fl);
      });

      // Scene Layers (bangunan 3D)
      CONFIG.sceneLayers.forEach((cfg) => {
        const sl = new SceneLayer({
          url: cfg.url,
          title: cfg.title,
          outFields: ["*"],
          popupEnabled: true,
          elevationInfo: {
            mode: "absolute-height",
            offset: 10,
            unit: "meters",
          },
        });
        sl._originalUrl = cfg.originalUrl;
        sl._popupFields = cfg.popupFields;
        map.add(sl);
        watchLayerLoad(sl);
      });

      view = new SceneView({
        container: "scene-view",
        map,
        // Camera dari CONFIG — tilt: 0 → 2D saat landing
        camera: CONFIG.camera,
        qualityProfile: "high",
        environment: {
          atmosphere: { quality: "high" },
          lighting: {
            directShadowsEnabled: true,
            // ambientOcclusionEnabled dihapus (deprecated sejak 4.27)
          },
        },
        ui: { components: [] },
        popup: { defaultPopupTemplateEnabled: false, autoOpenEnabled: false },
        highlightOptions: {
          color: [59, 130, 246], // biru accent (#3B82F6)
          fillOpacity: 0.25, // fill transparan
          haloColor: [147, 197, 253], // halo biru terang (#93C5FD)
          haloOpacity: 0.9,
        },
      });

      // LayerList widget
      view.when(() => {
        new LayerList({ view, container: "layerlist-container" });
        setProgress(70);
        setStatus("loading", "Merender objek 3D...");
        loadingText.value = "Merender objek 3D...";

        reactiveUtils.watch(
          () => view.updating,
          (updating) => {
            if (!updating) {
              setProgress(100);
              setStatus("ready", "Sistem Siap");
              hideOverlay();
            }
          },
          { once: true }
        );

        // Fallback timeout
        setTimeout(() => {
          if (isLoading.value) {
            console.warn("[TIMEOUT] Force hide loading overlay");
            setProgress(100);
            setStatus("ready", "Sistem Siap");
            hideOverlay();
          }
        }, 15000);
      });

      // Helper: hapus highlight sebelumnya
      function clearHighlight() {
        if (highlightHandle) {
          highlightHandle.remove();
          highlightHandle = null;
        }
      }

      // Click handler
      view.on("click", async (evt) => {
        // Selalu clear highlight lama dulu
        clearHighlight();

        const r3 = await view.hitTest(evt, {
          include: map.layers.filter((l) => l.type === "scene"),
        });
        const hits3 = r3.results.filter(
          (r) => r.type === "graphic" && r.graphic?.attributes
        );
        if (hits3.length > 0) {
          const graphic = hits3[0].graphic;
          const layerView = await view.whenLayerView(graphic.layer);
          // Highlight bangunan yang diklik — warna biru accent
          highlightHandle = layerView.highlight(graphic);
          showPopup3D(graphic.layer, graphic.attributes);
          return;
        }

        const r2 = await view.hitTest(evt, {
          include: map.layers.filter((l) => l.type === "feature"),
        });
        const hits2 = r2.results.filter(
          (r) => r.type === "graphic" && r.graphic?.attributes
        );
        if (hits2.length > 0) {
          const graphic = hits2[0].graphic;
          const layerView = await view.whenLayerView(graphic.layer);
          highlightHandle = layerView.highlight(graphic);
          showPopupFeature(graphic.layer, graphic.attributes);
        } else {
          // Klik area kosong → clear highlight + tutup popup
          clearHighlight();
          popupVisible.value = false;
        }
      });

      // Pointer move → update koordinat
      view.on("pointer-move", (evt) => {
        const pt = view.toMap({ x: evt.x, y: evt.y });
        if (pt) {
          coordText.value = `${pt.latitude.toFixed(5)}°, ${pt.longitude.toFixed(
            5
          )}°`;
        }
      });
    });
  }

  async function watchLayerLoad(sl) {
    try {
      await sl.load();
      setProgress(50);
    } catch (err) {
      const isCors =
        err?.message?.toLowerCase().includes("cors") ||
        err?.message?.toLowerCase().includes("failed to fetch") ||
        err?.details?.httpStatus === 0;
      if (isCors) {
        showBanner(
          "error",
          "<strong>CORS Error:</strong> Pastikan <code>node server.js</code> sudah berjalan di <code>http://localhost:3000</code>."
        );
      } else {
        showBanner(
          "error",
          `<strong>Layer gagal dimuat:</strong> ${sl.title} — ${err.message}`
        );
      }
    }
  }

  // ── Popup ─────────────────────────────────────────────────
  function showPopup3D(layer, attrs) {
    const nameKeys = ["name", "Name", "NAME", "NAMOBJ", "OBJECTID"];
    popupLayerName.value = layer.title;
    popupTitle.value =
      nameKeys.map((k) => attrs[k]).find((v) => v) || "Informasi Bangunan";
    const fields = layer._popupFields || CONFIG.sceneLayers[0].popupFields;
    popupRows.value = fields
      .filter((f) => attrs[f.key] != null && attrs[f.key] !== "")
      .map((f) => ({
        key: f.key,
        label: f.label,
        value:
          typeof attrs[f.key] === "number" && !Number.isInteger(attrs[f.key])
            ? attrs[f.key].toFixed(2)
            : attrs[f.key],
      }));
    popupVisible.value = true;
  }

  function showPopupFeature(layer, attrs) {
    popupLayerName.value = layer.title;
    popupTitle.value =
      attrs["SUB_ZONA"] || attrs["NAMA"] || attrs["name"] || "Informasi Layer";
    const fields = layer._popupFields || [];
    popupRows.value = fields
      .filter((f) => attrs[f.key] != null && attrs[f.key] !== "")
      .map((f) => ({ key: f.key, label: f.label, value: attrs[f.key] }));
    popupVisible.value = true;
  }

  // ── Highlight (public) ──────────────────────────────────────
  function clearHighlight() {
    if (highlightHandle) {
      highlightHandle.remove();
      highlightHandle = null;
    }
  }

  // ── Map Actions ───────────────────────────────────────────
  function changeBasemap(id) {
    if (map) map.basemap = id;
  }

  function resetView() {
    view?.goTo(CONFIG.camera, { duration: 800 });
    // Reset is2D state sesuai tilt kamera awal (0 = 2D)
    is2D.value = CONFIG.camera.tilt === 0;
  }

  function toggleTilt() {
    is2D.value = !is2D.value;
    view?.goTo({ tilt: is2D.value ? 0 : 65 }, { duration: 600 });
  }

  function toggleLayer(layerToggle) {
    layerToggle.enabled = !layerToggle.enabled;
    if (!map) return;
    map.layers.forEach((l) => {
      if (l.title?.toLowerCase().includes(layerToggle.id)) {
        l.visible = layerToggle.enabled;
      }
    });
    if (layerToggle.id === "buildings") {
      map.layers.forEach((l) => {
        if (l.type === "scene") l.visible = layerToggle.enabled;
      });
    }
  }

  function updateSun(sunHour) {
    if (!view) return;
    const h = Math.floor(sunHour);
    const m = sunHour % 1 === 0.5 ? 30 : 0;
    const now = new Date();
    now.setHours(h, m, 0);
    view.environment.lighting.date = now;
  }

  function zoomIn() {
    view?.goTo({ zoom: (view.zoom || 14) + 1 }, { duration: 300 });
  }

  function zoomOut() {
    view?.goTo({ zoom: Math.max((view.zoom || 14) - 1, 1) }, { duration: 300 });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement)
      document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }

  function flyTo({ longitude, latitude, zoom }) {
    if (!view) {
      console.warn("[flyTo] view belum siap");
      return;
    }
    view.goTo(
      { center: [longitude, latitude], zoom },
      { duration: 1200, easing: "ease-in-out" }
    );
  }

  // ── Load ArcGIS SDK script ────────────────────────────────
  function loadSDK(onReady, onError) {
    const script = document.createElement("script");
    script.src = "https://js.arcgis.com/4.29/";
    script.onload = onReady;
    script.onerror = onError;
    document.head.appendChild(script);
  }

  return {
    // state
    isLoading,
    loadingProgress,
    loadingText,
    statusState,
    statusText,
    coordText,
    popupVisible,
    popupTitle,
    popupLayerName,
    popupRows,
    bannerVisible,
    bannerType,
    bannerHtml,
    is2D,
    // methods
    setProgress,
    setStatus,
    showBanner,
    hideOverlay,
    clearHighlight,
    initArcGIS,
    loadSDK,
    changeBasemap,
    resetView,
    toggleTilt,
    toggleLayer,
    updateSun,
    zoomIn,
    zoomOut,
    toggleFullscreen,
    flyTo,
  };
}
