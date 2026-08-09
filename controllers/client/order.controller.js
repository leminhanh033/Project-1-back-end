const tourmodel = require("../../models/admin/tour.model");
const ordermodel = require("../../models/admin/order.model");

const moment = require("moment");
const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const { v1: uuidv1 } = require('uuid');
// Node v10.15.3
const express = require('express'); // npm install express
const bodyParser = require('body-parser'); // npm install body-parser
const app = express();

const { otpCreate } = require("../../helpers/otp.helper");

module.exports.customerInfor = async (req, res) => {
  try {
    //code
    let code = "";
    while (true) {
      code = "DH" + otpCreate(10);
      const order = await ordermodel.findOne({
        code: code,
      })
      if (!order) {
        break;
      }
    }
    //tour,subtotal
    let subtotal = 0;
    let discount = 0;

    let items = []
    for (const item of req.body.listProduct) {
      const tour = await tourmodel.findOne({
        _id: item.id,
        deleted: false,
        state: "active",
      })
      if (tour) {
        if (item.quantity.adult > tour.remainAdult || item.quantity.child > tour.remainChild ||
          item.quantity.baby > tour.remainBaby) {
          res.json({
            code: 'error',
            message: "Số lượng hành khách vượt quá số lượng còn lại",
          })
          return;
        }
        await tourmodel.updateOne({
          _id: item.id,
        }, {
          remainAdult: tour.remainAdult - item.quantity.adult,
          remainChild: tour.remainChild - item.quantity.child,
          remainBaby: tour.remainBaby - item.quantity.baby,
        })
        items.push({
          id: item.id,
          name: tour.name,
          avatar: tour.avatar,

          quantityAdult: item.quantity.adult,
          quantityChild: item.quantity.child,
          quantityBaby: item.quantity.baby,

          priceAdult: tour.newAdult,
          priceChild: tour.newChild,
          priceBaby: tour.newBaby,

          locationFrom: item.destination,
          departureDate: tour.departureDate,
          time: tour.time,
        })
        subtotal += item.quantity.adult * tour.newAdult + item.quantity.child * tour.newChild
          + item.quantity.baby * tour.newBaby;

      }
      else {
        res.json({
          code: "error",
          message: "Tour được chọn không hợp lệ"
        })
        return;
      }
    }
    const order = {
      code: code,
      fullname: req.body.fullname,
      phone: req.body.phone,
      note: req.body.note,
      items: items,

      total: subtotal - discount,
      subtotal: subtotal,
      paymentMethod: req.body.paidMethod,
      paymentStatus: "unpaid",

      status: "active"
    }
    const newOrder = new ordermodel(order);
    await newOrder.save();
    res.json({
      code: "success",
      message: "Tạo đơn hàng thành công",
      codeTour: code,
    })
  }
  catch (error) {
    console.log(error);
    res.json({
      code: 'error',
      message: "Đã xảy ra lỗi",
    })
  }
}

module.exports.orderSuccessPage = async (req, res) => {
  const order = await ordermodel.findOne({
    code: req.query.code,
    phone: req.query.phone,

    deleted: false,
    status: "active",
  })
  if (!order) {
    res.redirect("/");
    return;
  }
  //paymentMethod
  if (order.paymentMethod == "money") {
    order.paymentMethodName = "Thanh toán bằng tiền mặt"
  }
  else if (order.paymentMethod == "momo") {
    order.paymentMethodName = "Thanh toán bằng momo"
  }
  else if (order.paymentMethod == "zalopay") {
    order.paymentMethodName = "Thanh toán bằng Zalopay"
  }
  else if (order.paymentMethod == "bank") {
    order.paymentMethodName = "Chuyển khoản ngân hàng"
  }
  //statusFormat
  if (order.status == "active") {
    order.statusFormat = "Đang hoạt động"
  }
  else if (order.status == "inactive") {
    order.statusFormat = "Dừng hoạt động"
  }
  if (order.status == "pending") {
    order.statusFormat = "Chờ duyệt"
  }
  //createdAtFormat
  if (order.createdAt) {
    order.createdAtFormat = moment(order.createdAt).format("hh:mm - DD/MM/YYYY");
  }
  res.render("client/pages/order-success", {
    tittle: "Thông tin đơn hàng",
    order: order,
  })
}

