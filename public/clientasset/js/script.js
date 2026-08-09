const notyf = new Notyf({
    duration: 2000,
    position: { x: 'right', y: 'top' }
});

const alertMessage = (data) => {
    sessionStorage.setItem("notify", JSON.stringify(data))
}
const notify = JSON.parse(sessionStorage.getItem("notify"));
if (notify) {
    if (notify.code == "error") {
        notyf.error(notify.message);
    }
    if (notify.code == "success") {
        notyf.success(notify.message);
    }
    sessionStorage.removeItem("notify");
}

let menu = document.querySelector(".header .inner-menu");
let buttonmenu = document.querySelector(".inner-wrap-header .icon-menu");
buttonmenu.addEventListener("click", () => {
    menu.classList.add("active");
})
//overlay
let overlay = menu.querySelector(".overlay");
overlay.addEventListener("click", () => {
    menu.classList.remove("active");
})
let icondown = menu.querySelectorAll(".content .inner-title>i");
icondown.forEach((item) => {
    item.addEventListener("click", () => {
        let parent = item.closest("div").closest(".inner-item");
        // console.log(parent);  
        parent.classList.toggle("active");
    })
})

// section-1 inner-suggest-address
let input = document.querySelector(".section1 .inner-input-address .inner-input-title input");
if (input) {
    let parent = input.closest(".inner-input-address");
    input.addEventListener("focus", () => {
        parent.classList.add("active");
    })

    input.addEventListener("blur", () => {
        parent.classList.remove("active");
    })

    let listitem = document.querySelectorAll(".section1 .inner-input-address .inner-suggest-address .item-suggest");
    listitem.forEach((item) => {
        item.addEventListener("mousedown", () => {
            let title = item.querySelector(".item-content div:first-child");
            input.value = title.innerHTML;
        })
    })
}

// section-1 inner-suggest-amount
let amount = document.querySelector(".section1 .inner-input-amount");
if (amount) {
    let inputamount = amount.querySelector(".inner-input-title input");
    inputamount.addEventListener("focus", () => {
        amount.classList.add("active");
    })
    document.addEventListener("click", (event) => {
        if (!amount.contains(event.target)) {
            amount.classList.remove("active");
        }
    })
    const update = () => {
        let boxnumber = amount.querySelectorAll(".number");
        let listnumber = [];
        boxnumber.forEach((item) => {
            listnumber.push(item.innerHTML);
        })
        return `NL:${listnumber[0]} TE:${listnumber[1]} EB:${listnumber[2]}`
    }
    let increase = amount.querySelectorAll(".inner-increase");
    increase.forEach((item) => {
        item.addEventListener("click", () => {
            let innernumber = item.closest(".inner-change").querySelector(".number");
            let value = parseInt(innernumber.innerHTML);
            innernumber.innerHTML = value + 1;
            let inputamount = amount.querySelector(".inner-input-title input");
            inputamount.value = update();
        })
    })
    let decrease = amount.querySelectorAll(".inner-decrease");
    decrease.forEach((item) => {
        item.addEventListener("click", () => {
            let innernumber = item.closest(".inner-change").querySelector(".number");
            let value = parseInt(innernumber.innerHTML);
            if (value - 1 >= 0) {
                innernumber.innerHTML = value - 1;
                let inputamount = amount.querySelector(".inner-input-title input");
                inputamount.value = update();
            }
        })
    })
}


//section-2 inner-time

