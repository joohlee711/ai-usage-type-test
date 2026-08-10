import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  데이터                                                             */
/* ------------------------------------------------------------------ */

const AXES = {
  A: { left: { key: "G", label: "생성형" }, right: { key: "V", label: "검증형" } },
  B: { left: { key: "S", label: "시스템형" }, right: { key: "H", label: "휴먼형" } },
  C: { left: { key: "D", label: "몰입형" }, right: { key: "O", label: "조망형" } },
};

const QUESTIONS = [
  { axis: "A", q: "AI 창을 여는 순간은 주로 언제인가요?", opts: [
    { t: "뭔가 만들어야 할 때. 초안이든 코드든 기획서든", pole: "G" },
    { t: "그냥 궁금한 게 생겼을 때. 검색하듯이", pole: "N" },
    { t: "전체적인 확인과 정리가 필요할 때", pole: "V" } ] },
  { axis: "B", q: "상대가 \u201c곧 확인해볼게요\u201d라고 답했다. 나는?", opts: [
    { t: "미래의 나에게 \u20183일 뒤에 확인할 것\u2019 메모를 남겨둔다", pole: "S" },
    { t: "뭐, 확인해 주시겠지 하고 기다린다", pole: "N" },
    { t: "그 자리에서 \u201c언제까지 가능하세요?\u201d 하고 날짜를 받는다", pole: "H" } ] },
  { axis: "C", w: 0.5, q: "AI와 업무 대화를 하다 보면 어떻게 흘러가나요?", opts: [
    { t: "스코프가 점점 좁아지더니 어느새 관련 프로젝트 폴더가 생겨 있다", pole: "D" },
    { t: "물어본 것에 답이 오면 대체로 거기서 끝", pole: "N" },
    { t: "특정 주제 질문으로 시작해도 그냥 전반적인 질답 타래가 되어 있다", pole: "O" } ] },
  { axis: "A", q: "AI가 보고서 초안을 뽑아줬다. 제일 먼저 하는 일은?", opts: [
    { t: "그 생성물을 곧장 다시 집어넣고 대화를 이어간다", pole: "G" },
    { t: "일단 쭉 읽어본다. 그다음은 그때 가서", pole: "N" },
    { t: "숫자랑 팩트부터 검산한다", pole: "V" } ] },
  { axis: "B", q: "급하게 확인할 게 생겼다. 첫 수단은?", opts: [
    { t: "메일. 기록도 남고 상대 흐름도 안 끊는다", pole: "S" },
    { t: "그때그때 편한 걸로. 딱히 정해두지 않았다", pole: "N" },
    { t: "전화. 30초면 끝날 일을 왜 텍스트로 하나", pole: "H" } ] },
  { axis: "C", q: "프로젝트 10개짜리 현황 시트를 받았다. 눈이 먼저 가는 곳은?", opts: [
    { t: "오, 이 프로젝트 뭐지? 재밌네", pole: "D" },
    { t: "위에서부터 순서대로 본다", pole: "N" },
    { t: "이 프로젝트는 우리 팀에 배정된 게 맞아?", pole: "O" } ] },
  { axis: "A", q: "동료가 AI로 만든 자료를 공유했다. 속마음은?", opts: [
    { t: "오, 어떻게 만들었지? 프롬프트가 궁금하다", pole: "G" },
    { t: "오 잘 만들었네, 하고 넘어간다", pole: "N" },
    { t: "뒤로 가기랑 앞으로 가기 버튼 폰트가 깨져 있잖아. 괴로워\u2026", pole: "V" } ] },
  { axis: "B", q: "AI, 어느 정도로 쓰고 계세요?", opts: [
    { t: "가끔은 IDE나 CLI에서 마주치는 게 더 편하다", pole: "S" },
    { t: "그때그때 필요한 만큼. 나만의 방식이랄 건 없다", pole: "N" },
    { t: "뭔가 다 넣으면 예쁜 걸 뽑아 주는 마법 친구", pole: "H" } ] },
  { axis: "A", w: 0, q: "AI 답변이 그럴듯한데 어딘가 수상하다. 나는?", opts: [
    { t: "일단 굴러가게 만들고, 다듬는 건 그다음", pole: "G" },
    { t: "찜찜한 채로 쓰거나, 그냥 안 쓴다", pole: "N" },
    { t: "출처를 내놓게 하고 하나씩 교차검증한다", pole: "V" } ] },
  { axis: "B", q: "협업하던 일이 어딘가에서 막혔다. 나는?", opts: [
    { t: "프로세스 어디가 병목인지 구조부터 뜯어본다", pole: "S" },
    { t: "일단 좀 기다려본다. 풀릴 때도 있으니까", pole: "N" },
    { t: "담당자가 누구였더라? 지금 회의 중인가? 일정표를 켜본다", pole: "H" } ] },
  { axis: "C", q: "더 뿌듯한 순간은?", opts: [
    { t: "어려운 문제 하나를 완전히 이해했을 때", pole: "D" },
    { t: "퇴근할 때", pole: "N" },
    { t: "흩어져 있던 조각들이 한 판에 정리됐을 때", pole: "O" } ] },
  { axis: "A", q: "나에게 AI를 한마디로 정의하면?", opts: [
    { t: "같이 뚝딱거리는 공작실 동료", pole: "G" },
    { t: "그냥\u2026 요즘 다들 쓰는 그거", pole: "N" },
    { t: "나랑 출퇴근 시간이 똑같은 검수 인턴", pole: "V" } ] },
  { axis: "C", q: "회의에서 나의 자연스러운 포지션은?", opts: [
    { t: "내 아젠다 차례에 깊게 들어가는 스페셜리스트", pole: "D" },
    { t: "주로 듣는 편", pole: "N" },
    { t: "전체 안건 흐름을 챙기는 진행자 쪽", pole: "O" } ] },
];

