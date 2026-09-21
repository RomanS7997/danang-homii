import { core } from './translations-core.js';
import { landing } from './translations-landing.js';
import { pages } from './translations-pages.js';

// Content and translations live together so each editorial detail ships in all
// three languages. Existing source keys retain their established translations.
const known = new Set([...core, ...landing, ...pages].map(row => row[0]));
export const enrichment = [];
function m(ru, en, vi) {
  if (!known.has(ru)) { enrichment.push([ru, en, vi]); known.add(ru); }
  return ru;
}
export const copy = {
  districtEyebrow: m('ГОРОД ДЛЯ ВАШЕЙ ЖИЗНИ', 'A CITY TO MAKE YOUR OWN', 'THÀNH PHỐ CHO CUỘC SỐNG CỦA BẠN'),
  districtTitle: m('Сначала район. Потом — чувство дома.', 'Find your neighbourhood. Feel at home.', 'Chọn khu phố. Tìm cảm giác thân quen.'),
  districtIntro: m('Пять разных способов жить в Дананге. Посмотрите, как может выглядеть ваш день, сравните привычки и выберите, с чего начать знакомство.', 'Five different ways to live in Da Nang. Picture your day, compare what matters and choose where to start exploring.', 'Năm cách sống khác nhau ở Đà Nẵng. Hình dung một ngày, so sánh điều quan trọng và chọn nơi bắt đầu khám phá.'),
  regionNote: m('Это привычные зоны поиска жилья, а не схема административных границ. Ан Тхыонг — отдельный квартал в более широкой южной прибрежной зоне.', 'These are familiar home-search areas, not administrative boundaries. An Thuong is a neighbourhood within the wider southern coastal area.', 'Đây là các khu vực tìm nhà quen thuộc, không phải bản đồ địa giới hành chính. An Thượng là một khu phố trong vùng ven biển phía nam rộng hơn.'),
  explore: m('Знакомство с районом', 'Meet the neighbourhood', 'Làm quen với khu phố'),
  illustration: m('Сгенерированная иллюстрация', 'AI-generated illustration', 'Hình minh họa tạo bằng AI'),
  who: m('Присмотритесь, если', 'Worth exploring if', 'Đáng cân nhắc nếu'),
  consider: m('Обратная сторона', 'The trade-off', 'Điều cần cân nhắc'),
  check: m('Проверьте на месте', 'Check in person', 'Kiểm tra tại chỗ'),
  dayTitle: m('Один день в этом районе', 'A day in this neighbourhood', 'Một ngày ở khu phố này'),
  morning: m('Утро', 'Morning', 'Buổi sáng'),
  daytime: m('День', 'Daytime', 'Ban ngày'),
  evening: m('Вечер', 'Evening', 'Buổi tối'),
  dayNote: m('Идея для знакомства с районом, а не обещание конкретного адреса.', 'A suggested way to explore, not a promise about a particular address.', 'Gợi ý trải nghiệm khu vực, không phải cam kết về một địa chỉ cụ thể.'),
  map: m('Посмотреть зону на карте', 'Explore the area on a map', 'Xem khu vực trên bản đồ'),
  homes: m('Квартиры в этой зоне', 'Homes in this area', 'Căn hộ trong khu vực'),
  quizTitle: m('Как вы хотите жить?', 'How would you like to live?', 'Bạn muốn sống như thế nào?'),
  quizIntro: m('Выберите важные для вас вещи. Подскажем два направления для знакомства — с объяснением, почему.', 'Choose what matters. We’ll suggest two areas to explore and explain why.', 'Chọn những điều quan trọng. Chúng tôi gợi ý hai khu vực để tìm hiểu và giải thích lý do.'),
  quizEmpty: m('Можно отметить несколько привычек — здесь нет единственного правильного ответа.', 'Pick more than one priority. There is no single right answer.', 'Bạn có thể chọn nhiều ưu tiên. Không có một đáp án đúng duy nhất.'),
  quizResult: m('Начните знакомство с этих мест', 'Start exploring here', 'Bắt đầu tìm hiểu từ đây'),
  reset: m('Сбросить выбор', 'Clear selection', 'Bỏ chọn'),
  readArea: m('Подробнее о районе', 'Explore this area', 'Tìm hiểu khu vực'),
  match: m('Ваши ориентиры: {items}', 'Your priorities: {items}', 'Ưu tiên của bạn: {items}'),
  editorial: m('Редакционная подсказка по вашим приоритетам. Тишина, интернет и удобство зависят от конкретной улицы и дома.', 'An editorial suggestion based on your priorities. Noise, internet and convenience depend on the actual street and building.', 'Gợi ý biên tập dựa trên ưu tiên của bạn. Tiếng ồn, internet và sự tiện lợi phụ thuộc vào từng con phố và tòa nhà.'),
  compareTitle: m('Два района рядом. Решать проще.', 'Two areas, side by side.', 'Đặt hai khu vực cạnh nhau.'),
  compareIntro: m('Сравнивайте не «лучше или хуже», а то, что будет важно каждый день.', 'Compare what matters in everyday life, rather than looking for one universal winner.', 'So sánh điều quan trọng trong cuộc sống hằng ngày, thay vì tìm một nơi tốt nhất cho tất cả.'),
  firstArea: m('Первый район', 'First area', 'Khu vực thứ nhất'),
  secondArea: m('Второй район', 'Second area', 'Khu vực thứ hai'),
  shore: m('Море и прогулки', 'Sea and walks', 'Biển và đi dạo'),
  routine: m('Повседневный ритм', 'Everyday rhythm', 'Nhịp sống hằng ngày'),
  mobility: m('Передвижение', 'Getting around', 'Di chuyển'),
  sources: m('Источники и ориентиры', 'Sources and context', 'Nguồn và thông tin tham khảo'),
  sourcesNote: m('Ориентиры сверены с туристическими источниками. Маршруты дня и рекомендации — наша редакционная интерпретация. Актуальность: сентябрь 2026.', 'Landmarks checked against tourism sources. Daily itineraries and recommendations are our editorial interpretation. Reviewed September 2026.', 'Các địa danh được đối chiếu với nguồn du lịch. Lịch trình và gợi ý là diễn giải của biên tập. Cập nhật tháng 9 năm 2026.'),
  rentTitle: m('Переезд, в котором всё по полочкам.', 'A move you can make sense of.', 'Chuyển nhà, từng việc rõ ràng.'),
  rentIntro: m('Что спросить до просмотра, что проверить в квартире и что подготовить к заезду. Здесь можно собрать свой список и посчитать стартовые расходы.', 'What to ask before a viewing, what to check inside and what to prepare for move-in. Build your checklist and estimate your starting costs.', 'Cần hỏi gì trước khi xem nhà, kiểm tra gì trong căn hộ và chuẩn bị gì khi nhận nhà. Tạo danh sách và tính chi phí ban đầu của bạn.'),
  journeyTitle: m('На каком вы сейчас этапе?', 'Where are you in the move?', 'Bạn đang ở bước nào?'),
  nextStep: m('Что сделать сейчас', 'What to do now', 'Việc cần làm lúc này'),
  checklistTitle: m('Ваш чек-лист просмотра', 'Your viewing checklist', 'Danh sách kiểm tra khi xem nhà'),
  checklistIntro: m('Открывайте на просмотре, отмечайте проверенное. Список сохраняется только в этом браузере и не отправляется нам.', 'Open this at your viewing and tick off each check. Your list stays in this browser and is not sent to us.', 'Mở khi xem nhà và đánh dấu từng mục. Danh sách chỉ lưu trong trình duyệt này, không gửi cho chúng tôi.'),
  progress: m('Проверено {done} из {total}', 'Checked {done} of {total}', 'Đã kiểm tra {done}/{total}'),
  checklistReset: m('Очистить отметки', 'Clear checks', 'Xóa đánh dấu'),
  allChecked: m('Всё отмечено. Сохраните фото и ответы по этой квартире.', 'All checked. Keep the photos and answers for this home.', 'Đã kiểm tra đủ. Hãy lưu ảnh và câu trả lời về căn hộ này.'),
  budgetTitle: m('Сколько подготовить к переезду?', 'What should you set aside?', 'Cần chuẩn bị bao nhiêu?'),
  budgetIntro: m('Подставьте суммы, которые обсудили с собственником. Депозит учитываем отдельно от обычных ежемесячных расходов.', 'Enter the amounts discussed with the owner. We show the deposit separately from regular monthly costs.', 'Nhập số tiền đã trao đổi với chủ nhà. Tiền cọc được tách khỏi chi phí hằng tháng.'),
  rent: m('Аренда, $ в месяц', 'Rent, $ per month', 'Tiền thuê, $/tháng'),
  deposit: m('Разовый депозит, $', 'One-time deposit, $', 'Tiền cọc một lần, $'),
  extras: m('Другие расходы, $ в месяц', 'Other costs, $ per month', 'Chi phí khác, $/tháng'),
  regular: m('Обычный месяц', 'A regular month', 'Một tháng thông thường'),
  initial: m('На первый месяц и депозит', 'First month plus deposit', 'Tháng đầu và tiền cọc'),
  budgetNote: m('Начальные числа — пример. Расчёт включает один месяц аренды, указанные расходы и депозит. Предоплата за несколько месяцев, перелёт и разовые покупки не включены.', 'Starting numbers are examples. This includes one month of rent, the costs entered and the deposit. Multi-month advance rent, flights and one-off purchases are not included.', 'Các số ban đầu chỉ là ví dụ. Bao gồm một tháng thuê, chi phí bạn nhập và tiền cọc. Chưa gồm trả trước nhiều tháng, vé máy bay và mua sắm một lần.'),
  invalidBudget: m('Введите неотрицательные суммы во всех трёх полях.', 'Enter non-negative amounts in all three fields.', 'Nhập số tiền không âm vào cả ba ô.'),
  guidesEyebrow: m('ОСВОИТЬСЯ В НОВОМ ГОРОДЕ', 'SETTLE INTO A NEW CITY', 'LÀM QUEN VỚI THÀNH PHỐ MỚI'),
  guidesTitle: m('Переехать. Освоиться. Жить.', 'Move in. Settle in. Feel at home.', 'Chuyển đến. Làm quen. An cư.'),
  guidesIntro: m('Практические заметки для переезда: выбираем окружение, внимательно смотрим квартиру и устраиваем первые дни. С инструментами, которые можно использовать сразу.', 'Practical notes for your move: choose your surroundings, view a home carefully and settle into your first days. With tools you can use right away.', 'Ghi chú thiết thực cho việc chuyển nhà: chọn môi trường sống, xem căn hộ kỹ và ổn định những ngày đầu. Có công cụ dùng ngay.'),
  allTopics: m('Все темы', 'All topics', 'Tất cả chủ đề'),
  toolInside: m('Практика внутри', 'Includes a practical tool', 'Có công cụ thực hành'),
  toolTitle: m('От чтения — к вашему решению', 'From reading to your decision', 'Từ đọc đến quyết định của bạn'),
  districtLink: m('Сравнить районы интерактивно', 'Compare neighbourhoods interactively', 'So sánh khu vực tương tác'),
  toolsIntro: m('Не держите всё в голове. Сопоставьте районы, отметьте проверки или разложите переезд на понятные шаги.', 'You don’t have to keep everything in your head. Compare areas, check off details or break your move into clear steps.', 'Không cần nhớ tất cả. So sánh khu vực, đánh dấu việc kiểm tra hoặc chia việc chuyển nhà thành từng bước.'),
  around: m('А что вокруг дома?', 'What’s around your home?', 'Xung quanh nhà có gì?'),
  aroundNote: m('Знакомство с зоной поможет задать правильные вопросы. Точный маршрут и окружение проверим для выбранного адреса.', 'Knowing the area helps you ask the right questions. Check the exact routes and surroundings for the address you choose.', 'Hiểu khu vực giúp bạn đặt câu hỏi đúng. Cần kiểm tra lộ trình và môi trường quanh địa chỉ cụ thể.'),
  aboutTitle: m('Видеть город. Замечать детали.', 'Know the city. Notice the details.', 'Hiểu thành phố. Chú ý từng chi tiết.'),
  aboutIntro: m('Красивые метры — только начало. Нам интереснее, как вы будете жить: где работать, гулять и чувствовать себя на своём месте.', 'A beautiful apartment is only the start. What matters is how you’ll live: where you work, walk and feel you belong.', 'Căn hộ đẹp chỉ là khởi đầu. Điều quan trọng là cách bạn sống: làm việc, đi dạo và cảm thấy nơi này thuộc về mình.'),
  standardsTitle: m('Ваши привычки становятся вопросами на просмотре.', 'Your habits become questions at the viewing.', 'Thói quen của bạn trở thành câu hỏi khi xem nhà.'),
  ownerReady: m('Подготовьте объект к первому разговору', 'Get your property ready for a first conversation', 'Chuẩn bị thông tin cho cuộc trao đổi đầu tiên'),
  ownerIntro: m('Не нужна идеальная презентация. Эти три набора деталей помогут быстрее понять объект и избежать лишней переписки.', 'No polished presentation needed. These three sets of details help us understand the property and avoid unnecessary back-and-forth.', 'Không cần bài giới thiệu hoàn hảo. Ba nhóm thông tin này giúp hiểu căn nhà nhanh hơn và giảm trao đổi không cần thiết.'),
};