let clock = document.querySelector("[expireclock]");
if (clock) {
    const updatetime = () => {
        let date = new Date(clock.getAttribute("expireclock"));
        let now = new Date();
        let time = date - now;
        if (time > 0) {
            let nodate = Math.floor(time / 1000 / (60 * 60 * 24));
            let nohour = Math.floor((time / 1000 - nodate * 24 * 60 * 60) / 3600);
            let nominute = Math.floor((time / 1000 - nodate * 24 * 60 * 60 - nohour * 3600) / 60);
            let nosecond = Math.floor(time / 1000 - nodate * 24 * 60 * 60 - nohour * 60 * 60 - nominute * 60);
            console.log(`${nodate} ${nohour} ${nominute} ${nosecond}`)
            let numbertime = clock.querySelectorAll(".inner-time-item .number");
            numbertime[0].innerHTML = nodate;
            numbertime[1].innerHTML = nohour;
            numbertime[2].innerHTML = nominute;
            numbertime[3].innerHTML = nosecond;
        }
        else {
            clearInterval(setInterval(updatetime, 1000));
        }

    }
    setInterval(updatetime, 1000);
}
//danh sach tour button filter
let leftpart = document.querySelector(".inner-left");
let buttonfilter = document.querySelector(".inner-right .filter");
if (buttonfilter) {
    buttonfilter.addEventListener("click", () => {
        leftpart.classList.add("active");
    })
    let overlay = leftpart.querySelector(".overlay");
    overlay.addEventListener("click", () => {
        leftpart.classList.remove("active");
    })
}
//chitiettour button xem tat ca
let buttonreadmore = document.querySelector(".section10 .read-more button");
if (buttonreadmore) {
    buttonreadmore.addEventListener("click", () => {
        let content = document.querySelector(".section10 .inf-tour .inner-content");
        content.classList.toggle("active");
        if (content.classList.contains("active")) {
            buttonreadmore.innerHTML = "Thu gọn";
        }
        else {
            buttonreadmore.innerHTML = "Xem tất cả";
        }
    })
}

//khoi tao va su dung AOS cho trang chu
AOS.init();

//swiper trong section-2
const swipersection2 = document.querySelector(".section2 .inner-swiper");
if (swipersection2) {
    var swiper = new Swiper(" .inner-swiper", {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        freeMode: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        autoplay: {
            delay: 2000,
            disableOnInteraction: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
        },
    });
}
const listimg = document.querySelector(".section3 .list-img");
if (listimg) {
    var swiper = new Swiper(".section3 .list-img", {
        slidesPerView: 3,
        spaceBetween: 30,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        loop: true,

        autoplay: {
            delay: 2000,
            disableOnInteraction: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            576: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
        },
    });
}

//swiper section10
const swipersection10 = document.querySelector(".section10 .swiper.inner-img");
if (swipersection10) {
    var swiper = new Swiper(".section10 .inner-img", {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
        loop: true,
        breakpoints: {
            0: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            576: {
                slidesPerView: 4,
                spaceBetween: 20,
            },
        }
    });
    var swiper2 = new Swiper(".section10 .inner-thumb", {
        spaceBetween: 10,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        thumbs: {
            swiper: swiper,
        },
        loop: true,
    });
}
//zoom in section 10
const imagezoom = document.querySelector(".section10 .swiper.inner-thumb .swiper-wrapper");
if (imagezoom) {
    new Viewer(imagezoom);
}

const image1 = document.querySelector(".section10 .inner-left .inf-tour img");
if (image1) {
    new Viewer(image1);
}

const image2 = document.querySelectorAll(".section10 .inner-left .inner-item-tour .inner-content img");
image2.forEach((item) => {
    if (item) {
        new Viewer(item);
    }
})

//validate form
const emailform = document.querySelector('#email-form');
if (emailform) {
    const validator = new JustValidate('#email-form');
    validator
        .addField(document.querySelector('#email'), [
            {
                rule: 'required',
                errorMessage: 'Vui lòng nhập email',
            },
            {
                rule: 'email',
                errorMessage: 'Email không hợp lệ',
            },
        ])
        .onSuccess((event) => {
            const inputvalue = event.target.querySelector("input").value;
            fetch(`/email-for-information`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: inputvalue,
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        notyf.error(data.message)
                    }
                    if (data.code == "success") {
                        notyf.success(data.message);
                        emailform.querySelector("input").value = ""
                    }
                })
        })
}

const couponform = document.querySelector('#coupon-form');
if (couponform) {
    const validator = new JustValidate('#coupon-form');
    validator.addField('#coupon-input', [
        {
            rule: 'required',
            errorMessage: 'Vui lòng nhập mã',
        },
    ])
        .onSuccess((event) => {
            const inputvalue = event.target.querySelector("input").value;
            console.log(inputvalue);
        })
}

