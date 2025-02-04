const personalColors = [
  {
    id: 1,
    name: "봄 라이트",
    path: "/spring-light",
    colorClass: "spring-light",
    characterUrl: "/spring-light.png",
    description: `맑고 투명한 피부 톤을 가진 라이트톤! 밝은 카라멜 컬러의 눈동자가 많아요. 전반적으로 피부와 눈,
      모발의 색이 밝아 부드러운 이미지가 돋보입니다. 따뜻하고 파스텔톤의 컬러가 잘 어울려요. 
      메이크업은 과하지 않게 맑고 산뜻하게 연출하는 것이 좋아요. 살구, 연한 코랄, 크리미한 아이보리 컬러를 활용해보세요.`,
  },
  {
    id: 2,
    name: "봄 브라이트",
    path: "/spring-bright",
    colorClass: "spring-bright",
    characterUrl: "/spring-bright.png",
    description: `화사하고 생기 있는 피부 톤을 가진 브라이트톤!
피부가 맑고 투명하며, 눈동자 색이 밝고 반짝이는 느낌이에요.
선명한 색상을 사용하면 얼굴이 더 화사해 보입니다.
명도가 높은 비비드한 컬러와 잘 어울려요.
메이크업은 자연스러운 글로우 느낌을 살리는 것이 좋아요.
레몬 옐로우, 맑은 민트, 청량한 코랄 컬러가 찰떡궁합!`,
  },
  {
    id: 3,
    name: "봄 비비드",
    path: "/spring-vivid",
    colorClass: "spring-vivid",
    characterUrl: "/spring-vivid.png",
    description: `쨍한 원색이 잘 어울리는 생기 넘치는 타입!
전반적으로 따뜻한 느낌의 피부에 또렷한 눈동자를 가지고 있어요.
고채도의 밝고 명확한 색상이 얼굴을 화사하게 만들어 줍니다.
선명한 컬러의 의상이나 액세서리를 활용하면 더 생기 있어 보여요.
메이크업은 웜톤 컬러를 활용하되 채도가 높은 색을 선택하는 것이 좋아요.
체리 레드, 쨍한 오렌지, 라즈베리 핑크가 최고의 선택!`,
  },
  {
    id: 4,
    name: "여름 라이트",
    path: "/summer-light",
    colorClass: "summer-light",
    characterUrl: "/summer-light.png",
    description: `맑고 차분한 분위기를 가진 소프트한 타입!
피부 톤이 비교적 밝고, 눈동자가 투명한 느낌을 줍니다.
전체적으로 부드럽고 우아한 이미지가 돋보여요.
차가운 느낌의 파스텔톤과 잘 어울려요.
메이크업은 너무 강하지 않게 부드러운 색감을 선택하는 것이 중요합니다.
라벤더, 스카이 블루, 연한 베이비 핑크 컬러가 찰떡!`,
  },
  {
    id: 5,
    name: "여름 브라이트",
    path: "/summer-bright",
    colorClass: "summer-bright",
    characterUrl: "/summer-bright.png",
    description: `맑고 청량한 색감이 잘 어울리는 타입!
피부 톤이 하얗고 깨끗한 느낌을 주며, 푸른 기운이 도는 경우가 많아요.
눈동자는 밝은 브라운이나 다크 그레이 계열로 투명한 느낌을 줍니다.
채도가 높은 시원한 컬러를 활용하면 얼굴이 더 환해 보여요.
메이크업은 푸른 기운이 도는 핑크 계열이 가장 잘 어울려요.
푸시아 핑크, 시원한 블루, 맑은 라일락 컬러를 추천!`,
  },
  {
    id: 6,
    name: "여름 뮤트",
    path: "/summer-mute",
    colorClass: "summer-mute",
    characterUrl: "/summer-mute.png",
    description: `장밋빛 피부를 가지고 있는 뮤트톤!
중간 밝기에서 어두운색의 스킨톤에 블랙이나 다크 브라운 계열의 눈동자 색을 가지고 있어 대비감은 약합니다.
그레이가 잘 어울리는 타입으로 스타일링도 메이크업도 전체적으로 은은하게 연출하면 좋아요!
말린 장미, 팥죽색 같은 채도가 낮은 부드러운 색을 선택하세요.`,
  },
  {
    id: 7,
    name: "가을 뮤트",
    path: "/autumn-mute",
    colorClass: "autumn-mute",
    characterUrl: "/autumn-mute.png",
    description: `고급스럽고 차분한 분위기를 가진 소프트한 타입!
노란 기가 도는 피부에 따뜻한 갈색 계열의 눈동자가 많아요.
채도가 낮고 부드러운 톤의 컬러가 피부 톤과 조화를 이룹니다.
너무 강한 색보다는 은은하고 따뜻한 색이 잘 어울려요.
메이크업은 브라운 계열의 음영을 활용해 부드럽게 연출하는 것이 좋아요.
말린 장미, 모카 브라운, 카멜 베이지 컬러를 추천!`,
  },
  {
    id: 8,
    name: "가을 스트롱",
    path: "/autumn-strong",
    colorClass: "autumn-strong",
    characterUrl: "/autumn-strong.png",
    description: `깊고 풍부한 색감이 잘 어울리는 강렬한 타입!
대체로 피부가 따뜻한 느낌이며, 눈동자가 진하고 깊은 색을 띕니다.
고채도의 따뜻한 컬러가 얼굴을 더 또렷하고 생기 있어 보이게 해줘요.
골드 계열의 액세서리나 깊은 컬러의 의상이 잘 어울립니다.
메이크업은 깊이 있는 컬러를 활용해 우아하게 연출하는 것이 좋아요.
테라코타, 브릭 레드, 카키 브라운이 찰떡궁합!`,
  },
  {
    id: 9,
    name: "가을 다크",
    path: "/autumn-dark",
    colorClass: "autumn-dark",
    characterUrl: "/autumn-dark.png",
    description: `진하고 무게감 있는 색상이 어울리는 타입!
대체로 피부가 따뜻한 톤이며, 눈동자가 어두운 브라운이나 블랙 계열이에요.
채도가 높고 깊은 색감이 얼굴을 돋보이게 합니다.
짙고 깊은 컬러의 의상과 메이크업이 고급스러운 분위기를 연출해요.
메이크업은 음영을 강조해 깊이 있는 느낌을 주는 것이 좋아요.
다크 초콜릿, 올리브 브라운, 버건디 컬러를 활용해보세요.`,
  },
  {
    id: 10,
    name: "겨울 비비드",
    path: "/winter-vivid",
    colorClass: "winter-vivid",
    characterUrl: "/winter-vivid.png",
    description: `선명하고 강렬한 원색이 잘 어울리는 타입!
대체로 피부가 희거나 쿨한 느낌을 가지고 있으며, 눈동자는 검은색에 가까워요.
채도가 높고 대비가 강한 색상이 얼굴을 더 화사하게 만들어 줍니다.
블랙 & 화이트 스타일링이 잘 어울려요.
메이크업은 쿨톤 레드나 선명한 핑크 컬러를 활용하면 좋아요.
체리 레드, 코발트 블루, 푸시아 핑크가 최고의 선택!`,
  },
  {
    id: 11,
    name: "겨울 스트롱",
    path: "/winter-strong",
    colorClass: "winter-strong",
    characterUrl: "/winter-strong.png",
    description: `차가운 톤의 강렬한 색이 어울리는 타입!
피부 톤이 쿨한 편이며, 눈동자는 깊고 진한 다크 브라운이나 블랙이에요.
짙고 깊은 컬러의 스타일링이 세련된 분위기를 연출합니다.
흰색과 검정의 강한 대비가 조화를 이루어요.
메이크업은 대비감을 살리는 것이 포인트!
다크 네이비, 차콜 그레이, 푸른 기운이 도는 버건디 컬러 추천!`,
  },
  {
    id: 12,
    name: "겨울 다크",
    path: "/winter-dark",
    colorClass: "winter-dark",
    characterUrl: "/winter-dark.png",
    description: `강렬하고 시크한 분위기를 가진 타입!
피부가 밝거나 차가운 느낌이며, 눈동자는 블랙이나 딥 브라운입니다.
고채도의 어두운 색상이 피부를 맑고 깨끗하게 보이게 합니다.
블랙 & 네이비 계열의 컬러가 가장 잘 어울려요.
메이크업은 쿨톤의 짙은 색상을 활용해 세련되게 연출하는 것이 좋아요.
다크 퍼플, 블랙, 시크한 스틸 블루 컬러를 추천!`,
  },
];

export default personalColors;
