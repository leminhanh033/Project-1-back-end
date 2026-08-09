const tourmodel = require("../../models/admin/tour.model");
const provincemodel = require("../../models/admin/province.model");
const ordermodel = require("../../models/admin/order.model");
const moment = require("moment");

const { otpCreate } = require("../../helpers/otp.helper");

module.exports.cart = async (req, res) => {
  res.render('client/pages/cart.pug', { title: "Giỏ hàng" });
}

module.exports.getData = async (req, res) => {
  try {
    const cart = req.body.cart;
    let listTour = []
    for (const item of cart) {
      const tour = await tourmodel.findOne({
        _id: item.id,
        deleted: false,
        state: "active",
      })
      const province = await provincemodel.findOne({
        _id: item.destination,
      })
      item.destinationName = province.name;
      if (tour) {
        listTour.push({
          ...item,
          detail: {
            name: tour.name,
            departureDate: tour.departureDate ? moment(tour.departureDate).format("DD/MM/YYYY") : "",
            time: tour.time,

            avatar: tour.avatar,

            newAdult: tour.newAdult,
            newChild: tour.newChild,
            newBaby: tour.newBaby,

            remainAdult: tour.remainAdult,
            remainChild: tour.remainChild,
            remainBaby: tour.remainBaby,
          }
        });
      }
    }
    res.json({
      code: "success",
      message: "Truy xuất dữ liệu thành công",
      listTour,
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi",
    })
  }
}


