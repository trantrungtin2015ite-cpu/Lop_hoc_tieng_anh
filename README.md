# Lớp học song ngữ

Bài giảng Toán bằng tiếng Anh, có tiếng Việt đi kèm. Học sinh mở trên điện thoại hoặc iPad, chạm vào từ tiếng Anh để xem nghĩa.

## Các trang

| Địa chỉ | Nội dung |
| --- | --- |
| `/` | Trang chủ: danh sách bài giảng |
| `/lesson.html?bai=don-dieu` | Bài Tính đơn điệu của hàm số (học sinh) |
| `/lesson.html?bai=don-dieu&gv` | Cùng bài, chế độ giáo viên: thêm nút mã QR mời học sinh |
| `/khao-sat/` | Bản thử khảo sát tập dạy bằng tiếng Anh (cảnh 1 và 2) |

## Bài giảng hoạt động thế nào

- **Máy chiếu, máy tính, iPad xoay ngang:** các phần nằm trên một mặt phẳng lớn, chuyển phần thì màn hình phóng và lia tới (kiểu Prezi). Nút lưới để xem toàn bài. Phím mũi tên trái, phải để chuyển.
- **Điện thoại:** mỗi phần là một thẻ, vuốt lên xuống.
- **EN / EN + VI / VI:** chọn hiện tiếng Anh, song ngữ hoặc tiếng Việt.
- **Chạm vào từ tiếng Anh:** hiện nghĩa. Từ có trong bảng thuật ngữ của bài (gạch chân chấm) lấy nghĩa đã duyệt; từ khác dùng dịch máy.
- **Nút Việt → Anh:** học sinh gõ tiếng Việt để dịch sang tiếng Anh, không giới hạn số lần.
- **Phần cuối "Từ vựng của em":** các từ em đã tra, câu đã dịch, kết quả câu hỏi. Lưu trên máy của em.

## Sửa nội dung bài

Toàn bộ chữ của bài nằm trong `js/lesson/data-don-dieu.js`:

- `glossary`: bảng thuật ngữ Anh – Việt.
- `slides`: các phần của bài. Mỗi đoạn có `en` và `vi`. Công thức viết giữa hai dấu `$...$` theo cú pháp LaTeX.

## Cấu trúc mã

| Tệp | Việc |
| --- | --- |
| `lesson.html`, `css/lesson.css` | Khung và giao diện bài giảng |
| `js/lesson/app.js` | Trình chiếu, chuyển phần, chạm từ, khung dịch, câu hỏi, thống kê cuối bài |
| `js/lesson/words.js` | Tách từ để chạm, hiển thị công thức, tra nghĩa, dịch |
| `js/lesson/stats.js` | Ghi lại từ học sinh đã tra |
| `js/lesson/board.js`, `pack-mono.js` | Đồ thị tương tác ở phần khởi động |

## Giới hạn hiện tại

- Dịch máy dùng dịch vụ miễn phí MyMemory, chất lượng chưa bằng bảng thuật ngữ và có giới hạn lượt mỗi ngày.
- Thống kê chỉ nằm trên máy từng học sinh; gửi về máy giáo viên là bước tiếp theo (cần máy chủ).
- Máy giáo viên chuyển phần chưa kéo máy học sinh chuyển theo.

## Chạy thử trên máy

```
npx serve .
```