const TYPES = {
  GSD: {
    emoji: "\uD83D\uDD27", name: "파이프라인 장인", slug: "pipeline-artisan", color: "#EA580C",
    catch: "손으로 두 번 한 일은, 세 번째엔 이미 자동화되어 있다",
    desc: "반복 작업을 보면 손보다 설계도가 먼저 움직인다. AI를 단발성 질문 상대가 아니라 파이프라인의 부품으로 쓰는 유형. 한번 몰입하면 바닥까지 파고들고, 정신 차려보면 주변에 본인만 쓸 줄 아는 자동화 도구가 쌓여 있다.",
    strengths: ["반복 업무를 통째로 자동화하는 설계력", "한 주제를 끝까지 파는 딥리서치", "한 번 만든 것을 재사용 가능한 형태로 남겨두는 습관"],
    goodAt: ["새 도구·프로세스를 0에서 1로 만드는 일", "구조가 복잡한 문제의 딥다이브 분석", "혼자 몰입해서 결과물로 승부하는 과제"],
    never: { what: "취합, 오케스트레이션, 조정, 보고.", why: "이 사람은 키보드와 친하고 전화기를 두려워한다. AI한테는 10번이고 한 단어씩 수정사항을 내놓으라고 하는 데 거리낌이 없지만, 업무관계자에게 리마인드 전화는 일주일째 못 걸고 있는 중." },
    partner: "VHO",
  },
  GSO: {
    emoji: "\uD83D\uDCE1", name: "자동화 설계자", slug: "automation-architect", color: "#0284C7",
    catch: "회사 전체가 자동화 백로그로 보인다",
    desc: "판 전체를 훑으며 어디를 자동화하면 레버리지가 제일 큰지 계산하는 유형. 개별 작업보다 작업들 사이의 연결을 본다. 이 유형이 지나간 자리엔 회의가 하나 줄고 봇이 하나 늘어 있다.",
    strengths: ["업무 전체 구조에서 병목을 찾아내는 눈", "레버리지 큰 지점부터 공략하는 우선순위 감각", "사람이 안 해도 되는 일을 실제로 없애버리는 실행력"],
    goodAt: ["프로세스 개선·업무 재설계", "여러 팀에 걸친 워크플로우 구축", "도입 효과가 큰 AI 활용처 발굴"],
    never: { what: "한 땀 한 땀 수작업 검수.", why: "시작한 지 10분 만에 \u201c근데 이걸 왜 사람이 하고 있죠?\u201d를 시전하다가, 정작 검수는 안 되어 있다." },
    partner: "VHD",
  },
  GHD: {
    emoji: "\uD83C\uDFA8", name: "프롬프트 아티스트", slug: "prompt-artist", color: "#DB2777",
    catch: "AI와의 대화창이 곧 작업실이다",
    desc: "AI를 도구라기보다 대화 상대로 쓰는 유형. 꼬리에 꼬리를 무는 프롬프트로 결과물을 조각하듯 다듬는다. 남들이 한 번 시키고 마는 일을 스무 번 주고받으며 완성도를 끌어올린다.",
    strengths: ["원하는 결과물이 나올 때까지 끌어내는 집요함", "AI의 애매한 출력에서 쓸 만한 걸 골라내는 감각", "결과물의 디테일과 완성도"],
    goodAt: ["톤과 뉘앙스가 중요한 콘텐츠 제작", "기획·카피·네이밍처럼 정답 없는 창작", "팀에 프롬프트 노하우 전수"],
    never: { what: "대량 반복 처리.", why: "100개 중 3번째 항목에 영혼을 갈아 넣다가 마감이 먼저 도착한다." },
    partner: "VSO",
  },
  GHO: {
    emoji: "\uD83D\uDE80", name: "AI 에반젤리스트", slug: "ai-evangelist", color: "#7C3AED",
    catch: "이거 보셨어요? 진짜 대박인데",
    desc: "새 기능이 나오면 제일 먼저 써보고, 제일 먼저 옆자리에 보여주는 유형. 혼자 잘 쓰는 것보다 다 같이 쓰게 만드는 데서 보람을 느낀다. 조직에 AI가 퍼지는 속도는 이 유형의 머릿수에 비례한다.",
    strengths: ["신기능 캐치업 속도", "어려운 걸 쉬운 말로 옮기는 전파력", "여기저기 연결하며 판을 키우는 네트워킹"],
    goodAt: ["사내 AI 확산·교육 프로그램", "데모와 쇼케이스", "부서 사이에 다리를 놓는 일"],
    never: { what: "혼자 조용히 오래 해야 하는 장기 과제.", why: "보여줄 사람이 없으면 서서히 시든다." },
    partner: "VSD",
  },
  VSD: {
    emoji: "\uD83D\uDD2C", name: "팩트체크 연구원", slug: "factcheck-researcher", color: "#059669",
    catch: "출처 주세요. 원문으로요.",
    desc: "AI의 그럴듯한 말을 절대 그냥 믿지 않는 유형. 교차검증 루틴을 세워두고, 한 자료를 잡으면 근거의 근거까지 파고든다. 이 유형이 \u201c확인했습니다\u201d라고 말하면 그건 정말로 확인된 것이다.",
    strengths: ["할루시네이션을 걸러내는 검증 체계", "원문·원출처까지 내려가는 집요함", "\u201c확인됨\u201d의 기준이 남들보다 두 단계 높음"],
    goodAt: ["대외 공개 자료의 최종 검증", "리서치 결과의 신뢰도 평가", "데이터 정합성 점검"],
    never: { what: "빠른 초안.", why: "\u201c아직 검증이 안 끝나서요\u201d가 무한 반복되는 동안 옆 팀은 이미 발표를 마쳤다." },
    partner: "GHO",
  },
  VSO: {
    emoji: "\uD83D\uDDA5\uFE0F", name: "대시보드 관제사", slug: "dashboard-controller", color: "#4F46E5",
    catch: "묻지 마세요, 현황판에 다 있습니다",
    desc: "지표를 세팅해두고 이상치가 뜨면 움직이는 관제탑 유형. 사람을 조르는 대신 시스템이 먼저 알려주게 만든다. 이 유형의 모니터에는 늘 뭔가가 실시간으로 흐르고 있다.",
    strengths: ["봐야 할 지표를 고르는 안목", "이상 징후의 조기 감지", "묻기 전에 보이게 만드는 가시화 능력"],
    goodAt: ["KPI·지표 체계 설계", "모니터링 대시보드 구축", "정기 리포트 자동화"],
    never: { what: "현황판 없이 감과 발로 뛰어야 하는 일.", why: "대시보드부터 만들다가 골든타임이 지나간다." },
    partner: "GHD",
  },
  VHD: {
    emoji: "\uD83E\uDDD0", name: "디테일 심문관", slug: "detail-interrogator", color: "#B45309",
    catch: "잠깐만요, 3페이지 각주가 좀 이상한데요",
    desc: "담당자를 앞에 두고 디테일을 캐물을 때 가장 빛나는 유형. 자료만 보는 게 아니라 만든 사람의 눈을 보며 확인한다. 회의실에서 이 유형의 옆자리는 상석보다 무섭다는 전설이 있다.",
    strengths: ["사람을 통해 진위를 확인하는 직관", "답변의 미세한 흔들림을 감지하는 촉", "끝까지 물어보는 용기"],
    goodAt: ["실사·인터뷰·검증 미팅", "중요 의사결정 전 최종 크로스체크", "리스크 심층 점검"],
    never: { what: "대충 넘어가야 굴러가는 일.", why: "이 유형의 사전에 \u2018대충\u2019이 없어서, 넘어가지지가 않는다." },
    partner: "GSO",
  },
  VHO: {
    emoji: "\uD83E\uDD85", name: "매의 눈 사령탑", slug: "keen-eye-commander", color: "#DC2626",
    catch: "어제는 20건이라더니, 오늘은 왜 16건이죠?",
    desc: "판 전체를 훑다가 어긋난 숫자, 오타, 어제와 달라진 말을 귀신같이 잡아내는 유형. AI가 뽑은 자료도 예외는 없다. 합계가 안 맞는 표, 지난주와 미묘하게 말이 달라진 보고는 이 유형의 레이더를 통과하지 못한다. 취합과 팔로업이 시작되면 이 유형에게서 도망칠 수 있는 담당자는 없다.",
    strengths: ["오타·계산실수·논리 비약을 잡아내는 매의 눈", "다자간 취합과 팔로업의 장악력", "치고 올라갈 타이밍을 아는 에스컬레이션 감각"],
    goodAt: ["여러 사람이 얽힌 판의 교통정리", "품질 게이트키핑·최종 컨펌", "마감 있는 일의 페이스메이커"],
    never: { what: "백지에서 시작하는 창작.", why: "잡아낼 대상이 없으면 세상 답답해한다." },
    partner: "GSD",
  },
  NNN: {
    emoji: "\uD83E\uDEE5", name: "그냥 쓰는 사람", slug: "perfectly-neutral", color: "#6B7280",
    catch: "AI요? 뭐, 남들 쓰는 만큼 써요",
    desc: "13문항 전부 가운데를 고른 당신. AI를 쓰는 \u2018나만의 쪼\u2019도, 루틴도, 철학도 딱히 없다. 그런데 놀랍게도 일은 된다. 유형 이론가들이 가장 곤란해하는 존재 \u2014 분류가 안 되기 때문이다.",
    strengths: ["어떤 유형 옆에 둬도 마찰이 없음", "도구가 바뀌어도 동요가 없음", "13문항을 전부 가운데로 찍는 흔들림 없는 일관성"],
    goodAt: ["어디에 배치해도 평균은 하는 일", "유형 강한 사람들 사이의 완충지대", "이 테스트의 설계 의도를 무력화하는 일"],
    never: { what: "없다.", why: "못 맡길 일이 없다는 것, 그게 이 유형의 가장 무서운 점이다." },
  },
};

