import { useState, useEffect, useRef, useCallback } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { highlightPlugin, Trigger } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import "./pdf-viewer-enhanced.css";

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

  // Store highlights using the plugin's percent-based coordinates
  const [highlights, setHighlights] = useState([]);

  const viewerRef = useRef(null);

  // Undo / redo stacks (snapshots of highlights array)
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const STACK_LIMIT = 100;

  const pushUndoSnapshot = () => {
    try {
      const snap = JSON.parse(JSON.stringify(highlights));
      undoStackRef.current.push(snap);
      if (undoStackRef.current.length > STACK_LIMIT) undoStackRef.current.shift();
      // new action clears redo
      redoStackRef.current = [];
      // expose availability to parent via window flags (ContentArea polls these)
      try {
        window.canUndoPDF = undoStackRef.current.length > 0;
        window.canRedoPDF = redoStackRef.current.length > 0;
      } catch (e) {}
    } catch (e) {
      // ignore
    }
  };

  const undo = () => {
    if (undoStackRef.current.length === 0) return;
    const prev = undoStackRef.current.pop();
    redoStackRef.current.push(JSON.parse(JSON.stringify(highlights)));
    setHighlights(prev || []);
    try {
      window.canUndoPDF = undoStackRef.current.length > 0;
      window.canRedoPDF = redoStackRef.current.length > 0;
    } catch (e) {}
  };

  const redo = () => {
    if (redoStackRef.current.length === 0) return;
    const next = redoStackRef.current.pop();
    undoStackRef.current.push(JSON.parse(JSON.stringify(highlights)));
    setHighlights(next || []);
    try {
      window.canUndoPDF = undoStackRef.current.length > 0;
      window.canRedoPDF = redoStackRef.current.length > 0;
    } catch (e) {}
  };

  // Initialize global flags so parent polling sees correct state
  useEffect(() => {
    try {
      window.canUndoPDF = undoStackRef.current.length > 0;
      window.canRedoPDF = redoStackRef.current.length > 0;
    } catch (e) {}
    return () => {
      try {
        window.canUndoPDF = false;
        window.canRedoPDF = false;
      } catch (e) {}
    };
  }, []);

  // Plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (tabs) => [tabs[0]], // thumbnails only
  });

  // HIGHLIGHT PLUGIN - uses percent coordinates and auto-repositions on zoom/rotate
  const renderHighlightTarget = (p) => {
    // Show the selection popup when either the highlighter or the select tool is active.
    if (tool !== "highlighter" && tool !== "select") return null;
    return (
      <div
        style={{
          position: "absolute",
          left: `${p.selectionRegion.left}%`,
          top: `${p.selectionRegion.top + p.selectionRegion.height}%`,
          transform: "translateY(8px)",
          background: "rgba(0,0,0,0.8)",
          borderRadius: 6,
          padding: 4,
          display: "flex",
          gap: 6,
          alignItems: "center",
          zIndex: 2000,
        }}
      >
        {tool === "highlighter" && (
          <button
            style={{
              border: "none",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
              background: color,
              color: "white",
              fontSize: "12px",
            }}
            onClick={() => {
              // snapshot before creating a new highlight so it can be undone
              pushUndoSnapshot();
              const id = `hl-${Date.now()}`;
              const newHighlight = { id, color, areas: p.highlightAreas, text: p.selectedText };
              console.log("✨ Creating highlight:", newHighlight);
              setHighlights((prev) => {
                const updated = prev.concat([newHighlight]);
                console.log("📝 Updated highlights array:", updated.length, "items");
                return updated;
              });
              // Keep highlight creation separate from sending to chat
              p.cancel();
            }}
          >
            Highlight
          </button>
        )}

        {tool === "select" && (
          <button
            style={{
              border: "none",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
              background: "#3b82f6",
              color: "white",
              fontSize: "12px",
            }}
            onClick={() => {
              // Send selection to chat without creating a highlight
              onTextSelection?.({ text: p.selectedText, pageNumber: p.pageIndex + 1, context: p.selectedText });
              p.cancel();
            }}
          >
            Send to Chat
          </button>
        )}
      </div>
    );
  };

  const renderHighlights = (p) => {
    return (
    <>
      {highlights.map((h) => {
        const pageHighlights = h.areas.filter((a) => a.pageIndex === p.pageIndex);
        return pageHighlights.map((a, i) => (
            <div
              key={`${h.id}-${i}`}
              style={{
                ...p.getCssProperties(a, p.rotation),
                background: h.color,
                opacity: 0.35,
                borderRadius: 2,
                mixBlendMode: "multiply",
                pointerEvents: tool === "eraser" ? "auto" : "none",
                cursor: tool === "eraser" ? "crosshair" : "default",
                transition: "opacity 0.2s ease, background-color 0.2s ease",
                zIndex: 1201, // sit above PDF text layer
              }}
              className={tool === "eraser" ? "pdf-highlight-erasable" : ""}
              title={tool === "eraser" ? "Click to erase this highlight" : ""}
              data-debug={`tool:${tool},erasable:${tool === "eraser"}`}
              onMouseDown={
                tool === "eraser"
                  ? (e) => {
                      // Prevent PDF text layer from stealing pointer events
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  : undefined
              }
              onMouseEnter={
                tool === "eraser"
                  ? (e) => {
                      e.target.style.opacity = "0.6";
                      e.target.style.background = "#ff4444";
                      e.target.style.cursor = "crosshair";
                    }
                  : undefined
              }
              onMouseLeave={
                tool === "eraser"
                  ? (e) => {
                      e.target.style.opacity = "0.35";
                      e.target.style.background = h.color;
                    }
                  : undefined
              }
              onClick={
                tool === "eraser"
                  ? (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Snapshot current state before removing highlight
                      pushUndoSnapshot();
                      // Remove the highlight
                      setHighlights((prev) => prev.filter((highlight) => highlight.id !== h.id));
                    }
                  : undefined
              }
            />
          ))
        }
      )}
    </>
  )
  };

  const highlightPluginInstance = highlightPlugin({
    trigger: Trigger.TextSelection,
    renderHighlightTarget,
    renderHighlights,
  });

  // Sync external defaults (only when parent prop changes)
  useEffect(() => {
    setTool(currentTool);
    // intentionally do NOT depend on highlights so erasing/highlight changes
    // don't force the tool back to the prop default
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTool]);
  useEffect(() => setColor(currentColor), [currentColor]);

  // Apply commands from toolbar
  useEffect(() => {
    if (!editingCommand) return;
    const { action, tool: cmdTool, color: cmdColor } = editingCommand;
    switch (action) {
      case "activate-tool":
        if (cmdTool) setTool(cmdTool);
        if (cmdColor) setColor(cmdColor);
        break;
      case "change-color":
      case "change-highlighter-color":
        if (cmdColor) setColor(cmdColor);
        break;
      case "clear-all":
        // Snapshot current state then clear plugin-managed highlights so this can be undone
        pushUndoSnapshot();
        setHighlights([]);
        // Clear number markers
        document
          .querySelectorAll(".pdf-number-marker")
          .forEach((el) => el.remove());
        break;
      case "undo":
        undo();
        break;
      case "redo":
        redo();
        break;
      default:
        console.log("❓ Unknown command:", action);
        break;
    }
    onCommandProcessed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingCommand]);

  // Keyboard shortcuts for undo / redo
  useEffect(() => {
    const onKey = (e) => {
      const key = (e.key || '').toLowerCase();
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;
      if (key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
      onLoadSuccess?.(numPages);
    },
    [onLoadSuccess]
  );

  // Number annotation placement and eraser handling
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;

    const onClick = (e) => {
      // Handle number marker erasing
      if (tool === "eraser" && e.target.classList.contains("pdf-number-marker")) {
        console.log("🗑️ Erasing number marker");
        e.preventDefault();
        e.stopPropagation();
        pushUndoSnapshot();
        e.target.remove();
        return;
      }

      // Handle number marker creation
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
                pointer-events: auto;
                cursor: pointer;
                transition: background-color 0.2s ease;
            `;
      
      const computed = getComputedStyle(pageEl);
      if (computed.position === "static") pageEl.style.position = "relative";
      pageEl.appendChild(marker);
      onCreateNumberAnnotation?.(number, { x, y, pageNumber });
    };

    const onMouseMove = (e) => {
      // Update marker hover states based on current tool
      if (e.target.classList.contains("pdf-number-marker")) {
        if (tool === "eraser") {
          e.target.style.backgroundColor = "#ff4444";
          e.target.style.cursor = "crosshair";
        } else {
          e.target.style.backgroundColor = "#111";
          e.target.style.cursor = "pointer";
        }
      }
    };

    el.addEventListener("click", onClick);
    el.addEventListener("mouseover", onMouseMove);
    
    return () => {
      el.removeEventListener("click", onClick);
      el.removeEventListener("mouseover", onMouseMove);
    };
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
  <div className={`relative h-full ${className} edu-pdf-viewer ${
    tool === "eraser" ? "eraser-active" : 
    tool === "highlighter" ? "highlighter-active" : ""
  }`} ref={viewerRef}>
      <Worker workerUrl={WORKER_URL}>
        <Viewer
          fileUrl={fileUrl}
          onDocumentLoad={handleDocumentLoad}
          plugins={[defaultLayoutPluginInstance, highlightPluginInstance]}
        />
      </Worker>
    </div>
  );
}

export default ReactPDFViewerNew;