const custominfor = document.querySelector("#custom-infor");
if (custominfor) {
    const validator = new JustValidate('#custom-infor');
    validator.addField('#name', [
        {
            rule: 'required',
            errorMessage: 'Vui lòng nhập họ tên',
        },
    ])
        .addField('#phone', [
            {
                rule: 'required',
                errorMessage: 'Vui lòng nhập số điện thoại',
            },
            {
                rule: 'customRegexp',
                value: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
                errorMessage: 'Số điện thoại không hợp lệ'
            },
        ])
        .onSuccess((event)=>{
            const fullname=event.target.name.value;
            const phone=event.target.phone.value;
            const note=event.target.note.value;

            const inputPayMethod=document.querySelector(".payMethod:checked");
            const paidMethod=inputPayMethod.value;

            const cart=JSON.parse(localStorage.getItem("cart"));
            const listProduct=cart.filter(item=>item.checked==true);
            if(listProduct.length<=0){
                notyf.error("Vui lòng chọn ít nhất một sản phẩm");
            }

            fetch(`/order/infor`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/JSON",
                },
                body:(JSON.stringify({
                    fullname:fullname,
                    phone:phone,
                    note:note,
                    paidMethod:paidMethod,
                    listProduct:listProduct,
                }))
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.code=="error"){
                    notyf.error(data.message)
                }
                if(data.code=="success"){
                    const cart=JSON.parse(localStorage.getItem("cart"));
                    const newCart=cart.filter(item=>item.checked==false);
                    localStorage.setItem("cart",JSON.stringify(newCart));
                    drawCart();
                    alertMessage(data);
                    window.location.href=(`/order/success?code=${data.codeTour}&phone=${phone}`);
                }
            })
        })
}

const filterButton = document.querySelector("[filterButton]");
if (filterButton) {
    const url = new URL(`${window.location.origin}/search`);
    const currenturl = new URL(window.location.href);
    filterButton.addEventListener("click", () => {
        const filter = document.querySelectorAll("[filter]");
        filter.forEach(item => {
            // console.log(item.value);
            const name = item.getAttribute("filter");
            if (item.value) {
                url.searchParams.set(name, item.value)
            }
            else {
                url.searchParams.delete(name);
            }
        })
        const category = filterButton.getAttribute("category") || currenturl.searchParams.get("category");
        if (category) {
            url.searchParams.set("category", category);

        }
        window.location.href = url.href;


    })
}

const pages = document.querySelectorAll(".inner-breadcumb .page");
if (pages && pages.length > 0) {
    const url = new URL(window.location.href);
    pages.forEach(item => {
        item.addEventListener("click", () => {
            url.searchParams.set("page", item.getAttribute("page"))
            window.location.href = url.href

        })
        // console.log(url)
    })
}

//inner-right Tour detail
const numberCustomer = document.querySelectorAll(".section10 .inner-right .inner-section-4 .infor");
if (numberCustomer && numberCustomer.length > 0) {
    const totalPrice = document.querySelector(".section10 .inner-right .total .hl div")
    numberCustomer.forEach(item => {
        const input = item.querySelector("input");
        const max = parseInt(item.querySelector("input").getAttribute("max"));
        const inputlabel = item.querySelector(".numberLabel");
        input.addEventListener("change", () => {
            let value = input.value;
            if (value < 0) {
                notyf.error("Số lượng khách hàng không hợp lệ")
                value = 0;
            }
            if (value > max) {
                notyf.error(`Chỉ được chọn ${max} hành khách`);
                value = max;
            }
            input.value = value
            inputlabel.innerHTML = value;
            //Cập nhật totalPrice
            let total = 0;
            numberCustomer.forEach(element => {
                const number = element.querySelector("input").value;
                const price = element.querySelector("[price]").getAttribute("price");
                total += number * price;
            })
            totalPrice.innerHTML = total.toLocaleString("vi-VN");
            //end Cập nhật totalPrice
        })
    })
}

//Khởi tạo cart trong local Storage
const cart = localStorage.getItem("cart");
if (!cart) {
    localStorage.setItem("cart", JSON.stringify([]))
}

