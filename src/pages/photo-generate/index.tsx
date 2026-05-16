import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateImageApi } from "../../apis/imageGenerateApi";
import CommonPopup from "../../components/CommonPopup/CommonPopup";

type PageStep = "upload" | "loading" | "result";

export default function PhotoGeneratePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<PageStep>("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");

  const [popup, setPopup] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const openPopup = (title: string, message: string) => {
    setPopup({
      isOpen: true,
      title,
      message,
    });
  };

  const closePopup = () => {
    setPopup({
      isOpen: false,
      title: "",
      message: "",
    });
  };

  const prompt = `
업로드한 사진을 기반으로 현실적인 심령사진 분위기로 자연스럽게 수정해줘.

원본 사진의 장소와 구도는 유지하고,
전체적으로 어둡고 으스스한 분위기를 추가해줘.

다음 요소들을 자연스럽게 반영해줘:
- 어두운 조명
- 푸른빛 또는 회색빛 색감
- 흐릿한 안개
- 오래된 카메라로 찍은 듯한 노이즈
- 희미한 그림자
- 기묘한 분위기
- 귀신이 나올 것 같은 공포 연출
- 폐가/흉가 느낌
- 심령사진 같은 현실적인 분위기

단, 과하게 괴물처럼 만들지 말고
실제로 찍힌 심령사진처럼 현실감 있게 표현해줘.
`;

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
      openPopup("사진 업로드 필요", "사진을 먼저 업로드해주세요.");
      return;
    }

    try {
      setStep("loading");

      const data = await generateImageApi({
        image: imageFile,
        prompt,
      });

      setGeneratedImage(data.image);
      setStep("result");
    } catch (error) {
      console.error(error);
      setStep("upload");

      openPopup(
        "사진 생성 실패",
        "사진 생성 중 오류가 발생했어요.\n잠시 후 다시 시도해주세요."
      );
    }
  };

  const handleDownload = () => {
    if (!generatedImage) {
      openPopup("다운로드 실패", "다운로드할 이미지가 없습니다.");
      return;
    }

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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (step === "loading") {
    return (
      <div style={s.page}>
        <div style={s.loadingWrap}>
          <div style={s.spinner} />
          <p style={s.loadingText}>사진이 생성 중입니다.</p>
        </div>

        <CommonPopup
          isOpen={popup.isOpen}
          title={popup.title}
          message={popup.message}
          onClose={closePopup}
        />
      </div>
    );
  }

  if (step === "result") {
    return (
      <div style={s.page}>
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => navigate(-1)}>
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="#FFB3AD"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <span style={s.headerTitle}>사진이 완성되었어요!</span>
        </div>

        <div style={s.separator} />

        <div style={s.resultContent}>
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

          <div style={s.resultImageBox}>
            <img src={generatedImage} alt="생성된 이미지" style={s.fillImage} />
          </div>
        </div>

        <div style={s.buttonGroup}>
          <button style={s.ghostButton} onClick={handleGenerate}>
            ↻ 재생성 하기
          </button>

          <button style={s.mainButton} onClick={handleDownload}>
            ↓ 다운로드 하기
          </button>

          <button style={s.textButton} onClick={() => navigate(-1)}>
            메인으로 돌아가기
          </button>
        </div>

        <CommonPopup
          isOpen={popup.isOpen}
          title={popup.title}
          message={popup.message}
          onClose={closePopup}
        />
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="#FFB3AD"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <span style={s.headerTitle}>사진 필터 입히기</span>
      </div>

      <div style={s.separator} />

      <div style={s.content}>
        <p style={s.sectionLabel}>예시</p>

        <div style={s.exampleRow}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={s.exampleImage} />
          ))}
        </div>

        <label style={s.uploadBox}>
          {previewImage ? (
            <img src={previewImage} alt="업로드 이미지" style={s.containImage} />
          ) : (
            <div style={s.uploadInner}>
              <div style={s.plusCircle}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="#ADABAA"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
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

        {previewImage && (
          <button style={s.deleteButton} onClick={handleDeleteImage}>
            사진 파일 삭제
          </button>
        )}

        <button style={s.mainButton} onClick={handleGenerate}>
          사진 생성하기
        </button>
      </div>

      <CommonPopup
        isOpen={popup.isOpen}
        title={popup.title}
        message={popup.message}
        onClose={closePopup}
      />
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
  content: {
    flex: 1,
    padding: "0 20px 36px",
    display: "flex",
    flexDirection: "column",
  },
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
  hiddenInput: {
    display: "none",
  },
  fillImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  containImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
  },
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
  resultContent: {
    flex: 1,
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
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
  resultImageBox: {
    width: "100%",
    aspectRatio: "320 / 170",
    backgroundColor: "#1C1B1B",
    borderRadius: "6px",
    border: "3px solid #7F1C1D",
    overflow: "hidden",
  },
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