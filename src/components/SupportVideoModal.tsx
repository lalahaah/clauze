"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SupportVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const R = {
  bgDark: "#093944",
  textWhite: "#FFFFFF",
  tealBright: "#00C2B5",
  tealBtn: "#00C2B5",
  tealDark: "#00857C",
  fontSans: "'DM Sans', -apple-system, sans-serif",
};

export function SupportVideoModal({ isOpen, onClose }: SupportVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowEmail(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  const handleVideoEnd = () => {
    setShowEmail(true);
  };

  const handleClose = () => {
    setShowEmail(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "90%",
              maxWidth: "900px",
              background: R.bgDark,
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                width: "40px",
                height: "40px",
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={R.textWhite} strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Video container */}
            <div style={{ position: "relative", backgroundColor: "#000", paddingBottom: "56.25%", height: 0 }}>
              <video
                ref={videoRef}
                onEnded={handleVideoEnd}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                controls
              >
                <source src="/ClauzeIntro.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Email overlay at the end */}
            <AnimatePresence>
              {showEmail && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(9, 57, 68, 0.95)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 5,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <h3
                      style={{
                        fontFamily: R.fontSans,
                        fontSize: "24px",
                        fontWeight: 700,
                        color: R.textWhite,
                        marginBottom: "16px",
                      }}
                    >
                      Get in touch
                    </h3>
                    <a
                      href="mailto:hello@nextidealab.app"
                      style={{
                        fontFamily: R.fontSans,
                        fontSize: "18px",
                        fontWeight: 600,
                        color: R.tealBright,
                        textDecoration: "none",
                        borderBottom: `2px solid ${R.tealBright}`,
                        paddingBottom: "4px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = R.tealDark;
                        e.currentTarget.style.borderColor = R.tealDark;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = R.tealBright;
                        e.currentTarget.style.borderColor = R.tealBright;
                      }}
                    >
                      hello@nextidealab.app
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
