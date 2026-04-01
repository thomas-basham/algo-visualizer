import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = "Algo Visualizer social preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "linear-gradient(180deg, rgba(4,8,19,1) 0%, rgba(7,16,29,1) 55%, rgba(4,9,20,1) 100%)",
          color: "#f8fbff",
          padding: "56px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.22), transparent 28%), radial-gradient(circle at bottom right, rgba(16,185,129,0.18), transparent 24%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            borderRadius: "34px",
            border: "1px solid rgba(148,163,184,0.14)",
            background: "linear-gradient(180deg, rgba(11,18,33,0.85), rgba(7,12,22,0.76))",
            padding: "44px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                display: "flex",
                width: "56px",
                height: "56px",
                borderRadius: "18px",
                border: "1px solid rgba(103,232,249,0.28)",
                background: "linear-gradient(180deg, rgba(17,24,39,0.96), rgba(7,12,22,0.98))",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "10px",
                  bottom: "10px",
                  width: "2px",
                  borderRadius: "999px",
                  background: "#67e8f9",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "27px",
                  top: "14px",
                  bottom: "14px",
                  width: "2px",
                  borderRadius: "999px",
                  background: "#34d399",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "39px",
                  top: "8px",
                  bottom: "8px",
                  width: "2px",
                  borderRadius: "999px",
                  background: "#fbbf24",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 22,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(203, 213, 225, 0.92)",
                }}
              >
                Algo Visualizer
              </div>
              <div style={{ marginTop: 8, fontSize: 18, color: "#9eb1cc" }}>
                Production-minded algorithm and data-structure labs
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "860px" }}>
            <div
              style={{
                fontSize: 60,
                lineHeight: 1.02,
                fontWeight: 700,
                letterSpacing: "-0.04em",
              }}
            >
              Understand how algorithms behave through event-driven playback.
            </div>
            <div style={{ fontSize: 24, lineHeight: 1.5, color: "#cbd5e1" }}>
              Sorting, searching, graph traversal, and data structures in a serious educational interface designed for demos, portfolios, and developer learning.
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {["Sorting", "Searching", "Data Structures", "Graphs"].map((label) => (
              <div
                key={label}
                style={{
                  borderRadius: "999px",
                  border: "1px solid rgba(148,163,184,0.16)",
                  background: "rgba(255,255,255,0.04)",
                  padding: "12px 18px",
                  fontSize: 18,
                  color: "#e2e8f0",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