const addCart = document.querySelector(".add-cart");
if (addCart) {
    addCart.addEventListener("click", () => {
        const destination = document.querySelector("#departFrom").value;
        const adult = parseInt(document.querySelector("[adult]").value);
        const child = parseInt(document.querySelector("[child]").value);
        const baby = parseInt(document.querySelector("[baby]").value);
        const id = addCart.getAttribute("tourID");

        const cart = JSON.parse(localStorage.getItem("cart"));
        const itemIndex = cart.findIndex(item => item.id == id)
        if (itemIndex != -1) {
            cart[itemIndex].destination=destination;
            cart[itemIndex].quantity.adult += adult;
            cart[itemIndex].quantity.child += child;
            cart[itemIndex].quantity.baby += baby;
        }
        else {
            cart.push({
                id: id,
                checked:false,
                destination: destination,
                quantity: {
                    adult: adult,
                    child: child,
                    baby: baby,
                }
            })
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        notyf.success("Thêm vào giỏ hàng thành công");
        drawCartIcon();
    });
}

const drawCartIcon = () => {
    const orderNumber = document.querySelector(".order-number");
    if (orderNumber) {
        const cart = JSON.parse(localStorage.getItem("cart"));
        orderNumber.innerHTML = cart.length;
    }
}
drawCartIcon();

const drawCart=()=>{
    const cart = JSON.parse(localStorage.getItem("cart"));
    fetch("/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/JSON",
        },
        body: JSON.stringify({
            cart: cart,
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.code == "error") {
                notyf.error(data.message)
            }
            if (data.code == "success") {
                const listTour = data.listTour;
                //Vẽ ra các đơn hàng
                const htmlArray=listTour.map(tour=>{
                    return(`<div class="inner-product" tourID=${tour.id}>
                        <div class="inner-sign">
                            <i class="fa-solid fa-x"></i>
                            <input type="checkbox" ${tour.checked?"checked":""}>
                        </div>
                        <div class="infor-product">
                            <img src=${tour.detail.avatar} alt="">
                            <div class="inner-infor">
                                <div class="infor-label">${tour.detail.name}</div>
                                <div>
                                    <div>Mã Tour: <b>123456789</b></div>
                                    <div>Ngày Khởi Hành: <b> ${tour.detail.departureDate}</b></div>
                                    <div>Khởi hành tại: <b> ${tour.destinationName}</b></div>
                                    <div>Thời Gian: <b> ${tour.detail.time}</b></div>
                                </div>
                            </div>
                        </div>
                        <div class="inner-section-4">
                            <div class="inner-section-label">Số Lượng Hành Khách</div>
                            <div class="infor">
                                <div class="label">Người lớn:</div>
                                <input type="number" min=0 max=${tour.detail.remainAdult} value=${tour.quantity.adult} adult>
                                <div class="price">
                                    <span class="numberLabel">${tour.quantity.adult}</span>
                                    <span> x </span>
                                    <span class="hl">${tour.detail.newAdult.toLocaleString("vi-VN")}</span>
                                </div>
                            </div>
                            <div class="infor">
                                <div class="label">Trẻ em:</div>
                                <input type="number" min=0 max=${tour.detail.remainChild} value=${tour.quantity.child} child>
                                <div class="price">
                                    <span class="numberLabel">${tour.quantity.child}</span>
                                    <span> x </span>
                                    <span class="hl">${tour.detail.newChild.toLocaleString("vi-VN")}</span>
                                </div>
                            </div>
                            <div class="infor">
                                <div class="label">Em bé:</div>
                                <input type="number" min=0 max=${tour.detail.remainBaby} value=${tour.quantity.baby} baby>
                                <div class="price">
                                    <span class="numberLabel">${tour.quantity.baby}</span>
                                    <span> x </span>
                                    <span class="hl">${tour.detail.newBaby.toLocaleString("vi-VN")}</span>
                                </div>
                            </div>
                        </div>
                    </div>`)
                })
                listProduct.innerHTML=htmlArray.join("");
                caculatePrice();

                //Cập nhật lại
                const newListTour=listTour.map(item=>{
                    delete item.detail;
                    return item;
                })
                localStorage.setItem("cart",JSON.stringify(newListTour));
                drawCartIcon();     
                
                const quantityProductCart=document.querySelectorAll(".section11 .list-product .inner-product");
                if(quantityProductCart&&quantityProductCart.length>0){
                    quantityProductCart.forEach(item=>{
                        const id=item.getAttribute("tourID");

                        //Thuộc tính tăng giảm số lượng
                        const inforList=item.querySelectorAll(".infor");
                        inforList.forEach(infor=>{
                            const input=infor.querySelector("input");
                            const max = parseInt(input.getAttribute("max"));
                            const inputlabel = infor.querySelector(".numberLabel");
                            
                            input.addEventListener("change",()=>{
                                let value = input.value;
                                if (value < 0) {
                                    notyf.error("Số lượng khách hàng không hợp lệ")
                                    value = 0;
                                }
                                if (value > max) {
                                    notyf.error(`Chỉ được chọn ${max} hành khách`);
                                    value = max;
                                }
                                input.value = value
                                inputlabel.innerHTML = value;
                                //Cập nhật lại cart
                                const newCart=JSON.parse(localStorage.getItem("cart"));
                                const indexProduct=newCart.findIndex(item=>item.id==id);
                                
                                if(indexProduct!=-1){
                                    const adult = parseInt(item.querySelector("[adult]").value);
                                    const child = parseInt(item.querySelector("[child]").value);
                                    const baby = parseInt(item.querySelector("[baby]").value);
                                    newCart[indexProduct].quantity={
                                        adult:adult,
                                        child:child,
                                        baby:baby,
                                    } 
                                    localStorage.setItem("cart",JSON.stringify(newCart));
                                }
                                //Tính tổng tiền
                                caculatePrice();
                            })
                            
                        })
                        
                        //Xoá đơn hàng
                        const deleteButton=item.querySelector(".inner-sign i");
                        deleteButton.addEventListener("click",()=>{
                            const newCart=JSON.parse(localStorage.getItem("cart"));
                            const indexProduct=newCart.findIndex(item=>item.id==id);
                            if(indexProduct!=-1){
                                newCart.splice(indexProduct,1);
                                localStorage.setItem("cart",JSON.stringify(newCart));
                                drawCart();
                            }
                        })

                        //Tính tổng tiền
                        const checkbox=item.querySelector(".inner-sign input");
                        checkbox.addEventListener("change",()=>{
                            const newCart=JSON.parse(localStorage.getItem("cart"));
                            const indexProduct=newCart.findIndex(item=>item.id==id);                            
                            if(indexProduct!=-1){                                
                                newCart[indexProduct].checked=checkbox.checked;
                                localStorage.setItem("cart",JSON.stringify(newCart));
                            }
                            caculatePrice();

                        })
                        
                        

                    })
                }
            }
        })
}

