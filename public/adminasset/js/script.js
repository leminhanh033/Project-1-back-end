// trang-tong-quan sider
let buttonmenu=document.querySelector(".header .inner-logo .menu")
if(buttonmenu){    
    let sider=document.querySelector(".body .sider");
    buttonmenu.addEventListener("click",()=>{
        sider.classList.toggle("active");
    })
    let overlay=document.querySelector(".body .sider .overlay");
    overlay.addEventListener("click",()=>{
        sider.classList.remove("active");
    })
}

//Tao tour them xoa lich trinh
let addbutton=document.querySelector(".section-8 .add-schedule");
if(addbutton){
    addbutton.addEventListener("click",()=>{
        let parent=document.querySelector(".section-8 .inner-list-main");
        let child=parent.querySelector(".inner-schedule-item");
        let cloneitem=child.cloneNode(true);
        cloneitem.querySelector("input").value="";
        cloneitem.querySelector("textarea").value="";

        const body=cloneitem.querySelector(".body");   
        const id=`mce_${Date.now()}`;
        body.innerHTML=`<textarea id=${id}></textarea>`;

        parent.appendChild(cloneitem);
        initmce(`#${id}`);

        //keo tha
        const parenthandle=document.querySelector(".inner-list-main ");
        new Sortable(parenthandle, {
            handle: '.handle', // handle's class
            animation: 150,
            onStart:(event)=>{
                const id=event.item.querySelector("textarea").id;
                tinymce.get(id).remove();
            },
            onEnd:(event)=>{
                const id=event.item.querySelector("textarea").id;
                initmce(`#${id}`)

            }
        });
        
    })    
}
    
let list=document.querySelector(".section-8 .inner-list");
if(list){
        
    list.addEventListener("click",(event)=>{
        //nut xoa
        if(event.target.closest(".rubbish-remove")){
            let child=event.target.closest(".inner-schedule-item");          
            let parent=document.querySelectorAll(".section-8 .inner-list-main .inner-schedule-item");  
            if(parent.length>1)child.remove();

        }
        //nut mo rong    
        if(event.target.closest(".button-hidden")){
            let parent=event.target.closest(".inner-schedule-item");
            parent.classList.toggle("hiden");
        }
    })
}

//chen anh dung filepond
const inputfile=document.querySelectorAll("[filepond]");
if(inputfile.length>0){
    FilePond.registerPlugin(FilePondPluginImagePreview);
    inputfile.forEach(element=>{
        FilePond.create(element,{
            labelIdle:"+",
        });
    })

}

//chart trong trang tong quan
const chart = document.getElementById('myChart');
if(chart){
    const data = {
        labels: ["5k","10k","15k","20k","25k","30k"],
        datasets: [
            {
            label: 'Tháng 9/2025',
            data: ["0.2","0.5","0.3","0.5","0.45","0.56"],
            borderColor: "#4379EE",
            },            
        ]
    };
    new Chart(chart, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        },
    });

}

// jusvalidate
    // trang đăng nhập
const loginform=document.querySelector('#email-login-form');
if(loginform){
    const validator = new JustValidate('#email-login-form');
    validator.addField('#email-input', [
    {
        rule: 'required',
        errorMessage:"Vui lòng nhập email của bạn"
    },
    {
        rule: 'email',
        errorMessage:"Email không hợp lệ"
    }
    ])
    .addField('#password-input', [
    {
        rule: 'required',
        errorMessage:"Vui lòng nhập password của bạn"
    },
    ])
    .onSuccess((event)=>{
        const email=event.target.email.value;
        console.log(email);
        const pass=event.target.password.value;
        console.log(pass);
    })
}

    // trang đăng ký

