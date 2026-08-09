// Import the Nodemailer library
const nodemailer = require('nodemailer');

module.exports.sendMail = (userGmail, subject, text) => {
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use false for STARTTLS; true for SSL on port 465
    auth: {
      user: process.env.GMAIL,
      pass: process.env.APP_PASSWORD,
    }
  });

  const defaultHtmlTemplate = `<!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mã xác thực OTP</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #f8fafc; /* Nền xám nhạt tinh tế */
                color: #334155;
                -webkit-font-smoothing: antialiased;
            }
            table {
                border-collapse: collapse;
            }
            .wrapper {
                background-color: #f8fafc;
                padding: 40px 16px;
            }
            .container {
                max-width: 520px;
                margin: 0 auto;
                background-color: #ffffff; /* Card trắng tinh tế */
                border-radius: 12px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                border: 1px solid #e2e8f0;
            }
            .content {
                padding: 40px 32px;
            }
            .logo-area {
                text-align: center;
                margin-bottom: 28px;
            }
            .logo-text {
                font-size: 20px;
                font-weight: 800;
                letter-spacing: 1px;
                color: #0284c7; /* Màu xanh chủ đạo hiện đại */
            }
            .title {
                font-size: 20px;
                font-weight: 700;
                color: #0f172a;
                text-align: center;
                margin-bottom: 20px;
            }
            .desc {
                font-size: 15px;
                color: #475569;
                line-height: 1.6;
                margin-bottom: 24px;
            }
            .otp-box {
                text-align: center;
                margin: 32px 0;
            }
            .otp-label {
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #64748b;
                margin-bottom: 12px;
                font-weight: 600;
            }
            
            /* CHỈNH SỬA CHO DÒNG OTP: TO, ĐẬM, ĐÓNG KHUNG, CĂN GIỮA */
            .otp-code {
                font-size: 38px;
                font-weight: 800;
                color: #0284c7; /* Màu xanh nổi bật */
                font-family: 'Courier New', Courier, monospace;
                
                display: inline-block;
                margin: 0 auto;
                padding: 12px 36px;
                border: 2.5px solid #0284c7; /* Đóng khung đậm sắc nét */
                border-radius: 8px;
                background-color: #f0f9ff; /* Nền xanh nhẹ bên trong khung */
                
                letter-spacing: 6px;
                text-indent: 6px; /* Giúp căn giữa chữ số chuẩn tuyệt đối */
            }
            
            .safety-banner {
                background-color: #fef2f2; /* Nền đỏ nhạt cảnh báo */
                border-radius: 8px;
                padding: 14px 16px;
                margin-top: 28px;
                margin-bottom: 28px;
                border-left: 4px solid #ef4444; /* Vạch đỏ điểm nhấn */
            }
            .safety-text {
                font-size: 13px;
                color: #991b1b;
                line-height: 1.5;
                margin: 0;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #94a3b8;
                border-top: 1px solid #f1f5f9;
                padding-top: 20px;
                margin-top: 24px;
                line-height: 1.5;
            }
            .footer a {
                color: #0284c7;
                text-decoration: none;
                font-weight: 500;
            }
        </style>
    </head>
    <body>
        <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td align="center">
                    <table class="container" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                            <td class="content">
                                <!-- LOGO -->
                                <div class="logo-area">
                                    <span class="logo-text">BRANDNAME</span>
                                </div>
                                
                                <!-- TIÊU ĐỀ -->
                                <div class="title">Mã xác thực thay đổi mật khẩu</div>
                                
                                <!-- NỘI DUNG CHÍNH -->
                                <div class="desc">
                                    Xin chào,<br>
                                    Hệ thống nhận được yêu cầu thay đổi mật khẩu từ tài khoản của bạn. Vui lòng nhập mã OTP dưới đây để hoàn tất quy trình:
                                </div>
                                
                                <!-- KHỐI OTP ĐÃ ĐƯỢC THIẾT KẾ LẠI -->
                                <div class="otp-box">
                                    <div class="otp-label">Mã OTP của bạn</div>
                                    <div class="otp-code">${text}</div>
                                </div>
                                
                                <div class="desc" style="text-align: center; margin-bottom: 24px; font-size: 14px;">
                                    Mã có hiệu lực trong vòng <span style="color: #0f172a; font-weight: bold;">5 phút</span>.
                                </div>
                                
                                <!-- CẢNH BÁO BẢO MẬT -->
                                <div class="safety-banner">
                                    <p class="safety-text">
                                        <strong>CẢNH BÁO:</strong> Tuyệt đối KHÔNG chia sẻ mã này cho bất kỳ ai. Nhân viên hệ thống sẽ không bao giờ yêu cầu bạn cung cấp OTP. Nếu không phải bạn yêu cầu, hãy bỏ qua email này.
                                    </p>
                                </div>
                                
                                <!-- FOOTER -->
                                <div class="footer">
                                    <p>Đây là email tự động, vui lòng không phản hồi trực tiếp thư này.</p>
                                    <p>© 2026 BrandName Công Ty. All Rights Reserved. | <a href="#">Trung tâm hỗ trợ</a></p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
  // Configure the mailoptions object
  const mailOptions = {
    from: process.env.GMAIL,
    to: userGmail,
    subject: subject,
    text: text,
    html: defaultHtmlTemplate,
  };

  // Send the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  });
}