const ORDER = ["GSD", "GSO", "GHD", "GHO", "VSD", "VSO", "VHD", "VHO"];

/* ------------------------------------------------------------------ */
/*  스타일 토큰                                                        */
/* ------------------------------------------------------------------ */

const T = {
  bg: "#F6F5F1",
  card: "#FFFFFF",
  ink: "#17181C",
  sub: "#5C5F66",
  line: "#E4E2DA",
  accent: "#2F45E0",
  mono: "'IBM Plex Mono', monospace",
  sans: "'IBM Plex Sans KR', -apple-system, sans-serif",
};

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes confetti { 0% { opacity: 0; transform: translateY(0) rotate(0deg); } 6% { opacity: 1; } 100% { opacity: 0; transform: translateY(105vh) rotate(660deg); } }
@keyframes popIn { from { opacity: 0; transform: scale(.5); } to { opacity: 1; transform: scale(1); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
`;

const monoLabel = (color = T.sub) => ({
  fontFamily: T.mono, fontSize: 11, letterSpacing: "0.12em",
  textTransform: "uppercase", color, fontWeight: 500,
});

/* ------------------------------------------------------------------ */
/*  공용 컴포넌트                                                      */
/* ------------------------------------------------------------------ */

function Shell({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.sans, color: T.ink, padding: "24px 16px 64px" }}>
      <style>{FONT_CSS}</style>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 14, padding: 24, animation: "rise .35s ease both", ...style }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, primary, style }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: T.sans, fontSize: 15, fontWeight: 500, cursor: "pointer",
        padding: "13px 20px", borderRadius: 10, width: "100%",
        border: primary ? "1px solid transparent" : `1px solid ${T.line}`,
        background: primary ? (hover ? "#2438C4" : T.accent) : hover ? "#F2F1EC" : T.card,
        color: primary ? "#fff" : T.ink,
        transition: "background .15s ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children, color }) {
  return <div style={{ ...monoLabel(color), marginBottom: 10 }}>{children}</div>;
}

/* 축 게이지: 좌우 라벨 + 기울기 바 */
function Gauge({ axis, counts, color }) {
  const L = AXES[axis].left, R = AXES[axis].right;
  const l = counts[L.key] || 0, r = counts[R.key] || 0;
  const lp = l + r === 0 ? 50 : Math.round((l / (l + r)) * 100);
  const dominantLeft = l >= r;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: dominantLeft ? 700 : 400, color: dominantLeft ? T.ink : T.sub }}>
          {L.label} <span style={{ fontFamily: T.mono, fontSize: 12 }}>{lp}%</span>
        </span>
        <span style={{ fontSize: 13, fontWeight: !dominantLeft ? 700 : 400, color: !dominantLeft ? T.ink : T.sub }}>
          <span style={{ fontFamily: T.mono, fontSize: 12 }}>{100 - lp}%</span> {R.label}
        </span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: "#EDEBE4", overflow: "hidden", display: "flex" }}>
        <div style={{ width: `${lp}%`, background: dominantLeft ? color : "#D6D3C9", transition: "width .5s ease" }} />
        <div style={{ flex: 1, background: !dominantLeft ? color : "transparent" }} />
      </div>
    </div>
  );
}

/* 유형 상세 (모델 카드) — counts 있으면 개인 결과, 없으면 열람 모드 */
function TypeCard({ code, counts }) {
  const t = TYPES[code];
  const axisLabels =
    code === "NNN"
      ? ["중립", "중립", "중립"]
      : code.split("").map((k, i) => {
          const ax = AXES[["A", "B", "C"][i]];
          return ax.left.key === k ? ax.left.label : ax.right.label;
        });

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      {/* 헤더 */}
      <div style={{ padding: "26px 24px 22px", borderBottom: `1px solid ${T.line}`, background: `linear-gradient(180deg, ${t.color}0D, transparent)` }}>
        <div style={{ ...monoLabel(t.color), marginBottom: 12 }}>type/{t.slug} · v1.0</div>
        <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 10 }}>{t.emoji}</div>
        <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 6px" }}>{t.name}</h2>
        <div style={{ fontSize: 13, color: T.sub, marginBottom: 12 }}>{axisLabels.join(" · ")}</div>
        <p style={{ fontSize: 15, fontWeight: 500, color: t.color, margin: 0 }}>\u201c{t.catch}\u201d</p>
      </div>

      <div style={{ padding: 24 }}>
        {counts && (
          <div style={{ marginBottom: 26 }}>
            <SectionLabel>Parameters</SectionLabel>
            {["A", "B", "C"].map((ax) => <Gauge key={ax} axis={ax} counts={counts} color={t.color} />)}
          </div>
        )}

        <p style={{ fontSize: 15, lineHeight: 1.75, margin: "0 0 26px" }}>{t.desc}</p>

        <div style={{ marginBottom: 24 }}>
          <SectionLabel>Strengths</SectionLabel>
          {t.strengths.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.6, marginBottom: 7 }}>
              <span style={{ color: t.color, fontFamily: T.mono }}>+</span><span>{s}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}>
          <SectionLabel>Deploy on</SectionLabel>
          {t.goodAt.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.6, marginBottom: 7 }}>
              <span style={{ color: T.sub, fontFamily: T.mono }}>{">"}</span><span>{s}</span>
            </div>
          ))}
        </div>

        <div style={{ border: `1px solid ${t.color}55`, background: `${t.color}0A`, borderRadius: 10, padding: "16px 18px" }}>
          <SectionLabel color={t.color}>\u26A0\uFE0E Do not assign</SectionLabel>
          <p style={{ fontSize: 14.5, lineHeight: 1.7, margin: 0 }}>
            <strong style={{ fontWeight: 700 }}>{t.never.what}</strong> {t.never.why}
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  메인 앱                                                            */
/* ------------------------------------------------------------------ */

export default function App() {
  const [screen, setScreen] = useState("intro"); // intro | quiz | result | browse
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [picked, setPicked] = useState(null);
  const [browseCode, setBrowseCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [particles] = useState(() => {
    const colors = ORDER.map((c) => TYPES[c].color);
    return Array.from({ length: 54 }, (_, i) => ({
      left: Math.random() * 100,
      size: 7 + Math.random() * 7,
      color: colors[i % colors.length],
      dur: 2.2 + Math.random() * 1.6,
      delay: Math.random() * 0.9,
    }));
  });

  const counts = answers.reduce((m, a) => ({ ...m, [a.pole]: (m[a.pole] || 0) + a.w }), {});
  const allNeutral = answers.length === QUESTIONS.length && answers.every((a) => a.pole === "N");
  const resultCode = allNeutral
    ? "NNN"
    : ((counts.G || 0) >= (counts.V || 0) ? "G" : "V") +
      ((counts.S || 0) >= (counts.H || 0) ? "S" : "H") +
      ((counts.D || 0) >= (counts.O || 0) ? "D" : "O");

  const answer = (pole, w, i) => {
    if (picked !== null) return;
    setPicked(i);
    setTimeout(() => {
      const next = [...answers, { pole, w }];
      setAnswers(next);
      setPicked(null);
      if (idx + 1 < QUESTIONS.length) setIdx(idx + 1);
      else setScreen("result");
    }, 220);
  };

  const goBack = () => {
    if (idx === 0) { setScreen("intro"); return; }
    setAnswers(answers.slice(0, -1));
    setIdx(idx - 1);
  };

  const restart = () => { setAnswers([]); setIdx(0); setScreen("intro"); setCopied(false); };

  const copyResult = async () => {
    const t = TYPES[resultCode];
    const text = `${t.emoji} 나의 AI 업무 유형: ${t.name}\n\u201c${t.catch}\u201d\n\nAI, 어떻게 쓰고 계세요? — 13문항 테스트`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) { /* clipboard 미지원 환경 */ }
  };

  /* ---------------- intro ---------------- */
  if (screen === "intro") {
    return (
      <Shell>
        <Card style={{ padding: "40px 28px", textAlign: "center" }}>
          <div style={{ ...monoLabel(T.accent), marginBottom: 20 }}>work-style diagnostic · v1.0</div>
          <h1 style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.3, margin: "0 0 14px" }}>
            AI, 어떻게<br />쓰고 계세요?
          </h1>
          <p style={{ fontSize: 15, color: T.sub, lineHeight: 1.7, margin: "0 0 28px" }}>
            같은 AI를 써도 쓰는 방식은 전혀 다릅니다.<br />
            13개 문항으로 나의 AI 업무 유형을 알아보세요.
          </p>
          <div style={{ fontSize: 24, letterSpacing: 6, marginBottom: 30 }}>
            {ORDER.map((c) => TYPES[c].emoji).join("")}
          </div>
          <Btn primary onClick={() => setScreen("quiz")}>테스트 시작하기</Btn>
          <button
            onClick={() => { setBrowseCode(null); setScreen("browse"); }}
            style={{ marginTop: 14, background: "none", border: "none", cursor: "pointer", fontFamily: T.sans, fontSize: 13.5, color: T.sub, textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            8가지 유형 먼저 구경하기
          </button>
        </Card>
        <p style={{ textAlign: "center", fontSize: 12, color: "#9B9EA3", marginTop: 16 }}>
          약 3분 소요 · 결과는 저장되지 않습니다
        </p>
      </Shell>
    );
  }

  /* ---------------- quiz ---------------- */
  if (screen === "quiz") {
    const q = QUESTIONS[idx];
    const progress = ((idx) / QUESTIONS.length) * 100;
    return (
      <Shell>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.mono, fontSize: 13, color: T.sub, padding: 6 }}>
            \u2190 이전
          </button>
          <span style={{ fontFamily: T.mono, fontSize: 13, color: T.sub }}>
            {String(idx + 1).padStart(2, "0")} / {QUESTIONS.length}
          </span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: "#EAE8E0", marginBottom: 22, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: T.accent, transition: "width .3s ease" }} />
        </div>
        <Card key={idx}>
          <h2 style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.55, margin: "0 0 22px" }}>{q.q}</h2>
          {q.opts.map((o, i) => (
            <button
              key={i}
              onClick={() => answer(o.pole, q.w ?? 1, i)}
              style={{
                display: "block", width: "100%", textAlign: "left", cursor: "pointer",
                fontFamily: T.sans, fontSize: 15, lineHeight: 1.55, color: T.ink,
                padding: "16px 18px", marginBottom: 12, borderRadius: 10,
                border: picked === i ? `1.5px solid ${T.accent}` : `1px solid ${T.line}`,
                background: picked === i ? "#EEF0FD" : "#FCFCFA",
                transition: "all .15s ease",
              }}
            >
              {o.t}
            </button>
          ))}
        </Card>
      </Shell>
    );
  }

  /* ---------------- result ---------------- */
  if (screen === "result") {
    const hidden = resultCode === "NNN";
    return (
      <Shell>
        {hidden && (
          <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 50 }}>
            {particles.map((p, i) => (
              <span
                key={i}
                style={{
                  position: "absolute", top: "-4vh", left: `${p.left}%`,
                  width: p.size, height: p.size * 0.45, background: p.color, borderRadius: 2,
                  opacity: 0, animation: `confetti ${p.dur}s ease-in ${p.delay}s forwards`,
                }}
              />
            ))}
          </div>
        )}
        {hidden ? (
          <div style={{ textAlign: "center", marginBottom: 16, animation: "popIn .5s cubic-bezier(.2,1.4,.4,1) .15s both" }}>
            <span style={{ display: "inline-block", fontFamily: T.mono, fontSize: 12, letterSpacing: "0.14em", background: T.ink, color: "#fff", padding: "8px 16px", borderRadius: 999 }}>
              \uD83C\uDF89 HIDDEN CARD \uBC1C\uACAC!
            </span>
          </div>
        ) : (
          <div style={{ ...monoLabel(), textAlign: "center", marginBottom: 16 }}>진단 완료 — 당신의 유형은</div>
        )}
        <TypeCard code={resultCode} counts={counts} />
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <Btn primary onClick={copyResult}>{copied ? "복사됨 \u2713" : "결과 복사하기"}</Btn>
          <Btn onClick={() => { setBrowseCode(null); setScreen("browse"); }}>다른 유형 보기</Btn>
        </div>
        <Btn onClick={restart} style={{ marginTop: 10 }}>다시 하기</Btn>
        <p style={{ textAlign: "center", fontSize: 12, color: "#9B9EA3", marginTop: 20, lineHeight: 1.6 }}>
          본 테스트는 재미로 만들어졌습니다.<br />다만 업무 배분에 참고하셔도 무방합니다.
        </p>
      </Shell>
    );
  }

  /* ---------------- browse ---------------- */
  if (screen === "browse") {
    if (browseCode) {
      return (
        <Shell>
          <button
            onClick={() => setBrowseCode(null)}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.mono, fontSize: 13, color: T.sub, padding: "6px 0", marginBottom: 12 }}
          >
            \u2190 전체 유형
          </button>
          <TypeCard code={browseCode} />
          <Btn onClick={() => (answers.length === QUESTIONS.length ? setScreen("result") : restart())} style={{ marginTop: 16 }}>
            {answers.length === QUESTIONS.length ? "내 결과로 돌아가기" : "테스트 하러 가기"}
          </Btn>
        </Shell>
      );
    }
    return (
      <Shell>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ ...monoLabel(T.accent), marginBottom: 8 }}>type registry</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>8가지 AI 업무 유형</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {ORDER.map((c) => {
            const t = TYPES[c];
            return (
              <div
                key={c}
                onClick={() => setBrowseCode(c)}
                style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 12, padding: "18px 14px", cursor: "pointer", textAlign: "center" }}
              >
                <div style={{ fontSize: 30, marginBottom: 8 }}>{t.emoji}</div>
                <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.sub, letterSpacing: "0.06em" }}>{t.slug}</div>
              </div>
            );
          })}
        </div>
        <Btn onClick={() => (answers.length === QUESTIONS.length ? setScreen("result") : setScreen("intro"))} style={{ marginTop: 18 }}>
          {answers.length === QUESTIONS.length ? "내 결과로 돌아가기" : "\u2190 처음으로"}
        </Btn>
      </Shell>
    );
  }

  return null;
}
