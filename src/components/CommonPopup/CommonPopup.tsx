interface CommonPopupProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

export default function CommonPopup({
  isOpen,
  title,
  message,
  buttonText = "확인",
  onClose,
}: CommonPopupProps) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h3 style={styles.title}>{title}</h3>

        <p style={styles.message}>{message}</p>

        <button style={styles.button} onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  popup: {
    width: "300px",
    minHeight: "177px",
    padding: "28px 22px 24px",
    borderRadius: "10px",
    backgroundColor: "rgba(28, 4, 4, 0.88)",
    border: "2px solid rgba(194, 160, 158, 0.2)",
    boxSizing: "border-box",
    color: "#fff",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
  },
  message: {
    margin: "14px 0 22px",
    fontSize: "13px",
    lineHeight: "20px",
    color: "rgba(255, 255, 255, 0.85)",
    whiteSpace: "pre-line",
  },
  button: {
    width: "100%",
    height: "42px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#EF4444",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
  },
}; 