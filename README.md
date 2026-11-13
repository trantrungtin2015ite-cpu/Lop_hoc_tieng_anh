# Lớp học tiếng Anh

Web hỗ trợ giáo viên tập dạy bằng tiếng Anh. Bản hiện tại gồm phần khảo sát dạng tiết học tương tác: cảnh 1 (chào lớp) và cảnh 2 (giảng trên bảng).

## Chạy thử trên máy

Trang dùng JavaScript dạng module nên phải mở qua một máy chủ nhỏ, không mở thẳng tệp `index.html`:

```
npx serve .
```

Rồi mở địa chỉ hiện ra (thường là `http://localhost:3000`) bằng Chrome. Micro chỉ hoạt động trên `localhost` hoặc trang `https`.

## Đưa lên mạng bằng Vercel

1. Đăng nhập vercel.com bằng tài khoản GitHub.
2. Bấm **Add New → Project**, chọn kho `lop-hoc-tieng-anh`, bấm **Deploy**. Không cần chỉnh cài đặt gì.
3. Vercel cho một đường link `https://...vercel.app`. Mỗi lần có code mới trên GitHub, trang tự cập nhật.

## Cấu trúc

| Tệp | Nội dung |
| --- | --- |
| `index.html` | Khung trang |
| `css/style.css` | Màu sắc, chữ, bố cục |
| `js/app.js` | Các màn hình và luồng đi: màn đầu, cảnh 1, chọn bài, hướng dẫn, cảnh 2, tổng kết |
| `js/content.js` | Nội dung: phương án cảnh 1, bốn gói bài (hình trên bảng, nhãn, lời hướng dẫn, câu mẫu) |
| `js/i18n.js` | Chữ trên giao diện, tiếng Việt và tiếng Anh |
| `js/voice.js` | Micro luôn mở, tự nhận biết nói xong, ghi lại giọng để phát lại, giọng đọc mẫu |
| `js/board.js` | Bảng tương tác: lướt theo đồ thị, chạm điểm, kéo thả nhãn |
| `js/classroom.js` | Hình lớp học và phản ứng của học sinh |
| `js/evaluate.js` | Chấm câu nói (hiện dùng quy tắc, chưa dùng AI) |

## Chỉnh nhanh

- **Thời gian im lặng để coi là nói xong:** `SILENCE_MS` trong `js/voice.js` (mặc định 1800 mili giây).
- **Thêm hoặc sửa bài:** thêm một phần tử vào `PACKS` trong `js/content.js`.
- **Sửa chữ trên giao diện:** `js/i18n.js`.

## Giới hạn hiện tại

- Nghe liên tục chạy tốt nhất trên Chrome (Android và máy tính). Trình duyệt không hỗ trợ sẽ chuyển sang gõ chữ.
- Máy nghe theo tiếng Anh, nên câu nói tiếng Việt có thể bị ghi sai chữ.
- Chưa có AI chấm câu, chưa lưu kết quả lên máy chủ.
