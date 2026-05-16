import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPresignedUrl, putFileToS3 } from '../../apis/upload';
import { convertHumanBg, convertMood } from '../../apis/spotConvert';

type Mode = 'humanBg' | 'mood';
type Step = 'upload' | 'loading' | 'result';

const C = {
  bg: '#13191C',
  surface: '#1C1B1B',
  border: '#313030',
  red: '#EF4444',
  darkRed: '#7F1C1D',
  pink: '#FFB3AD',
  muted: '#ADABAA',
} as const;

export default function PhotoGeneratePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('humanBg');
  const [step, setStep] = useState<Step>('upload');

  const personRef = useRef<HTMLInputElement | null>(null);
  const spotRef = useRef<HTMLInputElement | null>(null);
  const bgRef = useRef<HTMLInputElement | null>(null);

  const [personFile, setPersonFile] = useState<File | null>(null);
  const [spotFile, setSpotFile] = useState<File | null>(null);
  const [bgFile, setBgFile] = useState<File | null>(null);

  const [personPreview, setPersonPreview] = useState('');
  const [spotPreview, setSpotPreview] = useState('');
  const [bgPreview, setBgPreview] = useState('');

  const [generatedImage, setGeneratedImage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const pickFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (f: File) => void,
    previewSetter: (url: string) => void,
    prevPreview: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (prevPreview) URL.revokeObjectURL(prevPreview);
    setter(file);
    previewSetter(URL.createObjectURL(file));
    e.target.value = '';
  };

  const resetFiles = () => {
    if (personPreview) URL.revokeObjectURL(personPreview);
    if (spotPreview) URL.revokeObjectURL(spotPreview);
    if (bgPreview) URL.revokeObjectURL(bgPreview);
    setPersonFile(null);
    setSpotFile(null);
    setBgFile(null);
    setPersonPreview('');
    setSpotPreview('');
    setBgPreview('');
    if (personRef.current) personRef.current.value = '';
    if (spotRef.current) spotRef.current.value = '';
    if (bgRef.current) bgRef.current.value = '';
  };

  const handleModeChange = (m: Mode) => {
    setMode(m);
    resetFiles();
    setGeneratedImage('');
    setStep('upload');
  };

  const handleGenerate = async () => {
    try {
      if (mode === 'humanBg') {
        if (!personFile || !spotFile) {
          setErrorMsg('인물 사진과 배경 사진을 모두 업로드해주세요.');
          return;
        }
        setStep('loading');
        const [p, s] = await Promise.all([
          getPresignedUrl('person', personFile.name),
          getPresignedUrl('spot', spotFile.name),
        ]);
        await Promise.all([putFileToS3(p.presignedUrl, personFile), putFileToS3(s.presignedUrl, spotFile)]);
        const { convertedImageUrl } = await convertHumanBg({
          personImageUrl: p.imageUrl,
          spotImageUrl: s.imageUrl,
        });
        setGeneratedImage(convertedImageUrl);
        setStep('result');
      } else {
        if (!bgFile) {
          setErrorMsg('배경 사진을 업로드해주세요.');
          return;
        }
        setStep('loading');
        const { presignedUrl, imageUrl } = await getPresignedUrl('background', bgFile.name);
        await putFileToS3(presignedUrl, bgFile);
        const { convertedImageUrl } = await convertMood({ backgroundImageUrl: imageUrl });
        setGeneratedImage(convertedImageUrl);
        setStep('result');
      }
    } catch (e) {
      setStep('upload');
      setErrorMsg(e instanceof Error ? e.message : '이미지 생성에 실패했습니다.');
    }
  };

  /* ── Loading ── */
  if (step === 'loading') {
    return (
      <div style={{ ...s.page, alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={s.spinner} />
        <p style={{ fontSize: '15px', color: C.muted, letterSpacing: '-0.3px', margin: 0 }}>사진을 생성 중입니다</p>
      </div>
    );
  }

  /* ── Result ── */
  if (step === 'result') {
    return (
      <div style={s.page}>
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => setStep('upload')}>
            <ChevronLeft />
          </button>
          <span style={s.headerTitle}>사진 필터 입히기</span>
        </div>
        <div style={s.divider} />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px 20px 0',
            gap: '20px',
          }}
        >
          <p style={{ fontSize: '18px', fontWeight: 700, color: C.red, letterSpacing: '-0.3px', margin: 0 }}>
            사진이 완성되었습니다!
          </p>
          <div
            style={{
              width: '100%',
              aspectRatio: '4/3',
              borderRadius: '8px',
              border: `3px solid ${C.darkRed}`,
              overflow: 'hidden',
              backgroundColor: C.surface,
            }}
          >
            <img
              src={generatedImage}
              alt="생성된 이미지"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>

        <div style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            style={{
              width: '100%',
              height: '48px',
              border: '1px solid rgba(194,160,158,0.2)',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,179,173,0.08)',
              color: C.pink,
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '-0.2px',
            }}
            onClick={handleGenerate}
          >
            ↻ 재생성 하기
          </button>
          <p style={{ textAlign: 'center', fontSize: '13px', color: C.muted, margin: 0, letterSpacing: '-0.2px' }}>
            이미지를 꾹 누르면 다운로드 할 수 있어요!
          </p>
        </div>
      </div>
    );
  }

  /* ── Upload ── */
  return (
    <div style={s.page}>
      {/* 에러 모달 */}
      {errorMsg && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', textAlign: 'center', margin: '0 0 8px' }}>
              잘못 입력하셨어요
            </p>
            <p style={{ fontSize: '13px', color: C.muted, textAlign: 'center', margin: '0 0 20px' }}>{errorMsg}</p>
            <button style={s.mainBtn} onClick={() => setErrorMsg('')}>
              확인
            </button>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
        <span style={s.headerTitle}>사진 필터 입히기</span>
      </div>
      <div style={s.divider} />

      <div style={s.content}>
        {/* 모드 탭 */}
        <div style={s.tabWrap}>
          {(['humanBg', 'mood'] as Mode[]).map((m) => (
            <button
              key={m}
              style={{ ...s.tab, ...(mode === m ? s.tabActive : {}) }}
              onClick={() => handleModeChange(m)}
            >
              {m === 'humanBg' ? '심령사진 생성' : '분위기 변환'}
            </button>
          ))}
        </div>

        {/* 업로드 슬롯 */}
        {mode === 'humanBg' ? (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
            <UploadSlot
              label="인물 사진"
              preview={personPreview}
              inputRef={personRef}
              onChange={(e) => pickFile(e, setPersonFile, setPersonPreview, personPreview)}
            />
            <UploadSlot
              label="심령스팟 배경"
              preview={spotPreview}
              inputRef={spotRef}
              onChange={(e) => pickFile(e, setSpotFile, setSpotPreview, spotPreview)}
            />
          </div>
        ) : (
          <label style={s.uploadBox}>
            {bgPreview ? (
              <img src={bgPreview} alt="배경" style={s.fillImg} />
            ) : (
              <div style={s.uploadInner}>
                <div style={s.plusCircle}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke={C.muted} strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>
                <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>사진 업로드 하기</p>
              </div>
            )}
            <input
              ref={bgRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => pickFile(e, setBgFile, setBgPreview, bgPreview)}
            />
          </label>
        )}

        {/* 삭제 버튼 */}
        <button style={s.deleteBtn} onClick={resetFiles}>
          사진 파일 삭제
        </button>

        {/* 생성 버튼 */}
        <button style={{ ...s.mainBtn, marginTop: 'auto', width: '100%' }} onClick={handleGenerate}>
          사진 생성하기
        </button>
      </div>
    </div>
  );
}