const caculatePrice=()=>{
    let firstPrice=0;
    const productChoosen=document.querySelectorAll(".section11 .list-product .inner-product .inner-sign input:checked")
    productChoosen.forEach(element=>{
        const inforList=element.closest(".inner-product").querySelectorAll(".infor");
        inforList.forEach(element=>{
            const quantity=element.querySelector("input").value;
            const price=parseInt(element.querySelector(".hl").innerHTML.replaceAll(".", ""));
            firstPrice+=quantity*price;
        })
    })                    
    const firstPriceHTML=document.querySelector(".first-price");
    const discountHTML=document.querySelector(".discount");
    const finalPriceHTML=document.querySelector(".final-price");
    const discount=0;

    firstPriceHTML.innerHTML=firstPrice.toLocaleString("vi-VN");
    discountHTML.innerHTML=discount.toLocaleString("vi-VN");
    finalPriceHTML.innerHTML=(firstPrice-discount).toLocaleString("vi-VN");

}

//Trang giỏ hàng
const listProduct = document.querySelector(".list-product");
const orderInfor=document.querySelector(".section13");
if (listProduct) {
    if(!orderInfor){//do có 2 trang cùng section11, trang cần drawCart, trang không cần,
        drawCart();
    }
}

//Nút thanh toán
const paymentButton=document.querySelector(".payment");
if(paymentButton){
    paymentButton.addEventListener("click",()=>{
        const paymentMethod=paymentButton.getAttribute("paymentMethod");
        const code=paymentButton.getAttribute("code");
        const phone=paymentButton.getAttribute("phone");
        if(paymentMethod=="zalopay"){
            window.location.href=`/order/payment/zalopay?code=${code}&phone=${phone}`
        }
        else if(paymentMethod=="bank"){
            window.location.href=`/order/payment/bank?code=${code}&phone=${phone}`
        }
        else if(paymentMethod=="momo"){
            window.location.href=`/order/payment/momo?code=${code}&phone=${phone}`
        }
    })
}

