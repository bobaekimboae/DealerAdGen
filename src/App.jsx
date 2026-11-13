import { useMemo, useRef, useState } from 'react';

const typeGroups = {
  Sales: ['신차 입고', '판매 이벤트', '있는 그대로', '블랙 프라이데이', '연말 정리', '인증 중고차', '차량 소개', '전기차·하이브리드', '상용차·플릿'],
  'Finance & trade': ['리스·금융', '내 차 삽니다', '리스 만기'],
  'Service & parts': ['정비 서비스', '타이어 교체', '배터리·겨울 점검', '부품·액세서리'],
  Community: ['매장 소식', '지역 행사', '축하 인사', '고객 감사'],
};
const groupKo = { Sales: '판매', 'Finance & trade': '금융·매입', 'Service & parts': '서비스·부품', Community: '지역 소식' };
const typeSubtitles = ['매장에 들어온 차량을 소개합니다', '시즌·월말·재고 정리 이벤트', '실제 차량 사진으로 간결하게', '기간 한정 특가를 알립니다', '연말 재고 정리 행사', '인증·중고차 재고 소개', '차량 한 대를 집중 소개합니다', '전기·하이브리드 모델 소개', '트럭과 밴을 소개합니다'];
const looks = {
  인기: ['강렬하고 세련된', '있는 그대로', '깨끗하고 밝은', '프리미엄', '아웃도어', '가족 친화', '시즌 무드', '빅 세일', '라이프스타일'],
  계절: ['봄의 산뜻함', '여름 드라이브', '가을 감성', '윈터 세일', '첫눈'],
  장소: ['도심 야경', '해안 도로', '산악 드라이브', '쇼룸', '모던 스튜디오'],
  분위기: ['대담한', '차분한', '역동적인', '따뜻한', '럭셔리'],
  디자인: ['미니멀', '에디토리얼', '네온 라인', '클래식 포스터', '기하학'],
  크리에이티브: ['시네마틱', '레트로', '미래적인', '스포츠', '콜라주'],
  휴일: ['추수감사절', '블랙 프라이데이', '연말연시', '새해', '설날'],
};
const formatGroups = {
  소셜: [['피드 게시물', '1:1 · 인스타그램 · 페이스북', 1080, 1080], ['세로 게시물', '4:5 · 인스타그램 피드', 1080, 1350], ['스토리 / 릴스', '9:16 · 인스타그램 · 페이스북 · 틱톡', 1080, 1920], ['와이드 광고', '16:9 · 페이스북 · 유튜브', 1920, 1080], ['페이스북 커버', '1640 × 624 · 페이지 헤더', 1640, 624], ['Google 비즈니스 게시물', '1200 × 900 · 지도·검색', 1200, 900]],
  웹사이트: [['웹 배너', '16:9 · 홈페이지', 1600, 900], ['웹 카드', '4:3 · 차량 목록', 1200, 900], ['정사각형 타일', '1:1 · 웹 갤러리', 1080, 1080]],
  이메일: [['이메일 헤더', '16:9 · 뉴스레터', 1200, 675], ['이메일 카드', '4:3 · 프로모션', 1000, 750]],
  디스플레이: [['가로형 배너', '1200 × 628 · 디스플레이', 1200, 628], ['정사각형 배너', '300 × 300 · 디스플레이', 600, 600], ['세로형 배너', '300 × 600 · 디스플레이', 600, 1200]],
  인쇄: [['전단지', 'A4 세로', 1240, 1754], ['포스터', 'A3 세로', 1754, 2480], ['쇼룸 안내판', '세로형', 1080, 1920]],
  맞춤: [['맞춤 9:16', '1080 × 1920', 1080, 1920], ['맞춤 1:1', '1080 × 1080', 1080, 1080], ['맞춤 16:9', '1920 × 1080', 1920, 1080]],
};
const campaignSet = ['피드 게시물', '스토리 / 릴스', '웹 배너', '이메일 헤더', 'Google 비즈니스 게시물'];
const presets = ['차량 세일', '정비 서비스', '트레이드인', '주말 이벤트', '신규 입고', '지역 커뮤니티'];

