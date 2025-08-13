import { useState, useEffect, useRef, useCallback } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Worker URL pinned to pdfjs-dist 3.11.174 for compatibility
const WORKER_URL =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

function ReactPDFViewerNew(props) {
  const {
    pdfUrl,
    className = "",
    onLoadSuccess,
    onLoadError,
    onTextSelection,
    editingCommand,
    onCommandProcessed,
    onCreateNumberAnnotation,
    currentTool = "highlighter",
    currentColor = "#ffeb3b",
  } = props;

  const [fileUrl, setFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [tool, setTool] = useState(currentTool);
  const [color, setColor] = useState(currentColor);
  const nextNumberRef = useRef(1);
  const highlightsRef = useRef(new Map());

  const viewerRef = useRef(null);

  // Plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (tabs) => [tabs[0]], // thumbnails only
  });

  // Sync external defaults
  useEffect(() => setTool(currentTool), [currentTool]);
  useEffect(() => setColor(currentColor), [currentColor]);

  // Apply commands from toolbar
  useEffect(() => {
    if (!editingCommand) return;
    console.log("🎛️ PDF Viewer received command:", editingCommand);
    const { action, tool: cmdTool, color: cmdColor } = editingCommand;
    switch (action) {
      case "activate-tool":
        console.log("🔧 Activating tool:", cmdTool, "with color:", cmdColor);
        if (cmdTool) setTool(cmdTool);
        if (cmdColor) setColor(cmdColor);
        break;
      case "change-color":
      case "change-highlighter-color":
        console.log("🎨 Changing color to:", cmdColor);
        if (cmdColor) setColor(cmdColor);
        break;
      case "clear-all":
        console.log("🧹 Clearing all annotations");
        document
          .querySelectorAll(".pdf-highlight-overlay")
          .forEach((el) => el.remove());
        document
          .querySelectorAll(".pdf-number-marker")
          .forEach((el) => el.remove());
        highlightsRef.current.clear();
        break;
      default:
        console.log("❓ Unknown command:", action);
        break;
    }
    onCommandProcessed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingCommand]);

  // Load PDF (supports authenticated API URLs)
  useEffect(() => {
    let revoked = null;
    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        if (!pdfUrl) {
          setIsLoading(false);
          return;
        }

        if (pdfUrl.includes("/api/files/pdf/")) {
          const token = localStorage.getItem("accessToken");
          if (!token)
            throw new Error("Authentication required. Please login again.");
          const res = await fetch(pdfUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          setFileUrl(url);
          revoked = url;
        } else {
          setFileUrl(pdfUrl);
        }
      } catch (e) {
        const err = e instanceof Error ? e : new Error("Failed to load PDF");
        setError(err.message);
        onLoadError?.(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
    return () => {
      if (revoked) URL.revokeObjectURL(revoked);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl]);

  // Doc loaded
  const handleDocumentLoad = useCallback(
    (e) => {
      const numPages = e?.doc?.numPages ?? 0;
      console.log("📄 PDF loaded with", numPages, "pages");

      // Debug: Check what PDF elements are available after load
      setTimeout(() => {
        console.log("🔍 PDF Structure Debug:");
        const selectors = [
          ".rpv-core__page",
          ".rpv-core__inner-page",
          ".rpv-core__page-layer",
          "[data-page-number]",
          ".react-pdf__Page",
        ];
        selectors.forEach((sel) => {
          const elements = document.querySelectorAll(sel);
          console.log(`${sel}: ${elements.length} elements`);
        });

        // Log all children of viewer
        const viewer = viewerRef.current;
        if (viewer) {
          const allChildren = viewer.querySelectorAll("*");
          console.log(`Total elements in viewer: ${allChildren.length}`);

          // Look for elements that might be page containers
          const possiblePages = viewer.querySelectorAll(
            'div[style*="position"], canvas, svg'
          );
          console.log(`Possible page elements: ${possiblePages.length}`);
          possiblePages.forEach((el, i) => {
            if (i < 3) {
              // Log first 3
              console.log(`Page candidate ${i}:`, el.className, el.tagName);
            }
          });
        }
      }, 1000);

      onLoadSuccess?.(numPages);
    },
    [onLoadSuccess]
  );

  // Helper functions for highlight management
  const getPageElForRect = (rect) => {
    // Try multiple selectors for PDF page containers
    const selectors = [
      ".rpv-core__page",
      ".rpv-core__inner-page",
      ".rpv-core__page-layer",
      "[data-page-number]",
    ];

    for (const selector of selectors) {
      const pages = Array.from(document.querySelectorAll(selector));
      if (pages.length > 0) {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        for (const page of pages) {
          const pr = page.getBoundingClientRect();
          if (
            cx >= pr.left &&
            cx <= pr.right &&
            cy >= pr.top &&
            cy <= pr.bottom
          ) {
            return page;
          }
        }
      }
    }

    // Fallback to viewer container
    const viewerEl = viewerRef.current;
    if (viewerEl) {
      const vr = viewerEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      if (cx >= vr.left && cx <= vr.right && cy >= vr.top && cy <= vr.bottom) {
        return viewerEl;
      }
    }

    return null;
  };

  const createHighlightOverlays = (ranges, text) => {
    const highlightId = `highlight-${Date.now()}`;
    let created = 0;

    ranges.forEach((range, rangeIndex) => {
      const rects = range.getClientRects();
      Array.from(rects).forEach((rect, rectIndex) => {
        const domRect = rect;
        if (domRect.width <= 0 || domRect.height <= 0) return;

        const pageEl = getPageElForRect(domRect);
        if (!pageEl) return;

        const pageRect = pageEl.getBoundingClientRect();
        const overlay = document.createElement("div");
        overlay.className = "pdf-highlight-overlay";
        overlay.dataset.highlightId = highlightId;
        overlay.dataset.rangeIndex = rangeIndex.toString();
        overlay.dataset.rectIndex = rectIndex.toString();

        overlay.style.cssText = `
                    position: absolute;
                    left: ${domRect.left - pageRect.left}px;
                    top: ${domRect.top - pageRect.top}px;
                    width: ${domRect.width}px;
                    height: ${domRect.height}px;
                    background: ${color};
                    opacity: 0.35;
                    border-radius: 2px;
                    mix-blend-mode: multiply;
                    pointer-events: none;
                    z-index: 1100;
                `;

        const computed = getComputedStyle(pageEl);
        if (computed.position === "static") {
          pageEl.style.position = "relative";
        }

        pageEl.appendChild(overlay);
        created++;
      });
    });

    // Store the ranges for re-rendering on resize
    highlightsRef.current.set(highlightId, { text, ranges });
    console.log(
      `✅ Created ${created} overlay elements for highlight: ${text.substring(
        0,
        30
      )}...`
    );
    return created;
  };

  const redrawAllHighlights = () => {
    // Remove existing overlays
    document
      .querySelectorAll(".pdf-highlight-overlay")
      .forEach((el) => el.remove());

    // Recreate all highlights
    highlightsRef.current.forEach(({ text, ranges }) => {
      createHighlightOverlays(ranges, text);
    });
  };

  // Text selection -> add highlight
  const handleMouseUp = useCallback(() => {
    console.log("🖱️ Mouse up detected, current tool:", tool, "color:", color);
    if (tool !== "highlighter") return;

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;

    const text = sel.toString().trim();
    if (!text) return;

    console.log(
      "✅ Creating highlight for text:",
      text.substring(0, 50) + "..."
    );

    // Store the ranges before clearing selection
    const ranges = [];
    for (let i = 0; i < sel.rangeCount; i++) {
      ranges.push(sel.getRangeAt(i).cloneRange());
    }

    const count = createHighlightOverlays(ranges, text);
    if (count > 0) {
      onTextSelection?.({ text });
      setTimeout(() => sel.removeAllRanges(), 50);
    }
  }, [tool, onTextSelection, color]);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    el.addEventListener("mouseup", handleMouseUp);
    return () => el.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  // Watch for layout changes and redraw highlights
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(() => {
      console.log("📏 PDF viewer resized, redrawing highlights");
      // Delay redraw to ensure PDF has finished rendering
      setTimeout(redrawAllHighlights, 100);
    });

    resizeObserver.observe(el);

    // Also listen for window resize
    const handleWindowResize = () => {
      console.log("🪟 Window resized, redrawing highlights");
      setTimeout(redrawAllHighlights, 100);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // Number annotation placement
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const onClick = (e) => {
      if (tool !== "number") return;
      let target = e.target;
      while (
        target &&
        target !== el &&
        !target.classList?.contains("rpv-core__page")
      ) {
        target = target.parentElement;
      }
      const pageEl =
        target && target.classList.contains("rpv-core__page") ? target : null;
      if (!pageEl) return;

      const rect = pageEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pageNumberAttr = pageEl.getAttribute("data-page-number");
      const pageNumber = pageNumberAttr ? parseInt(pageNumberAttr, 10) + 1 : 1;

      const number = nextNumberRef.current++;
      const marker = document.createElement("div");
      marker.className = "pdf-number-marker";
      marker.textContent = String(number);
      marker.style.cssText = `
                position: absolute;
                left: ${x - 10}px;
                top: ${y - 10}px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #111;
                color: #fff;
                font-size: 12px;
                line-height: 20px;
                text-align: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                z-index: 1200;
                user-select: none;
                pointer-events: none;
            `;
      const computed = getComputedStyle(pageEl);
      if (computed.position === "static") pageEl.style.position = "relative";
      pageEl.appendChild(marker);
      onCreateNumberAnnotation?.(number, { x, y, pageNumber });
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [tool, onCreateNumberAnnotation]);

  if (!pdfUrl) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-gray-500">No PDF selected</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (isLoading || !fileUrl) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-gray-500">Loading PDF...</div>
      </div>
    );
  }

  return (
    <div className={`relative h-full ${className}`} ref={viewerRef}>
      <Worker workerUrl={WORKER_URL}>
        <Viewer
          fileUrl={fileUrl}
          onDocumentLoad={handleDocumentLoad}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  );
}

// Inject basic styles
if (typeof document !== "undefined") {
  const id1 = "pdf-number-marker-styles";
  if (!document.getElementById(id1)) {
    const s = document.createElement("style");
    s.id = id1;
    s.textContent = `.pdf-number-marker{outline:none}`;
    document.head.appendChild(s);
  }
  const id2 = "pdf-highlight-overlay-styles";
  if (!document.getElementById(id2)) {
    const s = document.createElement("style");
    s.id = id2;
    s.textContent = `.pdf-highlight-overlay{outline:none}`;
    document.head.appendChild(s);
  }
}

export default ReactPDFViewerNew;
