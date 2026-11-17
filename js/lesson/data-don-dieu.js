// Bài: Tính đơn điệu của hàm số (Toán 12), bản song ngữ.
// Mỗi đoạn chữ có hai bản: en (tiếng Anh) và vi (tiếng Việt).
// Công thức viết giữa hai dấu $...$ (cú pháp LaTeX), trang tự hiển thị đẹp.
// Ký hiệu khoảng: tiếng Việt dùng dấu chấm phẩy (−1; 1), tiếng Anh dùng dấu phẩy (−1, 1).

export default {
  id: "don-dieu",
  grade: { en: "Mathematics 12", vi: "Toán 12" },
  title: { en: "Monotonicity of functions", vi: "Tính đơn điệu của hàm số" },

  // Bảng thuật ngữ đã duyệt: bấm vào từ tiếng Anh sẽ hiện nghĩa từ đây.
  // forms: các dạng từ có thể gặp trong bài (số nhiều, cụm từ).
  // st: tách âm tiết bằng dấu ·, âm tiết được nhấn viết HOA. ipa: phiên âm Anh – Mỹ.
  // boi: cách đọc gần đúng kiểu Việt, âm tiết nhấn viết HOA, đoạn chỉ có phụ âm là âm cuối cần giữ.
  // tip: mẹo cho âm tiếng Việt không có.
  glossary: [
    { en: "monotonicity", boi: "man-nơ-tơ-NÍT-xơ-ti", st: "mo·no·to·NI·ci·ty", ipa: "/ˌmɑːnətəˈnɪsəti/", vi: "tính đơn điệu", ex: "We study the monotonicity of functions." },
    { en: "function", boi: "PHĂNG-sần", st: "FUNC·tion", ipa: "/ˈfʌŋkʃən/", forms: ["function", "functions"], vi: "hàm số", ex: "The function is increasing." },
    { en: "increasing", boi: "in-CRÍ-xinh", st: "in·CREAS·ing", ipa: "/ɪnˈkriːsɪŋ/", vi: "đồng biến", ex: "The function is increasing on the interval (1, +∞)." },
    { en: "decreasing", boi: "đi-CRÍ-xinh", st: "de·CREAS·ing", ipa: "/dɪˈkriːsɪŋ/", vi: "nghịch biến", ex: "The function is decreasing on (−1, 1)." },
    { en: "interval", boi: "IN-tơ-vồ", st: "IN·ter·val", ipa: "/ˈɪntərvəl/", forms: ["interval", "intervals"], vi: "khoảng", ex: "Find the intervals of monotonicity." },
    { en: "closed interval", boi: "CLÂU-zd IN-tơ-vồ", tip: "Cuối closed có âm zd: rung nhẹ ở cổ rồi chạm lưỡi lên lợi.", st: "CLOSED IN·ter·val", ipa: "/kloʊzd ˈɪntərvəl/", vi: "đoạn", ex: "[0, 1] is a closed interval." },
    { en: "half-open interval", boi: "háp-ÂU-pần IN-tơ-vồ", st: "half-O·pen IN·ter·val", ipa: "/ˌhæf ˈoʊpən ˈɪntərvəl/", vi: "nửa khoảng", ex: "[0, 1) is a half-open interval." },
    { en: "derivative", boi: "đi-RÍ-vơ-tiv", tip: "Âm cuối v: răng trên chạm nhẹ môi dưới, đừng nuốt mất.", st: "de·RIV·a·tive", ipa: "/dɪˈrɪvətɪv/", vi: "đạo hàm", ex: "The derivative is positive." },
    { en: "differentiable", boi: "đíp-phơ-REN-si-ơ-bồ", st: "dif·fer·EN·ti·a·ble", ipa: "/ˌdɪfəˈrenʃiəbəl/", vi: "có đạo hàm", ex: "Let f be differentiable on K." },
    { en: "domain", boi: "đâu-MÂY-n", st: "do·MAIN", ipa: "/doʊˈmeɪn/", vi: "tập xác định", ex: "The domain is the set of real numbers." },
    { en: "graph", boi: "GRÁ-ph", tip: "Âm cuối ph (f): răng trên chạm môi dưới và thổi hơi.", st: "GRAPH", ipa: "/ɡræf/", vi: "đồ thị", ex: "Look at the graph." },
    { en: "sign", boi: "XAI-n", tip: "Chữ g không đọc.", st: "SIGN", ipa: "/saɪn/", vi: "dấu", ex: "Determine the sign of the derivative." },
    { en: "variation table", boi: "ve-ri-ÂY-sần TÂY-bồ", st: "var·i·A·tion TA·ble", ipa: "/ˌveriˈeɪʃən ˈteɪbəl/", vi: "bảng biến thiên", ex: "Let's make the variation table." },
    { en: "positive", boi: "PA-zơ-tiv", st: "POS·i·tive", ipa: "/ˈpɑːzətɪv/", vi: "dương", ex: "The derivative is positive." },
    { en: "negative", boi: "NÉ-gơ-tiv", st: "NEG·a·tive", ipa: "/ˈneɡətɪv/", vi: "âm", ex: "The derivative is negative." },
    { en: "defined", boi: "đi-PHAI-nd", st: "de·FINED", ipa: "/dɪˈfaɪnd/", vi: "xác định", ex: "The function is defined on K." },
    { en: "for all", boi: "phơ O-l", st: "for ALL", ipa: "/fər ˈɔːl/", vi: "với mọi", ex: "f′(x) > 0 for all x in K." },
    { en: "finitely many", boi: "PHAI-nai-tli ME-ni", st: "FI·nite·ly MAN·y", ipa: "/ˈfaɪnaɪtli ˈmeni/", vi: "hữu hạn (một số hữu hạn)", ex: "f′(x) = 0 at only finitely many points." },
    { en: "point", boi: "POI-nt", st: "POINT", ipa: "/pɔɪnt/", forms: ["point", "points"], vi: "điểm", ex: "Find the points where f′(x) = 0." },
    { en: "does not exist", boi: "đơz nát ích-DÍT-st", tip: "Âm z trong exist: rung cổ như tiếng ong.", st: "does not ex·IST", ipa: "/dʌz nɑːt ɪɡˈzɪst/", vi: "không xác định (không tồn tại)", ex: "f′(x) does not exist at x = 0." },
    { en: "determine", boi: "đi-TƠ-min", st: "de·TER·mine", ipa: "/dɪˈtɜːrmɪn/", vi: "xác định, xét", ex: "Determine the sign of f′(x)." },
    { en: "conclude", boi: "cần-CLU-đ", st: "con·CLUDE", ipa: "/kənˈkluːd/", vi: "kết luận", ex: "Conclude the intervals of monotonicity." },
    { en: "goes up", boi: "gâu-z ÁP", tip: "Âm z cuối goes: rung cổ, nối liền sang up.", st: "goes UP", ipa: "/ɡoʊz ˈʌp/", forms: ["goes up", "go up"], vi: "đi lên", ex: "The graph goes up." },
    { en: "goes down", boi: "gâu-z ĐAO-n", tip: "Âm z cuối goes: rung cổ, đừng bỏ.", st: "goes DOWN", ipa: "/ɡoʊz ˈdaʊn/", forms: ["goes down", "go down"], vi: "đi xuống", ex: "The graph goes down." },
    { en: "from left to right", boi: "phrầm LÉ-pt tơ RAI-t", st: "from LEFT to RIGHT", ipa: "/frəm ˈleft tə ˈraɪt/", vi: "từ trái sang phải", ex: "The graph goes up from left to right." },
    { en: "still holds", boi: "xtiu HÂU-ldz", tip: "Cuối holds có âm ldz, đọc đủ để nghe ra số nhiều.", st: "still HOLDS", ipa: "/stɪl ˈhoʊldz/", vi: "vẫn đúng", ex: "The result still holds." },
    { en: "find", boi: "PHAI-nd", st: "FIND", ipa: "/faɪnd/", vi: "tìm", ex: "Find the derivative." },
    { en: "solve", boi: "XAL-v", st: "SOLVE", ipa: "/sɑːlv/", vi: "giải", ex: "Solve the equation f′(x) = 0." },
    { en: "equation", boi: "i-QUÂY-giần", st: "e·QUA·tion", ipa: "/ɪˈkweɪʒən/", vi: "phương trình", ex: "Solve the equation." },
    { en: "example", boi: "ích-DAM-pồ", st: "ex·AM·ple", ipa: "/ɪɡˈzæmpəl/", vi: "ví dụ", ex: "Look at this example." },
    { en: "definition", boi: "đe-phơ-NÍ-sần", st: "def·i·NI·tion", ipa: "/ˌdefəˈnɪʃən/", vi: "định nghĩa", ex: "Read the definition." },
    { en: "theorem", boi: "THIA-rầm", tip: "Âm th: đặt đầu lưỡi giữa hai hàm răng rồi thổi hơi, không đọc thành th tiếng Việt.", st: "THE·o·rem", ipa: "/ˈθiːərəm/", vi: "định lí", ex: "Use the theorem." },
    { en: "method", boi: "MÉ-thầd", tip: "Âm th: đặt đầu lưỡi giữa hai hàm răng rồi thổi hơi.", st: "METH·od", ipa: "/ˈmeθəd/", vi: "phương pháp, cách làm", ex: "Follow the method step by step." },
    { en: "step", boi: "XTÉP", st: "STEP", ipa: "/step/", forms: ["step", "steps"], vi: "bước", ex: "Step 1: find the domain." },
    { en: "warm-up", boi: "UOM-ắp", st: "WARM-up", ipa: "/ˈwɔːrmʌp/", vi: "khởi động", ex: "Let's start with a warm-up." },
    { en: "practice", boi: "PRÁC-tịs", st: "PRAC·tice", ipa: "/ˈpræktɪs/", vi: "luyện tập", ex: "Practice with this question." },
    { en: "summary", boi: "XA-mơ-ri", st: "SUM·ma·ry", ipa: "/ˈsʌməri/", vi: "tổng kết", ex: "Here is the summary." },
    { en: "let", boi: "LÉT", st: "LET", ipa: "/let/", vi: "cho", ex: "Let y = f(x)." }
  ],

  slides: [
    {
      id: "title", tone: "ink", kind: "title",
      title: { en: "Monotonicity of functions", vi: "Tính đơn điệu của hàm số" },
      blocks: [
        { type: "p", en: "Mathematics 12 · Bilingual lesson", vi: "Toán 12 · Bài học song ngữ" },
        { type: "hint", en: "Tap any English word to see its meaning.", vi: "Chạm vào từ tiếng Anh bất kì để xem nghĩa." }
      ]
    },
    {
      id: "warmup", tone: "amber",
      title: { en: "Warm-up", vi: "Khởi động" },
      blocks: [
        { type: "p", en: "Look at the graph. Where does it go up? Where does it go down?", vi: "Quan sát đồ thị. Đồ thị đi lên ở đâu? Đi xuống ở đâu?" },
        { type: "graph", pack: "mono" }
      ]
    },
    {
      id: "definition", tone: "blue",
      title: { en: "Definition", vi: "Định nghĩa" },
      blocks: [
        { type: "p", en: "Let $y = f(x)$ be defined on $K$, where $K$ is an interval, a closed interval or a half-open interval.",
          vi: "Cho hàm số $y = f(x)$ xác định trên $K$, với $K$ là một khoảng, một đoạn hoặc một nửa khoảng." },
        { type: "list", items: [
          { en: "The function is increasing on $K$ if for all $x_1, x_2 \\in K$: $x_1 < x_2 \\Rightarrow f(x_1) < f(x_2)$.",
            vi: "Hàm số đồng biến trên $K$ nếu với mọi $x_1, x_2 \\in K$: $x_1 < x_2 \\Rightarrow f(x_1) < f(x_2)$." },
          { en: "The function is decreasing on $K$ if for all $x_1, x_2 \\in K$: $x_1 < x_2 \\Rightarrow f(x_1) > f(x_2)$.",
            vi: "Hàm số nghịch biến trên $K$ nếu với mọi $x_1, x_2 \\in K$: $x_1 < x_2 \\Rightarrow f(x_1) > f(x_2)$." }
        ] },
        { type: "note", en: "Increasing: the graph goes up from left to right. Decreasing: the graph goes down from left to right.",
          vi: "Đồng biến: đồ thị đi lên từ trái sang phải. Nghịch biến: đồ thị đi xuống từ trái sang phải." }
      ]
    },
    {
      id: "check1", tone: "amber",
      title: { en: "Quick check", vi: "Kiểm tra nhanh" },
      blocks: [
        { type: "quiz",
          q: { en: "Look again at the warm-up graph of $y = x^3 - 3x$. On which interval is the function decreasing?",
               vi: "Xem lại đồ thị $y = x^3 - 3x$ ở phần khởi động. Hàm số nghịch biến trên khoảng nào?" },
          options: [
            { en: "$(-\\infty, -1)$", vi: "$(-\\infty; -1)$" },
            { en: "$(-1, 1)$", vi: "$(-1; 1)$" },
            { en: "$(1, +\\infty)$", vi: "$(1; +\\infty)$" }
          ],
          answer: 1,
          explain: { en: "Between $x = -1$ and $x = 1$ the graph goes down from left to right.",
                     vi: "Từ $x = -1$ đến $x = 1$, đồ thị đi xuống từ trái sang phải." } }
      ]
    },
    {
      id: "theorem", tone: "violet",
      title: { en: "Theorem", vi: "Định lí" },
      blocks: [
        { type: "p", en: "Let $y = f(x)$ be differentiable on $K$.", vi: "Cho hàm số $y = f(x)$ có đạo hàm trên $K$." },
        { type: "list", items: [
          { en: "If $f'(x) > 0$ for all $x \\in K$, then the function is increasing on $K$.",
            vi: "Nếu $f'(x) > 0$ với mọi $x \\in K$ thì hàm số đồng biến trên $K$." },
          { en: "If $f'(x) < 0$ for all $x \\in K$, then the function is decreasing on $K$.",
            vi: "Nếu $f'(x) < 0$ với mọi $x \\in K$ thì hàm số nghịch biến trên $K$." }
        ] },
        { type: "note", en: "The result still holds if $f'(x) \\ge 0$ (or $f'(x) \\le 0$) for all $x \\in K$ and $f'(x) = 0$ at only finitely many points.",
          vi: "Kết quả vẫn đúng nếu $f'(x) \\ge 0$ (hoặc $f'(x) \\le 0$) với mọi $x \\in K$ và $f'(x) = 0$ chỉ tại hữu hạn điểm." }
      ]
    },
    {
      id: "method", tone: "teal",
      title: { en: "Method", vi: "Phương pháp" },
      blocks: [
        { type: "steps", items: [
          { en: "Find the domain.", vi: "Tìm tập xác định." },
          { en: "Find the derivative $f'(x)$. Find the points where $f'(x) = 0$ or $f'(x)$ does not exist.",
            vi: "Tính đạo hàm $f'(x)$. Tìm các điểm tại đó $f'(x) = 0$ hoặc $f'(x)$ không xác định." },
          { en: "Determine the sign of $f'(x)$ and make the variation table.", vi: "Xét dấu $f'(x)$ và lập bảng biến thiên." },
          { en: "Conclude the intervals where the function is increasing or decreasing.", vi: "Kết luận các khoảng đồng biến, nghịch biến của hàm số." }
        ] }
      ]
    },
    {
      id: "example", tone: "teal",
      title: { en: "Example", vi: "Ví dụ" },
      blocks: [
        { type: "p", en: "Find the intervals of monotonicity of $y = x^3 - 3x$.", vi: "Xét tính đơn điệu của hàm số $y = x^3 - 3x$." },
        { type: "list", items: [
          { en: "Domain: $D = \\mathbb{R}$.", vi: "Tập xác định: $D = \\mathbb{R}$." },
          { en: "$y' = 3x^2 - 3$; $y' = 0 \\Leftrightarrow x = -1$ or $x = 1$.", vi: "$y' = 3x^2 - 3$; $y' = 0 \\Leftrightarrow x = -1$ hoặc $x = 1$." }
        ] },
        { type: "bbt" },
        { type: "note", en: "The function is increasing on $(-\\infty, -1)$ and $(1, +\\infty)$, and decreasing on $(-1, 1)$.",
          vi: "Hàm số đồng biến trên các khoảng $(-\\infty; -1)$ và $(1; +\\infty)$, nghịch biến trên khoảng $(-1; 1)$." }
      ]
    },
    {
      id: "check2", tone: "amber",
      title: { en: "Practice", vi: "Luyện tập" },
      blocks: [
        { type: "quiz",
          q: { en: "The function $y = x^2 - 2x$ is decreasing on which interval?", vi: "Hàm số $y = x^2 - 2x$ nghịch biến trên khoảng nào?" },
          options: [
            { en: "$(-\\infty, 1)$", vi: "$(-\\infty; 1)$" },
            { en: "$(1, +\\infty)$", vi: "$(1; +\\infty)$" },
            { en: "$(-\\infty, +\\infty)$", vi: "$(-\\infty; +\\infty)$" }
          ],
          answer: 0,
          explain: { en: "$y' = 2x - 2 < 0 \\Leftrightarrow x < 1$.", vi: "$y' = 2x - 2 < 0 \\Leftrightarrow x < 1$." } }
      ]
    },
    {
      id: "say", tone: "coral",
      title: { en: "Say it in English", vi: "Nói bằng tiếng Anh" },
      blocks: [
        { type: "say", items: [
          { en: "The derivative is positive, so the function is increasing.", vi: "Đạo hàm dương nên hàm số đồng biến." },
          { en: "The graph goes down from left to right.", vi: "Đồ thị đi xuống từ trái sang phải." },
          { en: "Let's make the variation table.", vi: "Chúng ta lập bảng biến thiên." },
          { en: "The function is decreasing on the interval from minus one to one.", vi: "Hàm số nghịch biến trên khoảng từ âm một đến một." }
        ] }
      ]
    },
    {
      id: "summary", tone: "blue", kind: "summary",
      title: { en: "Your words", vi: "Từ vựng của em" },
      blocks: [{ type: "mystats" }]
    }
  ]
};