function App() {
  const [mode, setMode] = useState('빠른 광고');
  const [group, setGroup] = useState('Sales');
  const [adType, setAdType] = useState('신차 입고');
  const [lookGroup, setLookGroup] = useState('인기');
  const [look, setLook] = useState('강렬하고 세련된');
  const [formatGroup, setFormatGroup] = useState('소셜');
  const [selectedFormats, setSelectedFormats] = useState(['스토리 / 릴스']);
  const [vehicle, setVehicle] = useState('');
  const [color, setColor] = useState('');
  const [offer, setOffer] = useState('');
  const [headline, setHeadline] = useState('신차 입고');
  const [cta, setCta] = useState('시승 예약하기');
  const [finePrint, setFinePrint] = useState('자세한 내용은 매장에 문의하세요');
  const [listingUrl, setListingUrl] = useState('');
  const [vin, setVin] = useState('');
  const [quality, setQuality] = useState('표준');
  const [model, setModel] = useState('사진 중심 합성');
  const [instructions, setInstructions] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [crisp, setCrisp] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [logo, setLogo] = useState(null);
  const [busy, setBusy] = useState('');
  const [ads, setAds] = useState([]);
  const [notice, setNotice] = useState('');
  const photoRef = useRef(null);
  const logoRef = useRef(null);
  const formats = useMemo(() => Object.fromEntries(Object.values(formatGroups).flat().map(([name, label, w, h]) => [name, { label, w, h }])), []);
  const activeTypeIndex = Math.max(0, typeGroups[group].indexOf(adType));

  function setGroupAndType(nextGroup) {
    setGroup(nextGroup);
    const first = typeGroups[nextGroup][0];
    setAdType(first);
    setHeadline(first);
  }
  function chooseType(type) { setAdType(type); setHeadline(type); }
  function toggleFormat(name) { setSelectedFormats(curr => curr.includes(name) ? curr.filter(x => x !== name) : [...curr, name]); }
  function loadFile(file, setter) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setNotice('이미지 파일(JPG, PNG, WebP)을 선택해 주세요.'); return; }
    setter({ file, url: URL.createObjectURL(file) });
  }
  function selectCampaign() {
    setSelectedFormats(campaignSet.filter(x => formats[x]));
    setNotice('캠페인 세트 5개 규격을 선택했습니다.');
  }
  function importListing() {
    if (!listingUrl.trim()) { setNotice('먼저 차량 상세 페이지 주소를 입력해 주세요.'); return; }
    try {
      const parsed = new URL(listingUrl);
      const id = parsed.searchParams.get('no') || parsed.pathname.split('/').filter(Boolean).at(-1);
      setNotice(`링크를 확인했습니다${id ? ` · 매물 번호 ${id}` : ''}. 차량 정보는 확인 후 직접 입력해 주세요.`);
    } catch { setNotice('http:// 또는 https://로 시작하는 주소를 입력해 주세요.'); }
  }
  function decodeVin() {
    const clean = vin.trim().toUpperCase();
    if (clean.length !== 17) { setNotice('VIN은 영문·숫자 17자리로 입력해 주세요.'); return; }
    setNotice('VIN을 확인했습니다. 매물 상세 사양은 정확한 정보로 직접 검수해 주세요.');
  }
  function drawAd(canvas, width, height, zoom = 0) {
    const ctx = canvas.getContext('2d');
    // Resizing a canvas clears it and resets its capture track. Only resize when
    // dimensions actually change; exportVideo redraws this canvas many times.
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    const render = (img, logoImg) => {
      ctx.save();
      if (img) {
        const scale = Math.max(width / img.width, height / img.height) * (1.05 + zoom * 0.035);
        const sw = width / scale, sh = height / scale;
        const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh, -zoom * 10, -zoom * 8, width + zoom * 20, height + zoom * 16);
      } else {
        const grad = ctx.createLinearGradient(0, 0, width, height); grad.addColorStop(0, '#172246'); grad.addColorStop(.55, '#394dcc'); grad.addColorStop(1, '#101326');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.ellipse(width*.55,height*.64,width*.39,height*.12,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(10,15,30,.82)'; ctx.beginPath(); ctx.moveTo(width*.15,height*.66); ctx.lineTo(width*.28,height*.48); ctx.lineTo(width*.66,height*.47); ctx.lineTo(width*.84,height*.62); ctx.lineTo(width*.89,height*.73); ctx.lineTo(width*.12,height*.73); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#9eaefb'; ctx.fillRect(width*.34,height*.52,width*.23,height*.08);
      }
      ctx.restore();
      const vertical = height > width * 1.15;
      const pad = Math.round(width * .075), baseY = Math.round(height * (vertical ? .68 : .67));
      const shade = ctx.createLinearGradient(0, height*.33, 0, height); shade.addColorStop(0, 'rgba(6,10,20,0)'); shade.addColorStop(.42, 'rgba(6,10,20,.48)'); shade.addColorStop(1, 'rgba(6,10,20,.91)'); ctx.fillStyle = shade; ctx.fillRect(0,0,width,height);
      ctx.fillStyle = '#fff'; ctx.textBaseline = 'top';
      ctx.font = `700 ${Math.round(width*.027)}px Arial, sans-serif`; ctx.fillText('보배모터  ·  중고차', pad, Math.round(height*.06));
      const max = Math.round(width*.78); let titleSize = Math.round(width*(vertical ? .085 : .07));
      if (model === '문구 가독성 우선') titleSize = Math.round(titleSize * 1.08);
      if (model === '차량 정보 강조') titleSize = Math.round(titleSize * .93);
      ctx.font = `800 ${titleSize}px Arial, sans-serif`;
      let title = headline || adType;
      while (ctx.measureText(title).width > max && titleSize > 18) { titleSize -= 2; ctx.font = `800 ${titleSize}px Arial, sans-serif`; }
      ctx.fillText(title, pad, baseY);
      ctx.font = `500 ${Math.round(width*.038)}px Arial, sans-serif`;
      const details = model === '차량 정보 강조' ? [vehicle, color, offer].filter(Boolean).join('  ·  ') : [offer, vehicle, color].filter(Boolean).join('  ·  ');
      if (details) ctx.fillText(details, pad, baseY + titleSize*1.25);
      const ctaY = height - Math.round(height*.12), ctaW = Math.min(width*.7, Math.max(width*.36, ctx.measureText(cta).width + pad*1.3));
      ctx.fillStyle = '#4f62ed'; ctx.beginPath(); ctx.roundRect(pad, ctaY, ctaW, Math.round(height*.065), Math.round(height*.022)); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = `700 ${Math.round(width*.03)}px Arial, sans-serif`; ctx.fillText(cta || '자세히 보기', pad*1.35, ctaY + height*.016);
      ctx.fillStyle = 'rgba(255,255,255,.78)'; ctx.font = `400 ${Math.max(10, Math.round(width*.015))}px Arial, sans-serif`; ctx.fillText(finePrint || '자세한 내용은 매장 문의', pad, height - Math.round(height*.04));
      if (crisp && logoImg) { const box = Math.round(width*.14), ratio = Math.min(box/logoImg.width, box/logoImg.height); ctx.drawImage(logoImg, width-pad-box, pad, logoImg.width*ratio, logoImg.height*ratio); }
      return canvas;
    };
    const loadImage = src => new Promise(resolve => { const img = new Image(); img.onload = () => resolve(img); img.onerror = () => resolve(null); img.src = src; });
    return Promise.all([photo ? loadImage(photo.url) : null, crisp && logo ? loadImage(logo.url) : null]).then(([img, logoImg]) => render(img, logoImg));
  }
  async function createAds() {
    if (!selectedFormats.length) { setNotice('광고를 만들 규격을 하나 이상 선택해 주세요.'); return; }
    if (!headline.trim()) { setNotice('광고 헤드라인을 입력해 주세요.'); return; }
    setBusy('생성 중…'); setNotice('');
    try {
      const created = [];
      for (const name of selectedFormats) {
        const size = formats[name]; const canvas = document.createElement('canvas');
        const scale = quality === '4K' ? Math.min(2, 3840 / Math.max(size.w, size.h)) : quality === '고해상도' ? 1.5 : 1;
        await drawAd(canvas, Math.round(size.w*scale), Math.round(size.h*scale));
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        created.push({ id: `${Date.now()}-${name}`, name, w: Math.round(size.w*scale), h: Math.round(size.h*scale), formatW:size.w, formatH:size.h, url: URL.createObjectURL(blob), vehicle: vehicle || '차량 정보 입력', look, type: adType });
      }
      setAds(curr => [...created, ...curr]); setNotice(`${created.length}개 규격의 광고 이미지를 만들었습니다. 각 카드에서 PNG를 저장하거나 스토리·릴스를 영상으로 내보낼 수 있습니다.`);
    } catch (error) { setNotice(`광고를 만들지 못했습니다: ${error.message}`); }
    finally { setBusy(''); }
  }
  async function exportVideo(ad) {
    if (!('MediaRecorder' in window)) { setNotice('이 브라우저는 영상 내보내기를 지원하지 않습니다. PNG 다운로드를 이용해 주세요.'); return; }
    setBusy(`${ad.name} 영상 만드는 중…`);
    try {
      const canvas = document.createElement('canvas'); const { w, h } = ad;
      // captureStream must start with a non-zero surface. Resizing after starting
      // MediaRecorder can mute/reset the track in Chromium and produce a 1 s file.
      canvas.width = w; canvas.height = h;
      const duration = 6, fps = 24, stream = canvas.captureStream(fps);
      await drawAd(canvas, w, h, 0);
      const mime = ['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(x => MediaRecorder.isTypeSupported(x)) || '';
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined); const chunks = [];
      recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      const done = new Promise((resolve, reject) => { recorder.onstop = resolve; recorder.onerror = () => reject(new Error('영상 인코딩에 실패했습니다.')); });
      recorder.start(250); const started = performance.now();
      const tick = async now => {
        const t = (now - started) / 1000;
        await drawAd(canvas, w, h, Math.min(1, t / duration));
        if (t < duration) requestAnimationFrame(tick);
        else recorder.stop();
      };
      requestAnimationFrame(tick); await done;
      const blob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      setAds(curr => curr.map(item => item.id === ad.id ? { ...item, videoUrl } : item));
        setNotice('세로형 영상 미리보기를 준비했습니다. 영상 다운로드를 눌러 파일을 저장하세요.');
    } catch (error) { setNotice(`영상 내보내기 실패: ${error.message}`); }
    finally { setBusy(''); }
  }
  function download(url, name) { const a = document.createElement('a'); a.href = url; a.download = name; a.click(); }
  function safeName(name) { return name.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-|-$/g, '') || 'dealeradgen'; }
  function downloadPng(ad) { download(ad.url, `${safeName(ad.name)}.png`); }
    function downloadVideo(ad) { if (ad.videoUrl) { download(ad.videoUrl, `${safeName(ad.name)}.webm`); setNotice('영상 파일 다운로드를 시작했습니다.'); } }
  function removeAd(id) { setAds(curr => curr.filter(ad => ad.id !== id)); }

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top" id="top"><span className="brand-mark">D</span><span>DEALERADGEN</span></a>
      <nav className="modes" aria-label="주요 메뉴">{['빠른 광고', 'AI에게 질문', '스튜디오', '캘린더', '재고', '윈도 스티커'].map((item, i) => <button key={item} className={mode === item ? 'active' : ''} onClick={() => setMode(item)}>{item}</button>)}</nav>
      <div className="top-actions"><button className="credits">무료 체험 · 0 / 40 크레딧</button><button className="upgrade">업그레이드</button><button className="avatar" aria-label="계정">보</button></div>
    </header>
    <div className="workspace">
      <main className="builder">
        <button className="dealer-card"><span className="eyebrow">내 자동차 매장</span><strong>보배모터</strong><span className="edit">매장 정보 편집</span></button>
        <section className="ideas panel"><div className="section-intro inline"><div><h2>이번 주 게시물 아이디어</h2><p>하나를 고르면 광고 유형, 헤드라인, 디자인을 채워 드립니다.</p></div><span className="sparkle">✦</span></div><div className="idea-row">{presets.map((name, i) => <button key={name} className="idea" onClick={() => { setHeadline(name); setAdType(name); setLook(['가을 감성','윈터 세일','빅 세일','미니멀','강렬하고 세련된','따뜻한'][i]); setNotice(`${name} 아이디어를 적용했습니다.`); }}><span className={`idea-thumb thumb-${i}`}>{['🚘','❄','⚡','🎁','✨','📍'][i]}</span><span><b>{name}</b><small>{['이번 주 추천','지금 적기','시즌 프로모션','지역 고객에게','재고 소개','매장 소식'][i]}</small><small>{['이벤트 · 가을 감성','서비스 · 겨울','세일 · 빅 세일','판매 · 미니멀','판매 · 프리미엄','커뮤니티 · 지역'][i]}</small></span></button>)}</div></section>

        <Step n="1" title="무엇을 홍보할까요?">
          <div className="pills">{Object.keys(typeGroups).map(key => <button key={key} className={group === key ? 'selected' : ''} onClick={() => setGroupAndType(key)}>{groupKo[key]}</button>)}</div>
          <div className="choice-list">{typeGroups[group].map((type, i) => <button key={type} className={`choice ${adType === type ? 'chosen' : ''}`} onClick={() => chooseType(type)}><span className="choice-icon">{['✦','▣','◆','↗','★','◈','🚘','⚡','▰'][i % 9]}</span><span><b>{type}</b><small>{group === 'Sales' ? typeSubtitles[Object.keys(typeGroups).includes(group) ? i : 0] : `${groupKo[group]} 관련 광고를 만들어 보세요`}</small></span><span className="radio-dot" /></button>)}</div>
        </Step>

        <Step n="2" title="상세 정보를 입력하세요">
          <div className="field-block"><label>차량 매물 링크 <em>선택 사항 · 내 웹사이트의 차량 페이지를 붙여 넣으세요</em></label><div className="input-action"><input value={listingUrl} onChange={e => setListingUrl(e.target.value)} placeholder="https://내웹사이트.kr/차량매물"/><button onClick={importListing}>가져오기</button></div><button className="quiet-link" onClick={() => setNotice('차량 사이트에서 사진 다운로드를 허용하지 않는 경우, 차량 사진을 직접 업로드하고 차량 정보를 입력해 주세요.')}>웹사이트에서 가져오지 못하나요? 도움말 보기</button></div>
          <div className="field-block"><label>차대번호(VIN) <em>선택 사항 · 17자리 차량 식별 번호</em></label><div className="input-action"><input value={vin} onChange={e => setVin(e.target.value)} placeholder="차대번호 17자리" maxLength={17}/><button onClick={decodeVin}>확인</button></div></div>
          <div className="upload-row">
            <div className="field-block"><label>차량 사진 <em>실제 차량 사진을 사용합니다</em></label><button className="upload-box" onClick={() => photoRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); loadFile(e.dataTransfer.files[0], setPhoto); }}>{photo ? <><img src={photo.url}/><span>사진 변경</span></> : <><strong>＋</strong><b>사진을 끌어오거나 선택하세요</b><small>JPG, PNG, WebP</small></>}</button><input ref={photoRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={e => loadFile(e.target.files[0], setPhoto)}/></div>
            <div className="fields-grid"><label className="field-block">차량<input value={vehicle} onChange={e => setVehicle(e.target.value)} placeholder="예: 2022 BMW X4 20i M"/></label><label className="field-block">외장 색상<input value={color} onChange={e => setColor(e.target.value)} placeholder="예: 미드나잇 블루"/></label><label className="field-block">가격·혜택<input value={offer} onChange={e => setOffer(e.target.value)} placeholder="예: 4,290만 원"/></label><label className="field-block">헤드라인<input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="광고 제목"/></label><label className="field-block">행동 유도 문구<input value={cta} onChange={e => setCta(e.target.value)} placeholder="예: 시승 예약하기"/></label><label className="field-block">안내 문구<input value={finePrint} onChange={e => setFinePrint(e.target.value)} placeholder="유의 사항"/></label></div>
          </div>
          <label className="checkline"><input type="checkbox" checked={crisp} onChange={e => setCrisp(e.target.checked)}/><span><b>실제 로고와 안내 문구를 선명하게 넣기 <i>베타</i></b><small>로고 이미지를 업로드해 광고 위에 선명하게 배치합니다.</small></span></label>
          {crisp && <div className="logo-upload"><button onClick={() => logoRef.current?.click()}>{logo ? <img src={logo.url}/> : '＋ 매장 로고 업로드'}</button><input ref={logoRef} hidden type="file" accept="image/*" onChange={e => loadFile(e.target.files[0], setLogo)}/><span>투명 배경 PNG를 권장합니다.</span></div>}
        </Step>

        <Step n="3" title="디자인 분위기를 고르세요"><p className="selected-note">선택됨: <b>{look}</b></p><div className="pills look-pills">{Object.keys(looks).map(x => <button key={x} className={lookGroup === x ? 'selected' : ''} onClick={() => setLookGroup(x)}>{x}</button>)}</div><div className="look-grid">{looks[lookGroup].map((x,i) => <button key={x} className={`look-card look-${i} ${look===x?'chosen':''}`} onClick={() => setLook(x)}><span className="look-art"><i/><i/><i/></span><b>{x}</b>{look===x&&<span className="look-check">✓</span>}</button>)}</div></Step>

        <Step n="4" title="어디에 게시할까요?"><p className="helper">여러 규격을 선택할 수 있습니다.</p><div className="pills format-pills">{Object.keys(formatGroups).map(x=><button key={x} className={formatGroup===x?'selected':''} onClick={()=>setFormatGroup(x)}>{x}</button>)}</div><button className="campaign" onClick={selectCampaign}><span>🎯</span><b>캠페인 세트</b><small>· 5개 규격 선택</small></button><div className="format-grid">{formatGroups[formatGroup].map(([name, sub, w,h])=><label key={name} className={`format-option ${selectedFormats.includes(name)?'checked':''}`}><input type="checkbox" checked={selectedFormats.includes(name)} onChange={()=>toggleFormat(name)}/><span className="format-icon" style={{'--ratio':`${w}/${h}`}}/><span><b>{name}</b><small>{sub}</small></span></label>)}</div>
          <div className="advanced-grid"><label className="field-block">로컬 합성 방식<select value={model} onChange={e=>setModel(e.target.value)}><option>사진 중심 합성</option><option>문구 가독성 우선</option><option>차량 정보 강조</option></select></label><fieldset className="quality"><legend>출력 품질</legend>{['표준','고해상도','4K'].map(x=><label key={x}><input type="radio" name="quality" checked={quality===x} onChange={()=>setQuality(x)}/>{x}</label>)}</fieldset></div>
          <button className="expand" onClick={()=>setShowInstructions(!showInstructions)}>{showInstructions?'−':'＋'} 추가 지시사항</button>{showInstructions&&<textarea className="instructions" value={instructions} onChange={e=>setInstructions(e.target.value)} placeholder="색상, 문구 배치, 강조할 사양 등 원하는 내용을 입력하세요."/>}
          <button className="create-button" disabled={!!busy} onClick={createAds}><span>✦</span>{busy || '광고 만들기'}<small>{selectedFormats.length ? `${selectedFormats.length}개 규격` : ''}</small></button>
        </Step>
        {notice&&<div role="status" className="notice"><span>ⓘ</span>{notice}<button onClick={()=>setNotice('')} aria-label="닫기">×</button></div>}
      </main>
      <aside className="results panel"><div className="results-heading"><div><h2>내 광고</h2><p>{ads.length ? `생성한 광고 ${ads.length}개` : '완성한 광고가 여기에 표시됩니다.'}</p></div><button className="dots">···</button></div><p className="local-note">사진과 문구는 이 브라우저에서 합성됩니다.</p>
        {!ads.length ? <div className="empty-results"><div className="empty-icon">▧</div><b>아직 광고가 없습니다</b><p>단계를 입력하고 <b>광고 만들기</b>를 눌러 보세요.</p><small>이미지는 선택한 규격으로 즉시 생성됩니다.</small></div> : <div className="ad-list">{ads.map(ad=><article className="ad-card" key={ad.id}>{ad.videoUrl?<video src={ad.videoUrl} controls playsInline/>:<img src={ad.url} alt={`${ad.name} 광고 미리보기`}/>}<div className="ad-meta"><b>{ad.name}</b><small>{ad.w} × {ad.h} · {ad.vehicle} · {ad.look}</small><div><button onClick={()=>downloadPng(ad)}>PNG 저장</button>{ad.h>ad.w&&<button onClick={()=>ad.videoUrl?downloadVideo(ad):exportVideo(ad)}>{ad.videoUrl?'영상 다운로드':'영상 만들기'}</button>}<button className="remove" onClick={()=>removeAd(ad.id)}>삭제</button></div></div></article>)}</div>}
        <div className="idea-widget"><span className="widget-icon">✧</span><div><b>마케팅 아이디어</b><small>다음 광고 아이디어가 필요하신가요?</small></div><button onClick={()=>setMode('AI에게 질문')}>열기</button></div>
      </aside>
    </div>
    <div className="floating-help"><button onClick={()=>setMode('AI에게 질문')}>✦ <span>마케팅 아이디어</span></button><button onClick={()=>setNotice('궁금한 점은 매장 설정에서 지원팀에 문의할 수 있습니다.')}>◉ <span>도움말</span></button></div>
    <div className="mobile-create"><button onClick={createAds}>✦ 광고 만들기 <small>{selectedFormats.length}개 규격</small></button></div>
  </div>;
}

function Step({n,title,children}) { return <section className="step panel"><div className="section-intro"><span className="step-num">{n}</span><h2>{title}</h2></div>{children}</section>; }

export { App };

