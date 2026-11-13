/* ---------------- text ---------------- */
export const T={
 vi:{start:"Một tiết học thử",lead:"Bản duyệt cảnh 1 và cảnh 2. Không có đáp án đúng sai, thầy cô xử lý như khi đứng lớp thật.",who:"Thầy cô muốn học sinh gọi mình là",lang:"Ngôn ngữ hướng dẫn",enter:"Vào lớp",
  s1t:"Cảnh 1: Chào lớp",s1q:"Hôm nay mở đầu tiết học bằng tiếng Anh. {W} chào lớp thế nào?",say1:"Nói câu {w} sẽ dùng để chào lớp",
  ph:"Bấm micro rồi nói, hoặc chạm vào đây và dùng micro trên bàn phím. Kiểm tra lại chữ máy ghi và sửa nếu sai.",mic:"Bấm để nói",micStop:"Dừng ghi",hintBtn:"Gợi ý từ khóa",cant:"Tôi chưa nói được",send:"Gửi câu nói",
  needOpt:"Chọn một cách xử lý trước.",needSay:"Nói hoặc gõ một câu, hoặc bấm \"Tôi chưa nói được\".",comfort:"Vừa rồi {w} thấy thoải mái đến mức nào?",
  f:["Rất ngại","Ngại","Bình thường","Khá ổn","Rất thoải mái"],listening:"Cả lớp đang lắng nghe…",listen:"Nghe mẫu",retry:"Nói lại",next:"Tiếp",
  topicT:"Chọn bài cho cảnh 2",topicL:"Bài đã chọn quyết định hình trên bảng và các từ trong cảnh 2 đến 5.",
  guideT:"Hướng dẫn trước cảnh 2",demo:"Xem mô phỏng 5 giây",practice:"Chạy thử, không tính điểm",go:"Bắt đầu cảnh 2",skip:"Bỏ qua hướng dẫn",
  s2t:"Cảnh 2: Giảng trên bảng",say2:"Thao tác trên bảng xong thì nói câu {w} sẽ giảng cho lớp",rotate:"Xoay ngang điện thoại để bảng to hơn",clear:"Xóa bảng",
  tryHint:"Lướt gần đường cong hoặc kéo nhãn ở khay dưới lên bảng",endT:"Hết bản duyệt cảnh 1 và 2",endL:"Đây là những gì app ghi nhận. Cảnh 3 sẽ làm sau khi thầy duyệt.",copy:"Sao chép kết quả",again:"Làm lại từ đầu",copied:"Đã sao chép.",copyFail:"Không sao chép được, thầy cô chụp màn hình thay thế.",
  saved:"Câu của {w} hay hơn câu gợi ý, app đã lưu vào kịch bản riêng.",tryUp:"{W} có thể thử mức cao hơn ở các cảnh sau.",
  micOn:"Đang nghe",micPaused:"Micro tạm dừng",micMuted:"Đã tắt micro",mute:"Tắt micro",unmute:"Bật micro",heardEmpty:"Cứ nói tự nhiên, app đang nghe…",
  count:"Tự gửi sau {n} giây",edit:"Sửa",sendNow:"Gửi ngay",replay:"Đang phát lại câu của {w}…",
  denied:"Micro chưa được cho phép. {W} gõ câu, hoặc chạm vào ô và dùng micro trên bàn phím.",
  unsupported:"Trình duyệt này chưa nghe liên tục được. Hãy mở bằng Chrome, hoặc gõ câu và dùng micro trên bàn phím.",
  say1v:"Khi sẵn sàng, cứ nói câu {w} sẽ dùng để chào lớp",say2v:"Vừa thao tác trên bảng vừa nói như đang giảng cho lớp",
  editHint:"Sửa chữ máy nghe nhầm rồi bấm Gửi ngay"},
 en:{start:"A trial lesson",lead:"Review build of scenes 1 and 2. There are no right or wrong answers: handle it as you would in a real class.",who:"Students call you",lang:"Guide language",enter:"Enter the classroom",
  s1t:"Scene 1: Greeting the class",s1q:"Today the lesson opens in English. How do you greet the class?",say1:"Say the sentence you will use to greet the class",
  ph:"Tap the mic and speak, or tap here and use your keyboard mic. Check the words the phone heard and fix them if needed.",mic:"Tap to speak",micStop:"Stop",hintBtn:"Keyword hints",cant:"I can't say it yet",send:"Send",
  needOpt:"Choose a way to respond first.",needSay:"Say or type a sentence, or tap \"I can't say it yet\".",comfort:"How comfortable did that feel?",
  f:["Very uneasy","Uneasy","Neutral","Fairly OK","Very comfortable"],listening:"The class is listening…",listen:"Hear it",retry:"Say it again",next:"Next",
  topicT:"Choose the lesson for scene 2",topicL:"The lesson decides what is on the board and the words used in scenes 2 to 5.",
  guideT:"Before scene 2",demo:"Watch the 5-second demo",practice:"Try it, not scored",go:"Start scene 2",skip:"Skip the guide",
  s2t:"Scene 2: Teaching at the board",say2:"When you finish on the board, say what you would tell the class",rotate:"Turn your phone sideways for a bigger board",clear:"Clear board",
  tryHint:"Trace near the curve, or drag a label from the tray onto the board",endT:"End of scenes 1 and 2",endL:"This is what the app recorded. Scene 3 comes after review.",copy:"Copy results",again:"Start over",copied:"Copied.",copyFail:"Could not copy. Please take a screenshot instead.",
  saved:"Your sentence is better than the suggestion, so it was saved to your own script.",tryUp:"You could try a higher level in the next scenes.",
  micOn:"Listening",micPaused:"Mic paused",micMuted:"Mic off",mute:"Mic off",unmute:"Mic on",heardEmpty:"Just speak naturally, the app is listening…",
  count:"Sending in {n} s",edit:"Edit",sendNow:"Send now",replay:"Playing back your sentence…",
  denied:"The microphone isn't allowed. Type your sentence, or tap the box and use your keyboard mic.",
  unsupported:"This browser can't listen continuously. Open the site in Chrome, or type and use your keyboard mic.",
  say1v:"When you're ready, just say how you greet the class",say2v:"Work on the board and speak as if teaching the class",
  editHint:"Fix any words the phone misheard, then tap Send now"}
};
export const S={who:"thầy",lang:"vi"};
export function t(k){var s=T[S.lang][k];if(typeof s!=="string")return s;var W=S.who==="thầy"?"Thầy":"Cô";return s.replace(/\{W\}/g,S.lang==="vi"?W:"You").replace(/\{w\}/g,S.lang==="vi"?S.who:"you");}
export function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}