export const priorities = [
  {id:'sea',label:m('Море в повседневной жизни','Sea as part of daily life','Biển trong cuộc sống hằng ngày')},
  {id:'cafes',label:m('Кафе и новые знакомства','Cafés and meeting people','Cà phê và gặp gỡ')},
  {id:'city',label:m('Город и местные рынки','City life and local markets','Đời sống phố và chợ địa phương')},
  {id:'space',label:m('Пространство и спокойный темп','Space and a slower pace','Không gian và nhịp sống chậm')},
  {id:'nature',label:m('Зелень и выезды на природу','Greenery and nature trips','Cây xanh và đi chơi thiên nhiên')},
];
// Qualitative editorial matching, not statistical ratings or inventory data.
// These familiar housing-search zones are not a current administrative registry.
export const neighbourhoods = [
  {id:'an-thuong',name:'Ан Тхыонг',image:'an-thuong-v1',query:'An Thuong Da Nang',matches:['sea','cafes'],
    title:m('Кофе, море и знакомые лица.','Coffee, the sea and familiar faces.','Cà phê, biển và những gương mặt quen.'),
    summary:m('Квартал у пляжа Микхе с кафе и туристической жизнью. Здесь удобно начать знакомство с прибрежным Данангом: выйти за завтраком, дойти до моря, найти свой вечерний маршрут. Но тихое жильё выбирают по улице и окнам, а не по названию квартала.','A neighbourhood by My Khe Beach with cafés and visitor life. A useful starting point for coastal Da Nang: breakfast nearby, a walk to the sea, an evening routine. Choose a quiet home by its street and windows, not by the neighbourhood name.','Khu phố gần biển Mỹ Khê với quán cà phê và hoạt động du lịch. Một điểm bắt đầu để làm quen với Đà Nẵng ven biển: ăn sáng, đi ra biển, tìm lộ trình buổi tối. Muốn yên tĩnh, hãy xem từng con phố và hướng cửa sổ.'),
    fit:m('Хочется кафе, прогулок и общения рядом с домом.','You want cafés, walks and social life near home.','Bạn muốn có quán cà phê, chỗ đi dạo và giao lưu gần nhà.'),
    trade:m('Оживлённые заведения и движение могут быть слышны вечером.','Busy venues and traffic can be audible in the evening.','Quán xá và xe cộ có thể gây ồn vào buổi tối.'),
    check:m('Зайдите вечером, закройте окна и послушайте спальню. Проверьте рабочий стол и интернет видеозвонком.','Visit in the evening, close the windows and listen from the bedroom. Check the desk and try a video call.','Đến vào buổi tối, đóng cửa sổ và nghe từ phòng ngủ. Kiểm tra bàn làm việc và thử gọi video.'),
    shore:m('Пляж Микхе; путь зависит от конкретной улицы.','My Khe Beach; the walk depends on the street.','Biển Mỹ Khê; quãng đường tùy từng phố.'),
    rhythm:m('Кафе, рестораны, жизнь вокруг пляжа.','Cafés, restaurants and beachside life.','Cà phê, nhà hàng và đời sống ven biển.'),
    mobility:m('Проверьте пешие маршруты через прибрежную дорогу.','Check walking routes across the coastal road.','Kiểm tra đường đi bộ qua đường ven biển.'),
    day:[m('Начните с кофе и прогулки к Микхе. Проверьте, удобно ли переходить дорогу и есть ли тень на обратном пути.','Start with coffee and a walk to My Khe. Check the road crossing and shade on the way back.','Bắt đầu với cà phê và đi bộ ra Mỹ Khê. Kiểm tra chỗ qua đường và bóng mát lúc về.'),m('Попробуйте поработать дома: важнее кресло, розетки и стабильный звонок, чем количество кафе на карте.','Try working from home: a chair, sockets and a stable call matter more than the café count on a map.','Thử làm việc tại nhà: ghế, ổ điện và cuộc gọi ổn định quan trọng hơn số quán cà phê trên bản đồ.'),m('Пройдитесь по соседним улицам после ужина. Такой визит лучше дневного просмотра показывает, подходит ли вам вечерний ритм.','Walk the neighbouring streets after dinner. This reveals the evening rhythm better than a daytime viewing.','Đi quanh các phố sau bữa tối. Bạn sẽ hiểu nhịp sống buổi tối rõ hơn khi chỉ xem nhà ban ngày.')],
    source:'https://danangfantasticity.com/en/an-thuong-night-market'},
  {id:'ngu-hanh-son',name:'Нгу Хань Шон',image:'ngu-hanh-son-v1',query:'Non Nuoc Da Nang',matches:['sea','space'],
    title:m('Больше горизонта. Свой темп.','A wider horizon. Your own pace.','Chân trời rộng hơn. Nhịp sống riêng.'),
    summary:m('Здесь рассматриваем южное побережье в сторону Нонныок и Мраморных гор, отдельно от компактного Ан Тхыонга. Пляжные участки, жилые улицы и курортная застройка чередуются. Для долгой аренды особенно важно понять, что будет рядом с вашим домом каждый день.','Here we focus on the southern coast towards Non Nuoc and the Marble Mountains, separately from compact An Thuong. Beach stretches, residential streets and resorts alternate. For a long stay, check what will actually be near your home every day.','Ở đây chúng ta xét bờ biển phía nam hướng Non Nước và Ngũ Hành Sơn, tách khỏi khu An Thượng nhỏ gọn. Bãi biển, đường dân cư và khu nghỉ dưỡng xen kẽ. Thuê dài hạn cần xem quanh nhà có gì cho sinh hoạt mỗi ngày.'),
    fit:m('Готовы выбирать дом и маршруты вместе, цените пространство.','You value space and will choose your home and routes together.','Bạn coi trọng không gian và sẵn sàng tính cả lộ trình khi chọn nhà.'),
    trade:m('Вид на море не гарантирует магазины и кафе в пешей доступности.','A sea view does not guarantee shops and cafés within walking distance.','Hướng biển không đồng nghĩa với cửa hàng và quán ăn có thể đi bộ tới.'),
    check:m('Найдите реальный выход к пляжу, ближайшие продукты и удобный способ ездить по своим делам.','Find the actual beach access, grocery options and a practical way to run your errands.','Tìm lối ra biển thực tế, chỗ mua thực phẩm và cách đi lại thuận tiện.'),
    shore:m('Южное побережье и Нонныок; уточните доступ к пляжу.','Southern coast and Non Nuoc; check beach access.','Bờ biển phía nam và Non Nước; kiểm tra lối ra biển.'),
    rhythm:m('Жилые улицы и курортные участки — смотрите конкретное место.','Residential and resort pockets; inspect the specific location.','Khu dân cư xen khu nghỉ dưỡng; xem từng vị trí.'),
    mobility:m('Заранее проверьте ежедневные поездки.','Plan and test your everyday journeys.','Tính và thử các chuyến đi hằng ngày.'),
    day:[m('Пройдите от входа в дом до открытого пляжного доступа. На карте море близко, но путь может отличаться.','Walk from the building entrance to public beach access. The sea may look close on a map while the route differs.','Đi từ cổng nhà đến lối ra biển công cộng. Trên bản đồ biển gần nhưng đường thực tế có thể khác.'),m('Сделайте обычную закупку продуктов и проверьте маршрут до места работы или учёбы.','Do a normal grocery run and test the route to work or study.','Thử đi mua thực phẩm và đi đến nơi làm việc hoặc học tập.'),m('Оцените освещение, вход в дом и дорогу обратно после заката. Выбирайте удобство привычной жизни, а не только вид из окна.','Check lighting, the building entrance and the route home after sunset. Choose daily convenience as well as the view.','Xem đèn đường, lối vào nhà và đường về sau hoàng hôn. Chọn sự tiện lợi hằng ngày bên cạnh cảnh đẹp.')],
    source:'https://vietnam.travel/node/1203'},
  {id:'hai-chau',name:'Хай Тяу',image:'hai-chau-v1',query:'Hai Chau Han River Da Nang',matches:['city','cafes'],
    title:m('Город начинается у вашей двери.','The city starts at your door.','Nhịp sống phố ngay ngoài cửa.'),
    summary:m('Центральная городская жизнь на западной стороне реки Хан: набережная, рынки и деловые маршруты. Хорошее направление для знакомства, если вам важнее быть внутри города, чем рядом с пляжем. К морю нужно планировать отдельную дорогу через реку.','Central urban life on the west side of the Han River: river walks, markets and everyday city routes. Worth exploring if being in the city matters more than living by the beach. Reaching the sea means planning a separate trip across the river.','Đời sống trung tâm ở bờ tây sông Hàn: đường ven sông, chợ và các lộ trình trong phố. Đáng tìm hiểu nếu bạn ưu tiên sống giữa thành phố hơn là sát biển. Ra biển cần tính một chuyến đi qua sông.'),
    fit:m('Вам близки местные рынки, набережная и городской распорядок.','You enjoy local markets, river walks and a city routine.','Bạn thích chợ địa phương, đi dạo ven sông và nhịp sống phố.'),
    trade:m('Оживлённые дороги; пляж не является продолжением двора.','Busy roads; the beach is not just outside your door.','Đường đông xe; biển không ở ngay ngoài cửa.'),
    check:m('Проверьте парковку, доступ к дому и звуки с дороги. Пройдите свой маршрут в час, когда будете им пользоваться.','Check parking, building access and road noise. Test your route at the time you will use it.','Kiểm tra chỗ đỗ xe, lối vào và tiếng xe. Thử lộ trình vào đúng giờ bạn sẽ đi.'),
    shore:m('Набережная Хан; до пляжа — отдельная поездка.','Han River walks; the beach is a separate trip.','Đi dạo sông Hàn; ra biển cần một chuyến đi riêng.'),
    rhythm:m('Городские дела, рынки, кафе и набережная.','City errands, markets, cafés and the riverfront.','Việc trong phố, chợ, cà phê và bờ sông.'),
    mobility:m('Сравните поездки по центру и через мосты.','Compare city routes and bridge crossings.','So sánh đi trong trung tâm và qua cầu.'),
    day:[m('Прогуляйтесь вдоль Хан и зайдите на рынок. Представьте этот путь не как экскурсию, а как обычный выход за продуктами.','Walk along the Han and visit a market. Imagine the route as a regular grocery trip rather than sightseeing.','Đi dọc sông Hàn và ghé chợ. Hình dung đây là chuyến mua thực phẩm thường ngày chứ không phải tham quan.'),m('Проверьте городской маршрут: работа, спорт, нужные магазины. Обратите внимание на подъезд и парковку у дома.','Test your city routine: work, exercise and essential shops. Look at access and parking at home.','Thử lộ trình trong phố: làm việc, tập luyện và cửa hàng cần thiết. Xem lối vào và chỗ đỗ xe ở nhà.'),m('Посмотрите набережную вечером, а потом вернитесь в квартиру и оцените, что слышно при закрытых окнах.','Visit the riverfront in the evening, then return home and listen with the windows closed.','Ra bờ sông buổi tối, sau đó về nhà và nghe tiếng động khi đóng cửa sổ.')],
    source:'https://www.vietnam.travel/things-to-do/da-nang-eat-play-relax-your-ultimate-coastal-escape'},
  {id:'son-tra',name:'Шон Тра',image:'son-tra-v1',query:'Man Thai Son Tra Da Nang',matches:['sea','nature'],
    title:m('Между морем и зелёным горизонтом.','Between the sea and a green horizon.','Giữa biển và chân trời xanh.'),
    summary:m('Северная часть восточного побережья в сторону полуострова Шон Тра. Здесь можно совместить приморские прогулки с выездами к зелёным холмам. У городских кварталов и улиц ближе к полуострову разный ритм — полезно сравнить несколько адресов.','The northern part of the eastern coast towards Son Tra Peninsula. Seaside walks can sit alongside trips towards green hills. Urban neighbourhoods and streets closer to the peninsula have different rhythms, so compare several addresses.','Phần phía bắc của bờ biển phía đông, hướng bán đảo Sơn Trà. Có thể kết hợp đi dạo biển với các chuyến đi về phía đồi xanh. Khu phố đô thị và đường gần bán đảo có nhịp sống khác nhau, nên so sánh vài địa chỉ.'),
    fit:m('Важны море и возможность выбираться к природе.','The sea and access to nature matter to you.','Bạn coi trọng biển và cơ hội đi gần thiên nhiên.'),
    trade:m('Близость к полуострову сама по себе не означает тишину у окон.','Being near the peninsula does not automatically mean quiet windows.','Gần bán đảo không tự động có nghĩa là nhà yên tĩnh.'),
    check:m('Уточните окружение конкретного дома: движение, работающие заведения и ежедневный путь до нужных мест.','Check the actual surroundings: traffic, active venues and your daily routes.','Xem môi trường quanh nhà: xe cộ, quán đang hoạt động và lộ trình hằng ngày.'),
    shore:m('Восточный берег, ориентир — полуостров Шон Тра.','Eastern shore, with Son Tra Peninsula as a landmark.','Bờ biển phía đông, hướng về bán đảo Sơn Trà.'),
    rhythm:m('Прибрежный город с разными по характеру улицами.','Coastal city life with distinct street-by-street character.','Đô thị ven biển với từng con phố có nét riêng.'),
    mobility:m('Проверьте путь по берегу и к мостам через Хан.','Check routes along the coast and towards Han River bridges.','Kiểm tra đường ven biển và đường tới các cầu sông Hàn.'),
    day:[m('Начните с прогулки вдоль берега. Посмотрите, как меняется улица между пляжем и входом в дом.','Start with a walk along the shore. Notice how the street changes between the beach and your building.','Bắt đầu bằng đi dạo ven biển. Quan sát đường phố thay đổi từ bãi biển đến cổng nhà.'),m('Проверьте магазины и обычный путь по делам, а выезд к полуострову оставьте отдельным планом на свободный день.','Check shops and your usual errands; keep a peninsula trip as a separate day-off plan.','Kiểm tra cửa hàng và đường đi làm việc thường ngày; để chuyến ra bán đảo thành kế hoạch ngày nghỉ.'),m('Сравните шум у дороги и во дворе. Один квартал вглубь может ощущаться иначе, чем первая линия.','Compare road noise with the courtyard. One block inland can feel different from the beachfront.','So sánh tiếng ồn ngoài đường và trong sân. Lùi vào một dãy phố có thể khác hẳn mặt biển.')],
    source:'https://vietnam.travel/things-to-do/must-visit-places-in-da-nang'},
  {id:'lien-chieu',name:'Лиен Тьеу',image:'lien-chieu-v1',query:'Lien Chieu Nam O Da Nang',matches:['city','space','nature'],
    title:m('Другой берег. Другой взгляд на город.','Another shore. A different view of the city.','Bờ biển khác. Góc nhìn khác về thành phố.'),
    summary:m('Северо-западное направление у залива Дананг, в сторону Нам О и перевала Хайван. Оно заметно отличается от туристической полосы Микхе. Рассматривайте его через собственные маршруты: до работы, учёбы и тех мест, куда вы действительно будете ездить.','The northwestern direction along Da Nang Bay, towards Nam O and Hai Van Pass. It differs from the My Khe visitor strip. Consider it through your own routes: work, study and the places you will actually travel to.','Hướng tây bắc ven vịnh Đà Nẵng, về Nam Ô và đèo Hải Vân. Khác với dải du lịch Mỹ Khê. Hãy cân nhắc qua lộ trình riêng: nơi làm, nơi học và những chỗ bạn thực sự sẽ tới.'),
    fit:m('Ваши дела связаны с северо-западом или хочется изучить другую сторону города.','Your routine is in the northwest, or you want to explore another side of the city.','Sinh hoạt của bạn ở phía tây bắc hoặc bạn muốn tìm hiểu một góc khác của thành phố.'),
    trade:m('Не стоит выбирать только по цене, если ежедневные поездки станут неудобными.','Do not choose on price alone if daily journeys become inconvenient.','Đừng chọn chỉ vì giá nếu đi lại mỗi ngày trở nên bất tiện.'),
    check:m('Проедьте будущий маршрут в обычное время. Посмотрите на движение рядом с домом и ближайшие магазины.','Try your future route at a normal travel time. Check traffic near the home and nearby shops.','Thử lộ trình tương lai vào giờ đi lại thường ngày. Xem giao thông quanh nhà và cửa hàng gần đó.'),
    shore:m('Залив Дананг и направление Нам О; другой берег города.','Da Nang Bay and the Nam O direction; a different shoreline.','Vịnh Đà Nẵng và hướng Nam Ô; một bờ biển khác.'),
    rhythm:m('Повседневная жизнь вне основной полосы Микхе.','Everyday life beyond the main My Khe strip.','Sinh hoạt thường ngày ngoài dải Mỹ Khê chính.'),
    mobility:m('Ежедневные расстояния особенно важны.','Your everyday travel distances matter especially here.','Khoảng cách đi lại hằng ngày đặc biệt quan trọng.'),
    day:[m('Проверьте утреннюю дорогу к работе или учёбе. Это поможет оценить район точнее, чем редкая поездка на выходных.','Try the morning trip to work or study. It tells you more than an occasional weekend visit.','Thử đi làm hoặc đi học buổi sáng. Điều này cho biết nhiều hơn một lần ghé cuối tuần.'),m('Найдите удобный магазин и место для обеда рядом с конкретным домом. Оцените, что можно делать без лишних поездок.','Find a useful shop and lunch spot near the actual home. See which errands need no extra journey.','Tìm cửa hàng tiện và chỗ ăn trưa gần đúng căn nhà. Xem việc nào có thể làm mà không cần đi xa.'),m('Выделите отдельное время на знакомство с направлением Нам О. Не переносите впечатления от красивой точки на весь район.','Set aside time to explore towards Nam O. Do not assume one beautiful spot represents the entire area.','Dành thời gian tìm hiểu hướng Nam Ô. Đừng lấy ấn tượng từ một điểm đẹp để đánh giá cả khu vực.')],
    source:'https://danangfantasticity.com/en/category/see-amp-do?id=13046'},
];

