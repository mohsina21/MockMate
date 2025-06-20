import { useRef, useEffect } from "react";

export default function TestCamera() {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
          };
        }
      })
      .catch((err) => console.error("Camera error:", err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "300px",
          backgroundColor: "#ccc",
          borderRadius: 8,
          objectFit: "cover"
        }}
      />
    </div>
  );
}