const registerform=document.querySelector('#register-form');
if(registerform){
    const validator = new JustValidate('#register-form');
    validator.addField('#fullname', [
    {
        rule: 'required',
        errorMessage:"Vui lòng nhập họ tên của bạn"
    }
    ])
    .addField('#email-input', [
    {
        rule: 'required',
        errorMessage:"Vui lòng nhập email của bạn"
    },
    {
        rule: 'email',
        errorMessage:"Email không hợp lệ"
    }
    ])
    .addField('#password-input', [
    {
        rule: 'required',
        errorMessage:"Vui lòng nhập password của bạn"
    },
    {
        rule: 'minLength',
        value: 3,
        errorMessage:"Mật khẩu cần có ít nhất 3 kí tự"
    },
    {
        rule: 'customRegexp',
        value: /[a-z]/,
        errorMessage:"Mật khẩu cần ít nhất 1 kí tự thường"
    },
    {
        rule: 'customRegexp',
        value: /[A-Z]/,
        errorMessage:"Mật khẩu cần ít nhất 1 kí tự in hoa"
    },
    {
        rule: 'customRegexp',
        value: /[0-9]/,
        errorMessage:"Mật khẩu cần ít nhất 1 chữ số"
    },
    ])
    .addField('#check-23',[
        {
            rule: 'required',
            errorMessage:"Bạn phải đồng ý với các điều khoản và điều kiện"
        },
    ])
    .onSuccess((event)=>{
        const email=event.target.email.value;
        console.log(email);
        const pass=event.target.password.value;
        console.log(pass);
    })
}

const forgetpass=document.querySelector('#forgetpassword');
if(forgetpass){
    console.log()
    const validator = new JustValidate('#forgetpassword');
    validator
    .addField('#email-input', [
    {
        rule: 'required',
        errorMessage:"Vui lòng nhập email của bạn"
    },
    {
        rule: 'email',
        errorMessage:"Email không hợp lệ"
    }
    ])
}

const otpform=document.querySelector('#otp-password');
if(otpform){
    const validator = new JustValidate('#otp-password');
    validator
    .addField('#otp', [
    {
        rule: 'required',
        errorMessage:"Vui lòng nhập mã OTP"
    },    
    ])
}

const confirmform=document.querySelector('#change-password');
if(confirmform){
    console.log("ok");
    const validator = new JustValidate('#change-password');
    validator. addField('#password', [
    {
        rule: 'required',
        errorMessage:"Vui lòng nhập mật khẩu của bạn"
    },
    {
        rule: 'minLength',
        value: 3,
        errorMessage:"Mật khẩu cần có ít nhất 3 kí tự"
    },
    {
        rule: 'customRegexp',
        value: /[a-z]/,
        errorMessage:"Mật khẩu cần ít nhất 1 kí tự thường"
    },
    {
        rule: 'customRegexp',
        value: /[A-Z]/,
        errorMessage:"Mật khẩu cần ít nhất 1 kí tự in hoa"
    },
    {
        rule: 'customRegexp',
        value: /[0-9]/,
        errorMessage:"Mật khẩu cần ít nhất 1 chữ số"
    },
    {
        rule: 'customRegexp',
        value: /[^\w\s]/,
        errorMessage:"Mật khẩu cần ít nhất 1 kí tự đặc biệt"
    },
    ])
    .addField('#confirm-password',[
        {
            rule: 'required',
            errorMessage:"Vui lòng xác nhận mật khẩu"
        },
        {
            validator: (value, context)=>{
                // console.log(value)
                // console.log(context['#password'].elem.value);
                if(value==context['#password'].elem.value) return true;
            },
            errorMessage:"Mật khẩu xác nhận không chính xác",
        }
    ])
}

const tendanhmuc=document.querySelector('#tendanhmuc');
if(tendanhmuc){
    const validator=new JustValidate('#tendanhmuc');
    validator.addField('#name',[
        {
            rule:'required',
            errorMessage:"Vui lòng nhập tên danh mục"
        }
    ])
}

const tourcreate=document.querySelector('#tourcreate');
if(tourcreate){
    const validator=new JustValidate('#tourcreate');
    validator.addField('#tour',[
        {
            rule:'required',
            errorMessage:"Vui lòng nhập tên tour"
        }
    ])
}

