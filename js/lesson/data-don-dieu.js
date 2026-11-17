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
  glossary: [
    { en: "monotonicity", vi: "tính đơn điệu", ex: "We study the monotonicity of functions." },
    { en: "function", forms: ["function", "functions"], vi: "hàm số", ex: "The function is increasing." },
    { en: "increasing", vi: "đồng biến", ex: "The function is increasing on the interval (1, +∞)." },
    { en: "decreasing", vi: "nghịch biến", ex: "The function is decreasing on (−1, 1)." },
    { en: "interval", forms: ["interval", "intervals"], vi: "khoảng", ex: "Find the intervals of monotonicity." },
    { en: "closed interval", vi: "đoạn", ex: "[0, 1] is a closed interval." },
    { en: "half-open interval", vi: "nửa khoảng", ex: "[0, 1) is a half-open interval." },
    { en: "derivative", vi: "đạo hàm", ex: "The derivative is positive." },
    { en: "differentiable", vi: "có đạo hàm", ex: "Let f be differentiable on K." },
    { en: "domain", vi: "tập xác định", ex: "The domain is the set of real numbers." },
    { en: "graph", vi: "đồ thị", ex: "Look at the graph." },
    { en: "sign", vi: "dấu", ex: "Determine the sign of the derivative." },
    { en: "variation table", vi: "bảng biến thiên", ex: "Let's make the variation table." },
    { en: "positive", vi: "dương", ex: "The derivative is positive." },
    { en: "negative", vi: "âm", ex: "The derivative is negative." },
    { en: "defined", vi: "xác định", ex: "The function is defined on K." },
    { en: "for all", vi: "với mọi", ex: "f′(x) > 0 for all x in K." },
    { en: "finitely many", vi: "hữu hạn (một số hữu hạn)", ex: "f′(x) = 0 at only finitely many points." },
    { en: "point", forms: ["point", "points"], vi: "điểm", ex: "Find the points where f′(x) = 0." },
    { en: "does not exist", vi: "không xác định (không tồn tại)", ex: "f′(x) does not exist at x = 0." },
    { en: "determine", vi: "xác định, xét", ex: "Determine the sign of f′(x)." },
    { en: "conclude", vi: "kết luận", ex: "Conclude the intervals of monotonicity." },
    { en: "goes up", forms: ["goes up", "go up"], vi: "đi lên", ex: "The graph goes up." },
    { en: "goes down", forms: ["goes down", "go down"], vi: "đi xuống", ex: "The graph goes down." },
    { en: "from left to right", vi: "từ trái sang phải", ex: "The graph goes up from left to right." },
    { en: "still holds", vi: "vẫn đúng", ex: "The result still holds." },
    { en: "find", vi: "tìm", ex: "Find the derivative." },
    { en: "solve", vi: "giải", ex: "Solve the equation f′(x) = 0." },
    { en: "equation", vi: "phương trình", ex: "Solve the equation." },
    { en: "example", vi: "ví dụ", ex: "Look at this example." },
    { en: "definition", vi: "định nghĩa", ex: "Read the definition." },
    { en: "theorem", vi: "định lí", ex: "Use the theorem." },
    { en: "method", vi: "phương pháp, cách làm", ex: "Follow the method step by step." },
    { en: "step", forms: ["step", "steps"], vi: "bước", ex: "Step 1: find the domain." },
    { en: "warm-up", vi: "khởi động", ex: "Let's start with a warm-up." },
    { en: "practice", vi: "luyện tập", ex: "Practice with this question." },
    { en: "summary", vi: "tổng kết", ex: "Here is the summary." },
    { en: "let", vi: "cho", ex: "Let y = f(x)." }
  ],

  slides: [
    {
      id: "title", kind: "title",
      title: { en: "Monotonicity of functions", vi: "Tính đơn điệu của hàm số" },
      blocks: [
        { type: "p", en: "Mathematics 12 · Bilingual lesson", vi: "Toán 12 · Bài học song ngữ" },
        { type: "hint", en: "Tap any English word to see its meaning.", vi: "Chạm vào từ tiếng Anh bất kì để xem nghĩa." }
      ]
    },
    {
      id: "warmup",
      title: { en: "Warm-up", vi: "Khởi động" },
      blocks: [
        { type: "p", en: "Look at the graph. Where does it go up? Where does it go down?", vi: "Quan sát đồ thị. Đồ thị đi lên ở đâu? Đi xuống ở đâu?" },
        { type: "graph", pack: "mono" }
      ]
    },
    {
      id: "definition",
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
      id: "check1",
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
      id: "theorem",
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
      id: "method",
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
      id: "example",
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
      id: "check2",
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
      id: "say",
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
      id: "summary", kind: "summary",
      title: { en: "Your words", vi: "Từ vựng của em" },
      blocks: [{ type: "mystats" }]
    }
  ]
};
