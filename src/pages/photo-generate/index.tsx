import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateImageApi } from "../../apis/imageGenerateApi";

type PageStep = "upload" | "loading" | "result";

export default function PhotoGeneratePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<PageStep>("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");

  const prompt =
    "업로드한 사진을 기반으로 무서운 분위기의 이미지로 자연스럽게 수정해줘. 원본 사진의 구도와 주요 피사체는 유지해줘.";

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setGeneratedImage("");
    setStep("upload");
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      alert("사진을 업로드해주세요.");
      return;
    }
    try {
      setStep("loading");
      const data = await generateImageApi({ image: imageFile, prompt });
      setGeneratedImage(data.image);
      setStep("result");
    } catch (error) {
      console.error(error);
      alert("이미지 생성에 실패했습니다.");
      setStep("upload");
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = "generated-image.png";
    link.click();
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setPreviewImage("");
    setGeneratedImage("");
    setStep("upload");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Loading ── */
  if (step === "loading") {
    return (
      <div style={s.page}>
        <div style={s.loadingWrap}>
          <div style={s.spinner} />
          <p style={s.loadingText}>사진이 생성 중입니다.</p>
        </div>
      </div>
    );
  }

  /* ── Result ── */
  if (step === "result") {
    return (
      <div style={s.page}>
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => setStep("upload")}>
            <svg width="22" height="22" fill="none" stroke="#FFB3AD" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span style={s.headerTitle}>사진이 완성되었어요!</span>
        </div>
        <div style={s.separator} />

        <div style={s.resultContent}>
          {/* 원본 + 생성 비교 */}
          {previewImage && (
            <div style={s.compareRow}>
              <div style={s.compareBox}>
                <img src={previewImage} alt="원본" style={s.fillImage} />
                <span style={s.compareLabel}>원본</span>
              </div>
              <div style={s.compareArrow}>→</div>
              <div style={s.compareBox}>
                <img src={generatedImage} alt="생성" style={s.fillImage} />
                <span style={s.compareLabel}>생성</span>
              </div>
            </div>
          )}

          {/* 생성된 이미지 (크게) */}
          <div style={s.resultImageBox}>
            <img src={generatedImage} alt="생성된 이미지" style={s.fillImage} />
          </div>
        </div>

        <div style={s.buttonGroup}>
          <button style={s.ghostButton} onClick={handleGenerate}>↻ 재생성 하기</button>
          <button style={s.mainButton} onClick={handleDownload}>↓ 다운로드 하기</button>
          <button style={s.textButton} onClick={() => navigate(-1)}>
            메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  /* ── Upload ── */
  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <svg width="22" height="22" fill="none" stroke="#FFB3AD" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span style={s.headerTitle}>사진 필터 입히기</span>
      </div>
      <div style={s.separator} />

      <div style={s.content}>
        {/* 예시 이미지 */}
        <p style={s.sectionLabel}>예시</p>
        <div style={s.exampleRow}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={s.exampleImage} />
          ))}
        </div>

        {/* 업로드 영역 */}
        <label style={s.uploadBox}>
          {previewImage ? (
            <img src={previewImage} alt="업로드 이미지" style={s.fillImage} />
          ) : (
            <div style={s.uploadInner}>
              <div style={s.plusCircle}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#ADABAA" strokeWidth="2.2"
                    strokeLinecap="round" />
                </svg>
              </div>
              <p style={s.uploadText}>사진 업로드 하기</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={s.hiddenInput}
          />
        </label>

        {/* 사진 삭제 */}
        <button style={s.deleteButton} onClick={handleDeleteImage}>
          사진 파일 삭제
        </button>

        {/* 생성 버튼 */}
        <button style={s.mainButton} onClick={handleGenerate}>
          사진 생성하기
        </button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100dvh",
    backgroundColor: "#13191C",
    display: "flex",
    flexDirection: "column",
    fontFamily: "-apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
    color: "#fff",
  },

  /* 헤더 */
  header: {
    height: "88px",
    display: "flex",
    alignItems: "flex-end",
    padding: "0 20px 16px",
    position: "relative",
  },
  backBtn: {
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    marginRight: "12px",
  },
  headerTitle: {
    fontSize: "17px",
    fontWeight: 600,
    color: "#FFB3AD",
    letterSpacing: "-0.3px",
  },
  separator: {
    height: "1px",
    backgroundColor: "#313030",
    margin: "0 0 24px",
  },

  /* 본문 */
  content: {
    flex: 1,
    padding: "0 20px 36px",
    display: "flex",
    flexDirection: "column",
  },

  /* 예시 */
  sectionLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#7F1C1D",
    marginBottom: "10px",
    letterSpacing: "-0.2px",
  },
  exampleRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
  },
  exampleImage: {
    flex: 1,
    height: "74px",
    backgroundColor: "#1C1B1B",
    border: "1px solid #7F1C1D",
    borderRadius: "4px",
  },

  /* 업로드 */
  uploadBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C1B1B",
    height: "169px",
    borderRadius: "4px",
    cursor: "pointer",
    overflow: "hidden",
  },
  uploadInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  plusCircle: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    backgroundColor: "#313030",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontSize: "13px",
    color: "#ADABAA",
    margin: 0,
  },
  hiddenInput: { display: "none" },
  fillImage: { width: "100%", height: "100%", objectFit: "cover", display: "block" },

  /* 삭제 */
  deleteButton: {
    marginTop: "8px",
    marginLeft: "auto",
    display: "block",
    background: "none",
    border: "1px solid #313030",
    borderRadius: "6px",
    padding: "5px 10px",
    fontSize: "12px",
    color: "#ADABAA",
    cursor: "pointer",
  },

  /* 생성 버튼 (빨간) */
  mainButton: {
    width: "100%",
    marginTop: "auto",
    padding: "0",
    height: "42px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#EF4444",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "-0.2px",
    marginBottom: "8px",
  },

  /* 재생성 버튼 (아웃라인) */
  ghostButton: {
    width: "100%",
    height: "42px",
    border: "1px solid rgba(194, 160, 158, 0.2)",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 179, 173, 0.08)",
    color: "#FFB3AD",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "-0.2px",
  },

  /* 결과 버튼 그룹 */
  buttonGroup: {
    padding: "0 20px 36px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "auto",
  },
  textButton: {
    background: "none",
    border: "none",
    color: "#6F6F70",
    fontSize: "13px",
    cursor: "pointer",
    padding: "8px 0",
    letterSpacing: "-0.2px",
  },

  /* 결과 본문 */
  resultContent: {
    flex: 1,
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  /* 원본/생성 비교 (작은 썸네일) */
  compareRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  compareBox: {
    flex: 1,
    position: "relative",
    height: "90px",
    backgroundColor: "#1C1B1B",
    borderRadius: "6px",
    border: "1px solid #7F1C1D",
    overflow: "hidden",
  },
  compareArrow: {
    color: "#7F1C1D",
    fontSize: "18px",
    flexShrink: 0,
  },
  compareLabel: {
    position: "absolute",
    bottom: "6px",
    left: "8px",
    fontSize: "10px",
    color: "#ADABAA",
    backgroundColor: "rgba(19,25,28,0.7)",
    padding: "2px 6px",
    borderRadius: "4px",
    letterSpacing: "-0.2px",
  },

  /* 생성 이미지 (크게) */
  resultImageBox: {
    width: "100%",
    aspectRatio: "320 / 170",
    backgroundColor: "#1C1B1B",
    borderRadius: "6px",
    border: "3px solid #7F1C1D",
    overflow: "hidden",
  },

  /* 로딩 */
  loadingWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
  },
  spinner: {
    width: "42px",
    height: "42px",
    border: "4px solid #313030",
    borderTop: "4px solid #EF4444",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: "14px",
    color: "#ADABAA",
    margin: 0,
    letterSpacing: "-0.2px",
  },
};
