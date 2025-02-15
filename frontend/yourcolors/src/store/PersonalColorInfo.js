//단순한 정적 데이터 객체 (Zustand 로 관리하는 객체 아님)
const personalColorInfo = {
  1: {
    name: "🌸 봄 웜 라이트 ☀️",
    path: "/spring-light",
    colorClass: "spring-light",
    characterUrl: "/character/spring-light.png", // 진단 결과에 나오는 캐릭터이미지
    description: `🔹 화사하고 부드러운 색감이 찰떡!
🔹 피부가 맑고 환한 느낌, 복숭아빛이 감돌아요 🍑
🔹 따뜻한 파스텔 컬러와 연한 색상이 잘 어울려요! 💛
🔹 부드럽고 사랑스러운 분위기를 강조해줘요 ✨
🔹 가벼운 컬러로 생기 있고 화사한 이미지를 연출! 💖`,
bestColors: ["#FFB6C1", "#FFD700", "#FFA07A", "#FFE4B5", "#FFDAB9"],
    subColors: ["#E6E6FA", "#D8BFD8", "#FFDEAD", "#F5DEB3", "#FAEBD7"],
    worstColors: ["#8B4513", "#556B2F", "#2F4F4F", "#800000", "#808000"],
  },
  2: {
    name: "🌼 봄 웜 비비드 🌟",
    path: "/spring-vivid",
    colorClass: "spring-vivid",
    characterUrl: "character/spring-vivid.png",
    description: `🔹 선명하고 생기 넘치는 컬러가 찰떡!
🔹 피부가 따뜻하고 밝은 느낌, 윤기가 있어 보여요 ☀️
🔹 원색에 가까운 맑고 쨍한 컬러가 얼굴을 돋보이게 해줘요! 🎨
🔹 생동감 있는 컬러로 활기찬 이미지를 연출! 💃
🔹 밝고 화려한 색상이 최강 조합! ✨`,
bestColors: ["#FF6347", "#FF4500", "#FF8C00", "#FFD700", "#FF69B4"],
    subColors: ["#ADFF2F", "#32CD32", "#40E0D0", "#4682B4", "#9932CC"],
    worstColors: ["#A52A2A", "#6B8E23", "#708090", "#483D8B", "#2F4F4F"],
  },
  3: {
    name: "🌞 봄 웜 브라이트 🔆",
    path: "/spring-bright",
    colorClass: "spring-bright",
    characterUrl: "character/spring-bright.png",
    description: `🔹 맑고 밝은 컬러가 얼굴을 환하게!
🔹 피부에 생기를 더해주는 따뜻한 느낌 🌷
🔹 비비드 컬러보다는 살짝 연한 생동감 있는 색상이 좋아요! 💕
🔹 귀엽고 발랄한 분위기를 연출해줘요 ✨
🔹 화사하면서도 부담스럽지 않은 컬러가 찰떡! 🎀`,
bestColors: ["#FFA500", "#FFD700", "#FFFF00", "#FF69B4", "#ADFF2F"],
    subColors: ["#87CEEB", "#00FA9A", "#48D1CC", "#BA55D3", "#FF1493"],
    worstColors: ["#8B0000", "#556B2F", "#800000", "#2F4F4F", "#696969"],
  },
  4: {
    name: "❄️ 여름 쿨 라이트 🌿",
    path: "/summer-light",
    colorClass: "summer-light",
    characterUrl: "character/summer-light.png",
    description: `🔹 부드럽고 우아한 색감이 찰떡!
🔹 피부는 뽀얀 느낌, 핑크빛이 살짝 돌아요 🌸
🔹 파스텔톤과 은은한 컬러가 얼굴을 맑게 💕
🔹 자연스럽고 청순한 느낌을 강조해줘요! ✨
🔹 화사하면서도 부드러운 이미지를 만들어주는 색상이 Good! 💖`,
bestColors: ["#B0E0E6", "#AFEEEE", "#ADD8E6", "#E6E6FA", "#FFC0CB"],
    subColors: ["#DDA0DD", "#DB7093", "#87CEFA", "#98FB98", "#F0E68C"],
    worstColors: ["#8B0000", "#A52A2A", "#556B2F", "#2F4F4F", "#696969"],
  },
  5: {
    name: "💙 여름 쿨 브라이트 💎",
    path: "/summer-bright",
    colorClass: "summer-bright",
    characterUrl: "character/summer-bright.png",
    description: `🔹 선명하면서도 청량한 색감이 찰떡!
🔹 피부는 투명하고 맑은 느낌, 푸른빛이 감돌아요 💙
🔹 시원하고 깨끗한 컬러가 얼굴을 환하게! ✨
🔹 화려하지만 차분한 분위기를 연출해줘요 🌟
🔹 쿨톤 중에서도 밝고 생동감 있는 색상이 찰떡! 🎶`,
bestColors: ["#00CED1", "#4682B4", "#4169E1", "#C71585", "#FF69B4"],
    subColors: ["#00BFFF", "#32CD32", "#FFD700", "#BA55D3", "#FFA07A"],
    worstColors: ["#8B0000", "#8B4513", "#556B2F", "#2F4F4F", "#696969"],
  },
  6: {
    name: "☁️ 여름 쿨 뮤트 💜",
    path: "/summer-mute",
    colorClass: "summer-mute",
    characterUrl: "character/summer-mute.png",
    description: `🔹 차분하고 우아한 색감이 찰떡!
🔹 피부는 뽀얗고 은은한 느낌, 자연스러운 색감 💕
🔹 너무 강한 색보다 살짝 흐린 듯한 컬러가 더 잘 어울려요 ✨
🔹 세련되고 분위기 있는 이미지를 연출! 🌿
🔹 차분하면서도 세련된 색상이 Good! 🎨`,
bestColors: ["#C0C0C0", "#D3D3D3", "#B0C4DE", "#AFEEEE", "#E6E6FA"],
    subColors: ["#BDB76B", "#CD853F", "#4682B4", "#7B68EE", "#DDA0DD"],
    worstColors: ["#8B0000", "#8B4513", "#556B2F", "#2F4F4F", "#696969"],
  },
  7: {
    name: "🍂 가을 웜 뮤트 🌿",
    path: "/autumn-mute",
    colorClass: "autumn-mute",
    characterUrl: "character/autumn-mute.png",
    description: `🔹 부드럽고 자연스러운 색감이 찰떡!
🔹 피부는 따뜻한 느낌, 살구빛이 감돌아요 🍑
🔹 은은하고 고급스러운 컬러가 얼굴을 부드럽게! ✨
🔹 차분하고 따뜻한 분위기를 연출 💛
🔹 뉴트럴하고 웜한 색상이 가장 잘 어울려요! 🎶`,
bestColors: ["#D2B48C", "#8B4513", "#A0522D", "#CD853F", "#BC8F8F"],
    subColors: ["#556B2F", "#6B8E23", "#8FBC8F", "#DAA520", "#BDB76B"],
    worstColors: ["#00008B", "#483D8B", "#191970", "#4682B4", "#5F9EA0"],
  },
  8: {
    name: "🍁 가을 웜 스트롱 🌳",
    path: "/autumn-strong",
    colorClass: "autumn-strong",
    characterUrl: "character/autumn-strong.png",
    description: `🔹 깊고 선명한 색감이 찰떡!
🔹 피부는 건강하고 따뜻한 느낌, 황금빛이 돌아요 ☀️
🔹 강렬하면서도 자연스러운 컬러가 조화를 이뤄요! 🎨
🔹 고급스럽고 깊이 있는 분위기를 연출 ✨
🔹 따뜻한 원색 계열과 어두운 컬러가 찰떡! 🍷`,
bestColors: ["#8B0000", "#B22222", "#A52A2A", "#D2691E", "#8B4513"],
    subColors: ["#6B4226", "#9C661F", "#8F5E30", "#A67B5B", "#734F2B"],
    worstColors: ["#4682B4", "#5F9EA0", "#00CED1", "#48D1CC", "#20B2AA"],
  },

  9: {
    name: "🌰 가을 웜 다크 🌲",
    path: "/autumn-dark",
    colorClass: "autumn-dark",
    characterUrl: "character/autumn-dark.png",
    description: `🔹 깊고 무게감 있는 색감이 찰떡!
🔹 피부는 따뜻하고 풍부한 느낌, 브론즈빛이 감돌아요 🍂
🔹 짙은 톤과 고급스러운 컬러가 얼굴을 돋보이게 해줘요! 🎩
🔹 강렬하면서도 차분한 분위기를 연출 ✨
🔹 클래식하고 세련된 컬러 조합이 Good! 🎶`,
bestColors: ["#5B3A29", "#8B4513", "#6B4226", "#4E342E", "#3D2B1F"],
    subColors: ["#734F2B", "#A67B5B", "#9C661F", "#8F5E30", "#6B4226"],
    worstColors: ["#4682B4", "#5F9EA0", "#00CED1", "#48D1CC", "#20B2AA"],

  },
  10: {
    name: "❄️ 겨울 쿨 비비드 🌟",
    path: "/winter-vivid",
    colorClass: "winter-vivid",
    characterUrl: "character/winter-vivid.png",
    description: `🔹 강렬하고 선명한 색감이 찰떡!
🔹 피부는 맑고 깨끗한 느낌, 푸른빛이 돌아요 ❄️
🔹 원색 계열의 강한 컬러가 얼굴을 더욱 화사하게! 🎨
🔹 도시적이고 세련된 이미지를 강조해줘요 ✨
🔹 채도가 높은 쿨톤 컬러가 찰떡! 💙`,
bestColors: ["#FF0000", "#0000FF", "#8A2BE2", "#FF1493", "#00FFFF"],
    subColors: ["#4169E1", "#4682B4", "#32CD32", "#FFD700", "#FF4500"],
    worstColors: ["#8B4513", "#6B4226", "#9C661F", "#A67B5B", "#734F2B"],
  },

  11: {
    name: "🍷 겨울 쿨 스트롱 🖤",
    path: "/winter-strong",
    colorClass: "winter-strong",
    characterUrl: "character/winter-strong.png",
    description: `🔹 깊고 강렬한 색감이 찰떡!
🔹 피부는 차갑고 선명한 느낌, 대비가 뚜렷해요 ⛄
🔹 다크한 컬러와 비비드한 컬러가 모두 잘 어울려요! 🎨
🔹 고급스럽고 시크한 분위기를 연출 ✨
🔹 짙은 톤과 강한 색감이 조화를 이뤄요! 💎`,
bestColors: ["#00008B", "#8B0000", "#4B0082", "#483D8B", "#DC143C"],
    subColors: ["#2F4F4F", "#5F9EA0", "#4682B4", "#1E90FF", "#FF4500"],
    worstColors: ["#8B4513", "#6B4226", "#A67B5B", "#734F2B", "#CD853F"],
  },
  12: {
    name: "🏔️ 겨울 쿨 다크 🍇",
    path: "/winter-dark",
    colorClass: "winter-dark",
    characterUrl: "character/winter-dark.png",
    description: `🔹 차갑고 깊은 색감이 찰떡!
🔹 피부는 창백하면서도 선명한 느낌, 푸른빛이 감돌아요 ❄️
🔹 어두운 톤과 강한 컬러가 얼굴을 돋보이게 해줘요! 🎩
🔹 강렬하면서도 신비로운 분위기를 연출 ✨
🔹 어둡고 차가운 색상이 가장 잘 어울려요! 🖤`,
bestColors: ["#00008B", "#191970", "#483D8B", "#8A2BE2", "#4169E1"],
subColors: ["#4682B4", "#5F9EA0", "#708090", "#778899", "#B0C4DE"],
worstColors: ["#A52A2A", "#8B4513", "#556B2F", "#6B8E23", "#808000"],
  },
};

export default personalColorInfo;