/* ── 업로드 슬롯 (인물/배경 분리용) ── */
function UploadSlot({
  label,
  preview,
  inputRef,
  onChange,
}: {
  label: string;
  preview: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <p style={{ fontSize: '12px', color: C.muted, margin: 0, letterSpacing: '-0.2px' }}>{label}</p>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: C.surface,
          height: '150px',
          borderRadius: '4px',
          cursor: 'pointer',
          overflow: 'hidden',
          border: `1px solid ${C.border}`,
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt={label}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: C.border,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke={C.muted} strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>업로드</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onChange} />
      </label>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="22"
      height="22"
      fill="none"
      stroke={C.pink}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100dvh',
    backgroundColor: C.bg,
    display: 'flex',
    flexDirection: 'column',
    color: '#fff',
  },
  header: {
    height: '88px',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '0 20px 16px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    marginRight: '12px',
  },
  headerTitle: {
    fontSize: '17px',
    fontWeight: 600,
    color: C.pink,
    letterSpacing: '-0.3px',
  },
  divider: {
    height: '1px',
    backgroundColor: C.border,
    margin: '0 0 20px',
  },
  content: {
    flex: 1,
    padding: '0 20px 36px',
    display: 'flex',
    flexDirection: 'column',
  },
  tabWrap: {
    display: 'flex',
    backgroundColor: C.surface,
    borderRadius: '8px',
    padding: '3px',
    marginBottom: '20px',
  },
  tab: {
    flex: 1,
    height: '34px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: C.muted,
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '-0.2px',
    transition: 'background 0.15s',
  },
  tabActive: {
    backgroundColor: C.darkRed,
    color: '#fff',
  },
  uploadBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface,
    height: '169px',
    borderRadius: '4px',
    cursor: 'pointer',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  uploadInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  plusCircle: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: C.border,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fillImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  deleteBtn: {
    marginLeft: 'auto',
    display: 'block',
    background: 'none',
    border: `1px solid ${C.border}`,
    borderRadius: '6px',
    padding: '5px 10px',
    fontSize: '12px',
    color: C.muted,
    cursor: 'pointer',
    marginBottom: '16px',
  },
  mainBtn: {
    height: '48px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: C.red,
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '-0.2px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: `4px solid ${C.border}`,
    borderTop: `4px solid ${C.red}`,
    animation: 'spin 1s linear infinite',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.72)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '24px',
  },
  modal: {
    backgroundColor: '#1C1B1B',
    borderRadius: '16px',
    padding: '28px 24px 20px',
    width: '100%',
    maxWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
  },
};
