let menu=document.querySelector(".header .inner-menu");
let buttonmenu=document.querySelector(".inner-wrap-header .icon-menu");
buttonmenu.addEventListener("click",()=>{
    menu.classList.add("active");
})
//overlay
let overlay=menu.querySelector(".overlay");
overlay.addEventListener("click",()=>{
    menu.classList.remove("active");
})
let icondown=menu.querySelectorAll(".content .inner-title>i");
icondown.forEach((item)=>{
    item.addEventListener("click",()=>{
        let parent=item.closest("div").closest(".inner-item"); 
        // console.log(parent);  
        parent.classList.toggle("active");   
    })
})

// section-1 inner-suggest-address
let input=document.querySelector(".section1 .inner-input-address .inner-input-title input");
if(input){    
    let parent=input.closest(".inner-input-address");
    input.addEventListener("focus",()=>{
        parent.classList.add("active");
    })

     input.addEventListener("blur",()=>{
        parent.classList.remove("active");
    })

    let listitem=document.querySelectorAll(".section1 .inner-input-address .inner-suggest-address .item-suggest");
    listitem.forEach((item)=>{
        item.addEventListener("mousedown",()=>{
            let title=item.querySelector(".item-content div:first-child");
            input.value=title.innerHTML;
        })
    })
}

// section-1 inner-suggest-amount
let amount=document.querySelector(".section1 .inner-input-amount");
if(amount){
    let inputamount=amount.querySelector(".inner-input-title input");
    inputamount.addEventListener("focus",()=>{
        amount.classList.add("active");
    })
    document.addEventListener("click",(event)=>{
        if(!amount.contains(event.target)){
            amount.classList.remove("active");
        }
    })
    const update=()=>{
    let boxnumber=amount.querySelectorAll(".number");
    let listnumber=[];
    boxnumber.forEach((item)=>{
        listnumber.push(item.innerHTML);
    })
    return `NL:${listnumber[0]} TE:${listnumber[1]} EB:${listnumber[2]}`
}
    let increase=amount.querySelectorAll(".inner-increase");
    increase.forEach((item)=>{
        item.addEventListener("click",()=>{
            let innernumber=item.closest(".inner-change").querySelector(".number");
            let value=parseInt(innernumber.innerHTML);
            innernumber.innerHTML=value+1;
            let inputamount=amount.querySelector(".inner-input-title input");
            inputamount.value=update();
        })
    })
    let decrease=amount.querySelectorAll(".inner-decrease");
    decrease.forEach((item)=>{
        item.addEventListener("click",()=>{
            let innernumber=item.closest(".inner-change").querySelector(".number");
            let value=parseInt(innernumber.innerHTML);
            if(value-1>=0){
                innernumber.innerHTML=value-1;        
                let inputamount=amount.querySelector(".inner-input-title input");
                inputamount.value=update();
            }            
        })
    })
}


//section-2 inner-time

let clock=document.querySelector("[expireclock]");
if(clock){
    const updatetime=()=>{
        let date=new Date(clock.getAttribute("expireclock"));
        let now=new Date();
        let time=date-now;
        if(time>0){
            let nodate=Math.floor(time/1000/(60*60*24));
            let nohour=Math.floor((time/1000-nodate*24*60*60)/3600);
            let nominute=Math.floor((time/1000-nodate*24*60*60-nohour*3600)/60);
            let nosecond=Math.floor(time/1000-nodate*24*60*60-nohour*60*60-nominute*60);
            console.log(`${nodate} ${nohour} ${nominute} ${nosecond}`)
            let numbertime=clock.querySelectorAll(".inner-time-item .number");
            numbertime[0].innerHTML=nodate;
            numbertime[1].innerHTML=nohour;
            numbertime[2].innerHTML=nominute;
            numbertime[3].innerHTML=nosecond;
        }
        else{
            clearInterval(setInterval(updatetime,1000));
        }
        
    }    
    setInterval(updatetime,1000);
}
//danh sach tour button filter
let leftpart=document.querySelector(".inner-left");
let buttonfilter=document.querySelector(".inner-right .filter");
if(buttonfilter){
    buttonfilter.addEventListener("click",()=>{
        console.log("click");
        leftpart.classList.add("active");
    })
    let overlay=leftpart.querySelector(".overlay");
     overlay.addEventListener("click",()=>{
        leftpart.classList.remove("active");
    })
}
//chitiettour button xem tat ca
let buttonreadmore=document.querySelector(".section10 .read-more button");
if(buttonreadmore){
    buttonreadmore.addEventListener("click",()=>{
        console.log("click");
        let content=document.querySelector(".section10 .inf-tour .inner-content");
        content.classList.toggle("active");
        if(content.classList.contains("active")){
            buttonreadmore.innerHTML="Thu gọn";
        }
        else{
            buttonreadmore.innerHTML="Xem tất cả";
        }
    })
}

//khoi tao va su dung AOS cho trang chu
AOS.init();

//swiper trong section-2
const swipersection2=document.querySelector(".section2 .inner-swiper");
if(swipersection2){
    console.log(true);
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
        0:{
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
const listimg=document.querySelector(".section3 .list-img");
if(listimg){
     var swiper = new Swiper(".section3 .list-img", {
      slidesPerView: 3,
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      loop:true,
      
      autoplay: {
        delay: 2000,
        disableOnInteraction: true,
      },
       breakpoints: {
        0:{
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
const swipersection10=document.querySelector(".section10 .swiper.inner-img");
if(swipersection10){
    var swiper = new Swiper(".section10 .inner-img", {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
      loop:true,       
      breakpoints: {
        0:{
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
      loop:true,       
    });
}
//zoom in section 10
const imagezoom=document.querySelector(".section10 .swiper.inner-thumb .swiper-wrapper");
if(imagezoom){
    new Viewer(imagezoom);
}

const image1=document.querySelector(".section10 .inner-left .inf-tour img");
if(image1){
    new Viewer(image1);
}

const image2=document.querySelectorAll(".section10 .inner-left .inner-item-tour .inner-content img");
image2.forEach((item)=>{
    if(item){
        new Viewer(item);
    }
})

//validate form
const emailform=document.querySelector('#email-form');
if(emailform){
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
    .onSuccess((event)=>{
        const inputvalue=event.target.querySelector("input").value;
    })
}

const couponform=document.querySelector('#coupon-form');
if(couponform){
    const validator = new JustValidate('#coupon-form');
    validator.addField('#coupon-input', [
    {
        rule: 'required',
        errorMessage: 'Vui lòng nhập mã',   
    },
    ])
    .onSuccess((event)=>{
        const inputvalue=event.target.querySelector("input").value;
        console.log(inputvalue);
    })
}

const custominfor=document.querySelector("#custom-infor");
if(custominfor){
    const validator = new JustValidate('#custom-infor');
    validator.addField('#name', [
    {
        rule: 'required',
        errorMessage:'Vui lòng nhập họ tên',
    },
    ])
    .addField('#phone',[
    {
        rule: 'required',
        errorMessage:'Vui lòng nhập số điện thoại',
    },
    {
        rule: 'customRegexp',
        value: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
        errorMessage:'Số điện thoại không hợp lệ'
    },
    ]);
}