const orderedit=document.querySelector('#order-edit');
if(orderedit){
    const validator=new JustValidate('#order-edit');
    validator.addField('#name-cus',[
        {
            rule:'required',
            errorMessage:"Vui lòng nhập tên khách hàng"
        }
    ])
    .addField('#phone',[
        {
            rule:'required',
            errorMessage:"Vui lòng nhập số điện thoại"
        },
        {
            rule: 'customRegexp',
            value: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
            errorMessage:'Số điện thoại không hợp lệ'
        },
    ])
}

const websiteinfor=document.querySelector('#website-infor');
if(websiteinfor){
    const validator=new JustValidate('#website-infor');
    validator.addField('#name',[
        {
            rule:'required',
            errorMessage:"Vui lòng nhập tên website"
        }
    ])
    .addField('#phone',[       
        {
            rule: 'customRegexp',
            value: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
            errorMessage:'Số điện thoại không hợp lệ'
        },
    ])
    .addField('#email', [
    {
        rule: 'email',
        errorMessage:"Email không hợp lệ"
    }
    ])
}

const admincreate=document.querySelector('#admin-create');
if(admincreate){
    const validator=new JustValidate('#admin-create');
    validator.addField('#name',[
        {
            rule:'required',
            errorMessage:"Vui lòng nhập họ tên "
        }
    ])
    .addField('#phone',[ 
        {
            rule:'required',
            errorMessage:"Vui lòng nhập số điện thoại "
        },     
        {
            rule: 'customRegexp',
            value: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
            errorMessage:'Số điện thoại không hợp lệ'
        },
    ])
    .addField('#email', [
        {
            rule:'required',
            errorMessage:"Vui lòng nhập email "
        },
        {
            rule: 'email',
            errorMessage:"Email không hợp lệ"
        }
    ])
    .addField('#chuc-vu',[
        {
            rule:'required',
            errorMessage:"Vui lòng nhập chức vụ "
        }
    ])
    . addField('#pass', [
    {
        rule: 'required',
        errorMessage:"Vui lòng nhập password của bạn"
    },
    {
        rule: 'minLength',
        value: 3,
        errorMessage:"Mật khẩu cần có ít nhất 3 kí tự"
    },
    {
        rule: 'customRegexp',
        value: /[a-z]/,
        errorMessage:"Mật khẩu cần ít nhất 1 kí tự thường"
    },
    {
        rule: 'customRegexp',
        value: /[A-Z]/,
        errorMessage:"Mật khẩu cần ít nhất 1 kí tự in hoa"
    },
    {
        rule: 'customRegexp',
        value: /[0-9]/,
        errorMessage:"Mật khẩu cần ít nhất 1 chữ số"
    },
    {
        rule: 'customRegexp',
        value: /[^\w\s]/,
        errorMessage:"Mật khẩu cần ít nhất 1 kí tự đặc biệt"
    },
    ])
}

const nhomquyenform=document.querySelector('#nhom-quyen');
if(nhomquyenform){
    const validator=new JustValidate('#nhom-quyen');
    validator.addField('#name',[
        {
            rule:'required',
            errorMessage:"Vui lòng nhập tên nhóm quyền "
        }
    ])    
    .onSuccess((event)=>{
        const pass=event.target.name.value;
        console.log(pass);
    })
}

const individualinfor=document.querySelector('#individualinfor');
if(individualinfor){
    console.log("ok");
    const validator=new JustValidate('#individualinfor');
    validator.addField('#name',[
        {
            rule:'required',
            errorMessage:"Vui lòng nhập họ tên "
        }
    ])
    .addField('#phone',[ 
        {
            rule:'required',
            errorMessage:"Vui lòng nhập số điện thoại "
        },     
        {
            rule: 'customRegexp',
            value: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
            errorMessage:'Số điện thoại không hợp lệ'
        },
    ])
    .addField('#email', [
        {
            rule:'required',
            errorMessage:"Vui lòng nhập email "
        },
        {
            rule: 'email',
            errorMessage:"Email không hợp lệ"
        }
    ])
    .onSuccess((event)=>{
        const name=event.target.name.value;
        const phone=event.target.phone.value;
        const email=event.target.email.value;
        console.log(name);
        console.log(phone);
        console.log(email);

    })
}
