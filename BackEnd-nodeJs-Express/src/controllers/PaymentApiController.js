const QRCode = require('qrcode');
const { createPaymentService, checkPaymentService } = require("../services/paymentService")

const paymentCreate = async (req, res) => {
    let { vnp_Amount, orderInfo, vnp_ReturnUrl } = req.query;
    vnp_Amount = Number(vnp_Amount);

    const vnp_IpAddr = req.ip;
    console.log(vnp_IpAddr);

    const { success, vnpUrl } = await createPaymentService({ vnp_Amount, orderInfo, vnp_ReturnUrl, vnp_IpAddr });
    const qrImage = await generateQrFromUrl(vnpUrl);
    return res.status(201).json({
        success: true,
        url: vnpUrl,
        qr: qrImage, // Đây là base64
    });
}

function getClientIp(req) {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }
    return req.socket.remoteAddress;
}

const generateQrFromUrl = async (url) => {
    try {
        const qrImage = await QRCode.toDataURL(url);
        return qrImage;
    } catch (error) {
        console.error('Lỗi tạo QR:', error);
        return null;
    }
};

const checkPayment = async (req, res) => {
    try {
        const { vnp_ResponseCode, vnp_OrderInfo } = req.query;
        if (vnp_ResponseCode === '00') {
            return res.status(200).json({ message: "Thanh toán thành công" });
        }
        return res.status(200).json({ message: "Thanh toán không thành công" });
    } catch (error) {
        console.error('Lỗi xử lý returnUrl:', error);
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
}

module.exports = {
    paymentCreate,
    checkPayment
}