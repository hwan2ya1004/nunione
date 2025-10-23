"use client";

export default function LoadingSpinner() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0f2fe 0%, #fff9c4 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          animation: "fadeIn 0.6s ease-in-out",
        }}
      >
        {/* Nu’ni 로고 */}
        <img
          src="/favicon.ico"
          alt="Nu’ni 로고"
          width={80}
          height={80}
          style={{
            animation: "spin 2s linear infinite",
          }}
        />
        <p
          style={{
            fontWeight: "bold",
            fontSize: "18px",
            color: "#1f2937",
            letterSpacing: "1px",
          }}
        >
          Nu’ni Loading...
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