export function recommendAreas(selected) {
  if (!selected.length) return [];
  return neighbourhoods.map((area,index)=>({area,index,matched:area.matches.filter(id=>selected.includes(id))}))
    .filter(item=>item.matched.length).sort((a,b)=>b.matched.length-a.matched.length||a.index-b.index).slice(0,2);
}

export const viewingChecks = [
  [m('Звуки и окна','Noise and windows','Tiếng ồn và cửa sổ'),m('Послушайте спальню с открытыми и закрытыми окнами. Спросите о стройках рядом.','Listen in the bedroom with windows open and closed. Ask about nearby construction.','Nghe trong phòng ngủ khi mở và đóng cửa sổ. Hỏi về công trình gần đó.')],
  [m('Вода и слив','Water and drainage','Nước và thoát nước'),m('Включите душ и горячую воду, проверьте напор и скорость слива.','Run the shower and hot water; check pressure and drainage.','Mở vòi sen, nước nóng; kiểm tra áp lực và tốc độ thoát nước.')],
  [m('Кондиционер и воздух','Air conditioning and ventilation','Điều hòa và thông gió'),m('Включите кондиционер. Осмотрите углы, потолок и пространство за шторами.','Switch on the air conditioning. Inspect corners, ceilings and behind curtains.','Bật điều hòa. Xem góc phòng, trần và phía sau rèm.')],
  [m('Интернет на вашем устройстве','Internet on your device','Internet trên thiết bị của bạn'),m('Подключитесь к Wi-Fi и попробуйте видеозвонок из места, где будете работать.','Connect to Wi-Fi and try a video call from your intended workspace.','Kết nối Wi-Fi và thử gọi video từ chỗ bạn định làm việc.')],
  [m('Техника и розетки','Appliances and sockets','Thiết bị và ổ điện'),m('Проверьте плиту, холодильник, стиральную машину и доступные розетки.','Check the hob, fridge, washing machine and available sockets.','Kiểm tra bếp, tủ lạnh, máy giặt và các ổ điện.')],
  [m('Полная сумма платежей','The full cost breakdown','Đầy đủ các khoản thanh toán'),m('Запишите аренду, тарифы на электричество и воду, интернет, уборку и парковку.','Write down rent, electricity and water rates, internet, cleaning and parking.','Ghi tiền thuê, giá điện nước, internet, dọn dẹp và đỗ xe.')],
  [m('Депозит и выезд','Deposit and moving out','Tiền cọc và trả nhà'),m('Уточните сумму, порядок возврата и срок предупреждения о выезде. Сохраните условия письменно.','Clarify the amount, return process and notice period. Keep the agreed terms in writing.','Hỏi số tiền, cách hoàn cọc và thời hạn báo trả nhà. Lưu điều kiện đã thống nhất bằng văn bản.')],
  [m('Состояние при заселении','Move-in condition','Tình trạng khi nhận nhà'),m('Сделайте фото мебели, техники и счётчиков. Согласуйте, кому сообщать о поломке.','Photograph furniture, appliances and meters. Agree who to contact about repairs.','Chụp ảnh nội thất, thiết bị và công tơ. Thống nhất liên hệ ai khi có hỏng hóc.')],
];
export const movingStages = [
  {title:m('До просмотра','Before the viewing','Trước khi xem nhà'),subtitle:m('Сузить поиск','Narrow the search','Thu hẹp tìm kiếm'),items:[m('Выберите два района и три обязательных условия: например, стол, лифт и отдельную спальню.','Choose two areas and three must-haves, such as a desk, lift and separate bedroom.','Chọn hai khu vực và ba yêu cầu bắt buộc, như bàn, thang máy và phòng ngủ riêng.'),m('Назовите общий бюджет с бытовыми платежами, сроки и состав жильцов.','Set a total budget including bills, dates and who will live there.','Xác định tổng ngân sách gồm hóa đơn, thời gian và người sẽ ở.'),m('Попросите актуальное видео и уточните, что входит в стоимость.','Ask for a current video and clarify what the price includes.','Xin video mới và hỏi giá bao gồm những gì.')]},
  {title:m('На просмотре','At the viewing','Khi xem nhà'),subtitle:m('Проверить вживую','Check in practice','Kiểm tra thực tế'),items:[m('Осмотрите квартиру при дневном свете и проверьте технику, воду и связь.','View the home in daylight and test appliances, water and connectivity.','Xem nhà ban ngày và thử thiết bị, nước, kết nối.'),m('Побудьте в спальне без разговора: так проще заметить шум.','Spend a quiet moment in the bedroom to notice background noise.','Đứng yên trong phòng ngủ một lúc để nhận ra tiếng ồn.'),m('Пройдите свой обычный маршрут вокруг дома, а не только до такси.','Walk your everyday route around the home, not just to the taxi.','Đi thử lộ trình thường ngày quanh nhà, không chỉ ra xe.')]},
  {title:m('До оплаты','Before paying','Trước khi thanh toán'),subtitle:m('Согласовать детали','Agree on the details','Thống nhất chi tiết'),items:[m('Сверьте адрес, срок, полную стоимость и человека, с которым договариваетесь.','Check the address, term, total cost and who you are making the agreement with.','Đối chiếu địa chỉ, thời hạn, tổng chi phí và người đang thỏa thuận với bạn.'),m('Запишите порядок возврата депозита, уведомления о выезде и ремонта техники.','Record deposit return, move-out notice and appliance repair arrangements.','Ghi cách hoàn cọc, báo trả nhà và sửa thiết bị.'),m('Получите понятный вам текст условий и подтверждение платежа.','Get terms you understand and a payment receipt.','Nhận nội dung điều kiện bạn hiểu rõ và xác nhận thanh toán.')]},
  {title:m('После заезда','After moving in','Sau khi nhận nhà'),subtitle:m('Освоить повседневность','Settle into daily life','Ổn định sinh hoạt'),items:[m('Сохраните фото состояния, показания счётчиков и контакты управляющего.','Keep condition photos, meter readings and the manager’s contact.','Lưu ảnh hiện trạng, chỉ số công tơ và liên hệ quản lý.'),m('Проверьте ключи, вход вечером, парковку и правила общих зон.','Check keys, evening access, parking and shared-space rules.','Kiểm tra chìa khóa, lối vào buổi tối, đỗ xe và quy định khu chung.'),m('Уточните с принимающей стороной необходимые действия по регистрации проживания.','Clarify any residence-registration steps with your host.','Trao đổi với bên tiếp nhận về các bước khai báo lưu trú cần thiết.')]},
];
export const standards = [
  {icon:'work',title:m('Работаете из дома','Working from home','Làm việc tại nhà'),question:m('Где проходит ваш обычный рабочий день?','Where does your working day happen?','Ngày làm việc của bạn diễn ra ở đâu?'),body:m('Проверяем место для стола, свет, розетки и связь именно в той комнате, где вы будете работать.','Check desk space, light, sockets and connectivity in the room you will actually use.','Kiểm tra chỗ đặt bàn, ánh sáng, ổ điện và kết nối ngay trong phòng bạn sẽ dùng.')},
  {icon:'family',title:m('Переезжаете вместе','Moving together','Chuyển đến cùng nhau'),question:m('Что нужно каждому, кто будет жить в доме?','What does each person at home need?','Mỗi người sống trong nhà cần gì?'),body:m('Сопоставляем спальни, хранение, лифт и ежедневные маршруты. У каждого жильца могут быть свои обязательные условия.','Compare bedrooms, storage, lift access and daily routes. Each person may have different must-haves.','Đối chiếu phòng ngủ, chỗ chứa đồ, thang máy và lộ trình hằng ngày. Mỗi người có thể có yêu cầu riêng.')},
  {icon:'pet',title:m('С вами питомец','Bringing a pet','Có thú cưng đi cùng'),question:m('Какие правила действуют именно в этом доме?','What are the rules in this building?','Tòa nhà này có quy định gì?'),body:m('Уточняем согласие на проживание с питомцем, ограничения и возможные дополнительные платежи до решения.','Clarify pet permission, restrictions and any additional charges before deciding.','Hỏi rõ việc cho phép nuôi thú cưng, hạn chế và phí thêm trước khi quyết định.')},
];
export const ownerPrep = [
  [m('Фото и планировка','Photos and layout','Ảnh và bố trí'),m('Дневные фото каждой комнаты, вид из окон, санузел и вход. Короткое видео помогает понять пространство.','Daylight photos of every room, window views, bathroom and entrance. A short video helps explain the space.','Ảnh ban ngày của từng phòng, cảnh qua cửa sổ, phòng tắm và lối vào. Video ngắn giúp hiểu không gian.')],
  [m('Характеристики дома','Home details','Thông tin căn nhà'),m('Адрес, этаж, площадь, спальни, лифт, парковка, мебель и техника. Отдельно отметьте особенности доступа.','Address, floor, area, bedrooms, lift, parking, furniture and appliances. Include any access details.','Địa chỉ, tầng, diện tích, phòng ngủ, thang máy, đỗ xe, nội thất và thiết bị. Ghi rõ đặc điểm lối vào.')],
  [m('Условия и доступность','Terms and availability','Điều kiện và thời gian trống'),m('Желаемая цена, депозит, минимальный срок, дата готовности и состав платежей. Правила для питомцев и проживания — тоже заранее.','Expected price, deposit, minimum term, available date and included costs. Clarify pet and occupancy rules too.','Giá mong muốn, cọc, thời hạn tối thiểu, ngày sẵn sàng và các khoản gồm trong giá. Làm rõ cả quy định thú cưng và cư trú.')],
];

export function calculateMoveBudget(rent, deposit, extras) {
  const inputs = [rent, deposit, extras];
  if (inputs.some(value=>value === '' || value === null || !Number.isFinite(Number(value)) || Number(value)<0)) return null;
  return {monthly:Number(rent)+Number(extras), initial:Number(rent)+Number(deposit)+Number(extras)};
}
