import type { CategoryKey, ConfigOption, SelectionState, WearCategory } from "./types";

export const defaultSelections: Record<WearCategory, Record<string, string>> = {
  원단: { default: "fabric-havana" },
  재킷: { "여밈 방식": "closure-2b", 색상: "jacket-navy-plain", 패턴: "jacket-navy-pin" },
  바지: { 실루엣: "trousers-flat" },
  조끼: { 조끼: "" },
  코트: { 코트: "" },
  셔츠: { 셔츠: "shirt-white" },
  구두: { 구두: "shoes-oxford" },
};

export const tabs: CategoryKey[] = ["사진 업로드", "원단", "재킷", "바지", "조끼", "코트", "셔츠", "구두"];
export const categoryOrder = tabs.filter((t) => t !== "사진 업로드") as WearCategory[];

export const catalog: Record<WearCategory, ConfigOption[]> = {
  원단: [
    { id: "fabric-samsung-ipp160", title: "삼성 1PP 160's", subtitle: "Samsung", image: "" },
    { id: "fabric-loro-150", title: "로로 피아나 150's", subtitle: "Loro Piana", image: "" },
    { id: "fabric-zegna", title: "제냐", subtitle: "Ermenegildo Zegna", image: "" },
    { id: "fabric-piacenza", title: "피아첸짜", subtitle: "Piacenza", image: "" },
    { id: "fabric-drago160", title: "드라고 160's", subtitle: "DRAGO", image: "" },
    { id: "fabric-samsung-cheilain", title: "삼성 CHEILAIN", subtitle: "Samsung", image: "" },
    { id: "fabric-delfino", title: "델피노", subtitle: "DELFINO", image: "" },
    { id: "fabric-drago130", title: "드라고 130's", subtitle: "DRAGO", image: "" },
    { id: "fabric-samsung-vip", title: "삼성 VIP", subtitle: "Samsung", image: "" },
    { id: "fabric-canonico", title: "카노니코", subtitle: "Canonico", image: "" },
    { id: "fabric-etomas", title: "이토마스", subtitle: "E.Tomas", image: "" },
    { id: "fabric-samsung-tim", title: "삼성 템테이션", subtitle: "Samsung", image: "" },
    { id: "fabric-samsung-prestige", title: "삼성 프레스티지", subtitle: "Samsung", image: "" },
    { id: "fabric-marche", title: "마르케", subtitle: "Marche", image: "" },
    { id: "fabric-bonavido", title: "보나비도", subtitle: "Bonavido", image: "" },
    { id: "fabric-jijamji", title: "지잠지", subtitle: "Local Select", image: "" },
  ],
  재킷: [
    { id: "closure-1b", group: "여밈 방식", title: "1 버튼", subtitle: "블랙 타이 착장에 이상적인, 테이퍼드한 우아한 실루엣을 선사합니다.", image: "" },
    { id: "closure-2b", group: "여밈 방식", title: "2 버튼", subtitle: "가장 활용도 높은 모던 스탠다드 재킷입니다.", image: "" },
    { id: "closure-2_5b", group: "여밈 방식", title: "2.5 버튼", subtitle: "롤 라인 안쪽의 숨은 3번째 단추로 부드러운 롤을 연출할 수 있습니다.", image: "" },
    { id: "closure-6db", group: "여밈 방식", title: "6 버튼 더블 브레스티드", subtitle: "모던하면서도 클래식한 정통 더블 실루엣을 선사합니다.", image: "" },
    {
      id: "closure-6db-low",
      group: "여밈 방식",
      title: "6 버튼 로우 더블 브레스티드",
      subtitle: "낮은 단추 위치로 대담하고 스포티한 더블 실루엣을 선사합니다.",
      image: "",
    },
    { id: "jacket-black", group: "색상", title: "블랙", subtitle: "가장 포멀한 블랙 원단으로, 이브닝 웨어와 격식 있는 자리에도 적합합니다.", image: "" },
    {
      id: "jacket-charcoal",
      group: "색상",
      title: "차콜",
      subtitle: "은은한 트윌 조직의 딥 차콜 색상으로, 광택을 최소화해 포멀·비즈니스 상황 모두에 어울립니다.",
      image: "",
    },
    {
      id: "jacket-navy-plain",
      group: "색상",
      title: "네이비",
      subtitle: "한국 남성 수트의 표준이라 할 수 있는 네이비로, 첫 맞춤과 데일리 수트에 모두 적합합니다.",
      image: "",
    },
    {
      id: "jacket-midgrey-plain",
      group: "색상",
      title: "미드 그레이",
      subtitle: "너무 무겁지도, 너무 밝지도 않은 중간 톤 그레이로, 사계절 비즈니스 수트로 활용도가 높습니다.",
      image: "",
    },
    {
      id: "jacket-lightgrey-plain",
      group: "색상",
      title: "라이트 그레이",
      subtitle: "가벼운 톤의 라이트 그레이로, 봄·여름 시즌이나 세미 포멀 연출에 잘 어울립니다.",
      image: "",
    },
    {
      id: "jacket-brown-plain",
      group: "색상",
      title: "다크 브라운",
      subtitle: "차분한 다크 브라운 톤으로, 클래식하면서도 개성을 드러내고 싶은 분께 추천드립니다.",
      image: "",
    },
    {
      id: "jacket-navy-pin",
      group: "패턴",
      title: "핀스트라이프",
      subtitle: "가느다란 스트라이프가 더해진 원단으로, 클래식 비즈니스 수트의 정석 같은 인상을 줍니다.",
      image: "",
    },
    {
      id: "jacket-navy-chalk",
      group: "패턴",
      title: "초크스트라이프",
      subtitle: "초크로 그린 듯한 굵은 스트라이프가 들어간 원단으로, 존재감 있는 비즈니스·포멀 룩을 완성합니다.",
      image: "",
    },
    {
      id: "jacket-grey-window",
      group: "패턴",
      title: "윈도우페인",
      subtitle: "윈도우페인 체크가 들어간 원단으로, 격식은 유지하면서도 한층 캐주얼한 분위기를 연출합니다.",
      image: "",
    },
    {
      id: "jacket-glen-check",
      group: "패턴",
      title: "글렌 체크",
      subtitle: "잔잔한 격자가 겹쳐진 클래식 글렌 체크로, 영국식 테일러링 무드를 좋아하시는 분께 어울립니다.",
      image: "",
    },
    {
      id: "jacket-micro-check",
      group: "패턴",
      title: "마이크로 체크",
      subtitle: "멀리서 보면 솔리드처럼 보이는 아주 작은 체크 패턴으로, 차분하지만 지루하지 않은 표면감을 제공합니다.",
      image: "",
    },
  ],
  바지: [
    { id: "trousers-flat", group: "실루엣", title: "노턱 (플랫 프론트)", subtitle: "허리부터 깔끔하게 떨어지는 기본 수트 팬츠 실루엣.", image: "" },
    { id: "trousers-pleat", group: "실루엣", title: "원턱 (싱글 플리츠)", subtitle: "허리 앞쪽에 한 줄 턱이 들어가 여유롭고 편안한 실루엣.", image: "" },
    {
      id: "trousers-double",
      group: "실루엣",
      title: "투턱 (더블 플리츠)",
      subtitle: "두 줄 턱으로 허벅지에 여유를 주어 클래식한 느낌을 강조합니다.",
      image: "",
    },
    { id: "trousers-hem-plain", group: "밑단 마감", title: "기본 마감", subtitle: "턴업 없이 떨어지는 가장 정석적인 밑단 마감.", image: "" },
    { id: "trousers-cuff", group: "밑단 마감", title: "턴업 4cm", subtitle: "4cm 턴업으로 적당히 클래식한 밸런스를 연출합니다.", image: "" },
    { id: "trousers-cuff-5", group: "밑단 마감", title: "턴업 5cm", subtitle: "5cm 턴업으로 존재감 있고 클래식한 실루엣을 완성합니다.", image: "" },
  ],
  조끼: [
    { id: "waistcoat-single", group: "조끼", title: "싱글 브레스티드 조끼", subtitle: "가장 클래식하고 활용도 높은 기본 조끼 스타일.", image: "" },
    { id: "waistcoat-double", group: "조끼", title: "더블 브레스티드 조끼", subtitle: "더블 여밈으로 포멀하고 존재감 있는 실루엣.", image: "" },
    { id: "waistcoat-u", group: "조끼", title: "U넥 조끼", subtitle: "넓게 파인 U넥 라인으로 타이와 셔츠를 강조합니다.", image: "" },
    { id: "waistcoat-lapel", group: "조끼", title: "라펠 조끼", subtitle: "조끼에도 라펠이 들어간, 한층 드레시한 스타일.", image: "" },
  ],
  코트: [
    { id: "coat-chesterfield", group: "코트", title: "체스터필드 코트", subtitle: "차콜 컬러의 클래식 싱글 코트로 수트 위에 가장 무난한 선택.", image: "" },
    { id: "coat-polo", group: "코트", title: "폴로 코트", subtitle: "카멜 컬러의 벨티드 더블 코트로, 캐시미어 느낌의 포근한 무드.", image: "" },
    { id: "coat-balmacaan", group: "코트", title: "발마칸 코트", subtitle: "래글런 소매와 히든 버튼으로 여유로운 A라인 실루엣.", image: "" },
    { id: "coat-overcoat-db", group: "코트", title: "더블 오버코트", subtitle: "더블 브레스티드 여밈의 포멀한 겨울용 코트.", image: "" },
    { id: "coat-car", group: "코트", title: "카 코트", subtitle: "무릎 위 길이의 경쾌한 코트로, 캐주얼·비즈니스 캐주얼에 적합합니다.", image: "" },
  ],
  셔츠: [
    {
      id: "shirt-white",
      group: "셔츠",
      title: "화이트 팝린 셔츠",
      subtitle: "가장 기본이 되는 드레스 셔츠로, 어떤 수트와도 자연스럽게 어울립니다.",
      image: "",
    },
    { id: "shirt-blue", group: "셔츠", title: "라이트 블루 옥스퍼드 셔츠", subtitle: "조금 더 부드럽고 캐주얼한 인상의 기본 셔츠.", image: "" },
    { id: "shirt-stripe", group: "셔츠", title: "블루 스트라이프 셔츠", subtitle: "잔 스트라이프로 비즈니스 수트에 리듬감을 더해줍니다.", image: "" },
    { id: "shirt-wide", group: "셔츠", title: "와이드 칼라 셔츠", subtitle: "넓게 벌어진 칼라로 넥타이를 우아하게 받쳐줍니다.", image: "" },
    { id: "shirt-band", group: "셔츠", title: "밴드 칼라 셔츠", subtitle: "노타이 스타일에 어울리는 미니멀한 셔츠.", image: "" },
  ],
  구두: [
    { id: "shoes-oxford", group: "구두", title: "블랙 옥스퍼드 (스트레이트 팁)", subtitle: "가장 포멀한 비즈니스·포멀용 드레스 슈즈.", image: "" },
    { id: "shoes-loafer", group: "구두", title: "브라운 로퍼", subtitle: "수트와 캐주얼 모두에 활용 가능한 기본 로퍼.", image: "" },
    { id: "shoes-oxford-brown", group: "구두", title: "다크 브라운 옥스퍼드", subtitle: "블랙보다 부드러운 인상의 클래식 드레스 슈즈.", image: "" },
    { id: "shoes-monk", group: "구두", title: "브라운 더블 몽크 스트랩", subtitle: "버클 디테일로 개성을 살리는 세미 포멀 슈즈.", image: "" },
    { id: "shoes-suede-loafer", group: "구두", title: "다크 브라운 스웨이드 로퍼", subtitle: "위켄드 수트·캐주얼에 어울리는 부드러운 질감의 로퍼.", image: "" },
  ],
};

export const findOptionById = (cat: WearCategory, id: string) => catalog[cat].find((opt) => opt.id === id);

export const buildInitialSelections = (): SelectionState => {
  const state = {} as SelectionState;
  (Object.keys(catalog) as WearCategory[]).forEach((cat) => {
    const groupMap: Record<string, ConfigOption> = {};
    const defaults = defaultSelections[cat] || {};
    const allGroups = new Set<string>();

    catalog[cat].forEach((opt) => {
      allGroups.add(opt.group ?? "default");
    });

    allGroups.forEach((groupKey) => {
      const desiredId = defaults[groupKey];
      if (!desiredId) return;
      const fallback = catalog[cat].find((opt) => (opt.group ?? "default") === groupKey);
      const option = findOptionById(cat, desiredId) || fallback;
      if (option) {
        groupMap[groupKey] = option;
      }
    });

    state[cat] = groupMap;
  });
  return state;
};
