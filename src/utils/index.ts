export const getScoreColor = (score: number) => {
  if (score >= 95) return '#2e7d32'; // Deep Green
  if (score >= 90) return '#388e3c'; // Green
  if (score >= 85) return '#43a047'; // Green
  if (score >= 80) return '#4caf50'; // Green
  if (score >= 75) return '#5cb85c'; // Green
  if (score >= 70) return '#8bc34a'; // Light Green
  if (score >= 65) return '#9ccc65'; // Light Green
  if (score >= 60) return '#aed581'; // Light Green
  if (score >= 55) return '#cddc39'; // Lime
  if (score >= 50) return '#d4e157'; // Lime
  if (score >= 45) return '#ffeb3b'; // Yellow
  if (score >= 40) return '#ffee58'; // Yellow
  if (score >= 35) return '#fff176'; // Yellow
  if (score >= 30) return '#ffc107'; // Amber
  if (score >= 25) return '#ffca28'; // Amber
  if (score >= 20) return '#ff9800'; // Orange
  if (score >= 15) return '#ffa726'; // Orange
  if (score >= 10) return '#ff5722'; // Deep Orange
  if (score >= 5) return '#f44336'; // Red
  return '#e53935'; // Dark Red
};

export const getBinColor = (index: number) => {
  const colors = [
    '#e53935', '#f44336', '#ff5722', '#ffa726', '#ff9800', 
    '#ffca28', '#ffc107', '#fff176', '#ffee58', '#ffeb3b', 
    '#d4e157', '#cddc39', '#aed581', '#9ccc65', '#8bc34a', 
    '#5cb85c', '#4caf50', '#43a047', '#388e3c', '#2e7d32'
  ];
  return colors[index] || '#43a047';
};

export const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

export const normalizeString = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, '')
    .trim();
};

export const normalizeSBD = (s: string) => {
  return s.replace(/\D/g, '').replace(/^0+/, '').trim();
};

export const getRandomPassedMessage = () => {
  const messages = [
    "Chúc mừng em đã vượt qua kỳ thi! Hãy tiếp tục phát huy tinh thần học tập và đạt được nhiều thành tích hơn nữa trong tương lai!",
    "Thật tuyệt vời! Em đã chứng tỏ được khả năng của mình. Hy vọng em sẽ giữ vững phong độ và tiếp tục tỏa sáng!",
    "Xin chúc mừng! Thành công này là phần thưởng xứng đáng cho sự nỗ lực của em. Hãy luôn tin vào bản thân!",
    "Em đã làm rất tốt! Đây là bước ngoặt quan trọng trong hành trình học tập. Chúc em luôn vững vàng và tiến xa hơn nữa!",
    "Chúc mừng em đã chinh phục được thử thách này! Hãy biến thành công này thành động lực để vươn tới những đỉnh cao mới!",
    "Rất ấn tượng với kết quả của em! Hy vọng em sẽ tiếp tục giữ vững tinh thần cầu tiến và đạt được nhiều ước mơ!",
    "Thành công không phải là đích đến mà là hành trình. Chúc mừng em đã bắt đầu hành trình đó một cách xuất sắc!",
    "Em đã chứng minh được rằng sự chăm chỉ luôn được đền đáp. Xin chúc mừng và chúc em tiếp tục tỏa sáng!",
    "Chúc mừng tân học sinh lớp 6 Trần Đại Nghĩa! Một trang mới đầy hứa hẹn đang chờ đón em.",
    "Thành quả ngọt ngào từ những ngày ôn luyện miệt mài. Chúc mừng em và gia đình!",
    "Em đã làm được điều kỳ diệu! Hãy tự hào về bản thân và sẵn sàng cho những thử thách mới nhé.",
    "Một kết quả xứng đáng cho tài năng và sự kiên trì của em. Tiếp tục vươn xa em nhé!",
    "Chúc mừng em đã ghi tên mình vào danh sách trúng tuyển. Đây là khởi đầu của những thành công rực rỡ sau này.",
    "Thật tự hào khi thấy em đạt được kết quả này. Chúc mừng em đã thực hiện được mục tiêu của mình!",
    "Bravo! Một kết quả thật ấn tượng. Chúc em có những năm tháng học trò thật đẹp tại ngôi trường mới.",
    "Tin vui này chắc chắn sẽ làm cả gia đình tự hào. Chúc mừng em đã vượt qua kỳ khảo sát đầy cam go!"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

export const getRandomFailedMessage = () => {
  const messages = [
    "Đừng nản lòng vì thất bại này. Hãy coi đây là bài học quý giá để em hoàn thiện bản thân và tiến gần hơn tới mục tiêu!",
    "Thất bại chỉ là bước đệm để thành công. Hãy tiếp tục cố gắng, vì em hoàn toàn có tiềm năng để làm được điều đó!",
    "Một lần vấp ngã không có nghĩa là mãi mãi không đứng dậy. Hãy lấy lại tinh thần và tiếp tục con đường phía trước!",
    "Kết quả hôm nay không định nghĩa được tương lai của em. Hãy biến thất bại này thành động lực để tiến xa hơn!",
    "Mỗi thử thách đều mang đến bài học riêng. Hãy rút kinh nghiệm từ lần này và quay trở lại mạnh mẽ hơn!",
    "Thành công không phải lúc nào cũng đến ngay lập tức. Hãy kiên trì và tiếp tục nỗ lực, em sẽ đạt được điều mình mong muốn!",
    "Đừng để một lần thất bại làm em mất đi niềm tin. Hãy xem đây là cơ hội để em trưởng thành và tiến bộ hơn!",
    "Cuộc sống không tránh khỏi những thất bại, nhưng điều quan trọng là cách chúng ta vượt qua. Hãy tin vào bản thân và cố gắng thêm!",
    "Cố gắng lên em nhé! Chỉ thiếu một chút may mắn thôi, hãy giữ vững ngọn lửa đam mê học tập.",
    "Kỳ thi này chỉ là một thử thách nhỏ trên con đường dài. Đừng để nó làm nản chí, tương lai vẫn đang rộng mở đón em.",
    "Học tài thi phận, đôi khi kết quả không phản ánh hết năng lực của mình. Hãy vững tin và tiếp tục rèn luyện em nhé.",
    "Bố mẹ và thầy cô vẫn luôn tự hào về sự nỗ lực của em. Nghỉ ngơi một chút rồi lại bắt đầu hành trình mới thôi nào!",
    "Mọi nỗ lực đều được ghi nhận, dù kết quả hôm nay chưa như ý. Hãy mạnh mẽ bước tiếp, thành công sẽ đến với người kiên trì.",
    "Cánh cửa này khép lại sẽ có cánh cửa khác mở ra. Hãy giữ tinh thần lạc quan và sẵn sàng cho những cơ hội mới.",
    "Thất bại là mẹ thành công. Đừng buồn lâu em nhé, hãy phân tích lỗi sai và hoàn thiện mình hơn cho lần tới.",
    "Em đã nỗ lực hết mình và đó mới là điều quan trọng nhất. Hãy tự hào vì mình đã dám đương đầu với thử thách!"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};