module.exports.zalopay = async (req, res) => {
  try {
    const code = req.query.code;
    const phone = req.query.phone;
    const orderDetail = await ordermodel.findOne({
      code: code,
      phone: phone,
      deleted: false,
      paymentMethod: "zalopay",
      paymentStatus: "unpaid",
      status: "active",
    })
    if (!orderDetail) {
      res.redirect("/");
      return;
    }
    // APP INFO
    const config = {
      app_id: process.env.ZALO_APP_ID,
      key1: process.env.ZALO_KEY1,
      key2: process.env.ZALO_KEY2,
      endpoint: process.env.ZALO_ENDPOINT,
    };

    const embed_data = {
      redirecturl: `${process.env.DOMAIN}/order/success?code=${code}&phone=${phone}`,
    };

    const items = [{}];

    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: `${code}-${phone}`,
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: orderDetail.total,
      description: `Thanh toan don hang co ma #${code}`,
      bank_code: "",
      callback_url: `${process.env.DOMAIN}/order/payment/success/zalopay`,
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.endpoint, null, { params: order })
    res.redirect(response.data.order_url);
  }
  catch (error) {
    console.log(error);
  }
}

module.exports.zalopaySuccessPost = async (req, res) => {
  const config = {
    key2: process.env.ZALO_KEY2,
  };


  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    }
    else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      const [code, phone] = dataJson["app_user"].split("-");
      await ordermodel.updateOne({
        code: code,
        phone: phone,
        deleted: false,
        paymentMethod: "zalopay",
        paymentStatus: "unpaid",
        status: "active",
      }, {
        paymentStatus: "paid",
      })
      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
}

module.exports.bank = async (req, res) => {
  const code = req.query.code;
  const phone = req.query.phone;
  const orderDetail = await ordermodel.findOne({
    code: code,
    phone: phone,
    deleted: false,
    paymentMethod: "bank",
    paymentStatus: "unpaid",
    status: "active",
  })
  if (!orderDetail) {
    res.redirect("/");
    return;
  }
  process.env.TZ = 'Asia/Ho_Chi_Minh';

  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');

  let ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let config = require('config');

  let tmnCode = process.env.VNP_TMNCODE;
  let secretKey = process.env.VNP_HASHSECRECT;
  let vnpUrl = process.env.VNP_URL;
  let returnUrl = `${process.env.DOMAIN}/order/payment/success/bank`;
  let orderId = `${code}-${phone}-${Date.now()}`;
  let amount = orderDetail.total;
  let bankCode = "";

  let locale = 'vn';

  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = `Thanh toan cho don hang ${code}, tong so tien la ${orderDetail.total}`;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }


  vnp_Params = sortObject(vnp_Params);

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  res.redirect(vnpUrl)
}

module.exports.bankSuccessPost = async (req, res) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let config = require('config');
  let tmnCode = process.env.VNP_TMNCODE;
  let secretKey = process.env.VNP_HASHSECRECT;

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    const [code, phone] = vnp_Params['vnp_TxnRef'].split("-");
    await ordermodel.updateOne({
      code: code,
      phone: phone,
      deleted: false,
      paymentMethod: "bank",
      paymentStatus: "unpaid",
      status: "active",
    }, {
      paymentStatus: "paid",
    })
    res.redirect(`${process.env.DOMAIN}/order/success?code=${code}&phone=${phone}`);
  } else {
    res.redirect(`${process.env.DOMAIN}/order/success?code=${code}&phone=${phone}`);
    res.render('success', { code: '97' })
  }
}

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports.momo = async (request, response) => {
  const code = request.query.code;
  const phone = request.query.phone;
  const orderDetail = await ordermodel.findOne({
    code: code,
    phone: phone,
    deleted: false,
    paymentMethod: "momo",
    paymentStatus: "unpaid",
    status: "active",
  })
  if (!orderDetail) {
    response.redirect("/");
    return;
  }
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  var accessKey = 'F8BBA842ECF85';
  var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  var orderInfo = `Thanh toan don hang ma ${code}`;
  var partnerCode = 'MOMO';
  var redirectUrl = `${process.env.DOMAIN}/order/success?code=${code}&phone=${phone}`;
  var ipnUrl = `${process.env.DOMAIN}/order/payment/success/momo`;
  var requestType = "payWithMethod";
  var amount = orderDetail.total;
  var orderId = `${code}-${phone}-${Date.now()}`;
  var requestId = orderId;
  var extraData = '';
  var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
  var orderGroupId = '';
  var autoCapture = true;
  var lang = 'vi';

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
  //puts raw signature
  //signature
  const crypto = require('crypto');
  var signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature
  });
  //Create the HTTPS objects
  const https = require('https');
  const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    }
  }
  //Send the request and get the response
  const req = https.request(options, res => {
    res.setEncoding('utf8');
    res.on('data', (body) => {
      response.redirect(JSON.parse(body).shortLink);
    });
    res.on('end', () => {
    });
  })

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });
  // write data to request body
  req.write(requestBody);
  req.end();
}

module.exports.momoSuccessPost = async (req, res) => {
  if (req.body.resultCode == 0) {
    const [code,phone]=req.body.orderId.split("-");
    await ordermodel.updateOne({
      code: code,
      phone: phone,
      deleted: false,
      paymentMethod: "momo",
      paymentStatus: "unpaid",
      status: "active",
    },{
      paymentStatus: "paid",
    })
  }
}