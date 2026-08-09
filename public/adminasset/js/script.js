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
//sider
let sider = document.querySelector(".body .sider");
if (sider) {
    let sideritem = sider.querySelectorAll("a");
    sideritem.forEach((item) => {
        if (item.getAttribute("href") == window.location.pathname) {
            item.classList.add("action");
        }
    });
}
// Nút đăng xuất
let logoutButton = document.querySelector(".logoutButton");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        fetch(`/${pathAdmin}/account/logout`, {
            method: "POST",
        })
            .then(res => res.json())
            .then(data => {
                if (data.code == "error") {
                    notyf.error(data.message);
                }
                else if (data.code == "success") {
                    alertMessage(data);
                    window.location.href = `/${pathAdmin}/account/login`;
                }
            })
    })
}

// trang-tong-quan sider
let buttonmenu = document.querySelector(".header .inner-logo .menu")
if (buttonmenu) {
    let sider = document.querySelector(".body .sider");
    buttonmenu.addEventListener("click", () => {
        sider.classList.toggle("active");
    })
    let overlay = document.querySelector(".body .sider .overlay");
    overlay.addEventListener("click", () => {
        sider.classList.remove("active");
    })
}

//Tao tour them xoa lich trinh
let addbutton = document.querySelector(".section-8 .add-schedule");
if (addbutton) {
    addbutton.addEventListener("click", () => {
        let parent = document.querySelector(".section-8 .inner-list-main");
        let child = parent.querySelector(".inner-schedule-item");
        let cloneitem = child.cloneNode(true);
        cloneitem.querySelector("input").value = "";
        cloneitem.querySelector("textarea").value = "";

        const body = cloneitem.querySelector(".body");
        const id = `mce_${Date.now()}`;
        body.innerHTML = `<textarea 
            id=${id}
            class="schedule-desc"
            textarea-mce
        ></textarea>`;

        parent.appendChild(cloneitem);
        initmce(`#${id}`);

        //keo tha
        const parenthandle = document.querySelector(".inner-list-main ");
        new Sortable(parenthandle, {
            handle: '.handle', // handle's class
            animation: 150,
            onStart: (event) => {
                const id = event.item.querySelector("textarea").id;
                tinymce.get(id).remove();
            },
            onEnd: (event) => {
                const id = event.item.querySelector("textarea").id;
                initmce(`#${id}`)

            }
        });

    })
}

let list = document.querySelector(".section-8 .inner-list");
if (list) {

    list.addEventListener("click", (event) => {
        //nut xoa
        if (event.target.closest(".rubbish-remove")) {
            let child = event.target.closest(".inner-schedule-item");
            let parent = document.querySelectorAll(".section-8 .inner-list-main .inner-schedule-item");
            if (parent.length > 1) child.remove();

        }
        //nut mo rong    
        if (event.target.closest(".button-hidden")) {
            let parent = event.target.closest(".inner-schedule-item");
            parent.classList.toggle("hiden");
        }
    })
}

let lineChart=null;

const drawChart=(date)=>{
    console.log("gửi dữ liệu");
    fetch(`/${pathAdmin}/dashboard/chart`,{
        method:"POST",
        headers:{
            "Content-Type":"application/JSON",
        },
        body:JSON.stringify({
            date:date
        })
    })
    .then(res=>res.json())
    .then(returnData=>{
        if(returnData.code=="success"){
            const data = {
                labels: Object.keys(returnData.revenueCurrent),
                datasets: [
                    {
                        label: 'Tháng 9/2025',
                        data: Object.values(returnData.revenueCurrent),
                        borderColor: "#e21b1b",
                    },
                    {
                        label: 'Tháng 8/2025',
                        data: Object.values(returnData.revenueLast),
                        borderColor: "#4379EE",
                    },
                ]
            };
            if(lineChart!=null){
                lineChart.destroy();
            }
            lineChart=new Chart(chart, {
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
        if(returnData.code=="error"){
            notyf.error(returnData.message);
        }
    })
}

//chart trong trang tong quan
const chart = document.getElementById('myChart');
if (chart) {
    const currentDay=new Date();
    const currentMonth=currentDay.getMonth()+1;
    const currentYear=currentDay.getFullYear();
    console.log(currentMonth,currentYear);
    drawChart(currentDay);

    const chartTime=document.querySelector(".chartTime");
    console.log(`${currentYear}-${currentMonth<10?`0${currentMonth}`:currentMonth}`);
    chartTime.value=`${currentYear}-${currentMonth<10?`0${currentMonth}`:currentMonth}`;

    chartTime.addEventListener("change",()=>{
        const [year,month]=chartTime.value.split("-");
        const date=new Date(parseInt(year),parseInt(month)-1);
        drawChart(date);
    })
    

}

// jusvalidate
// trang đăng nhập
const loginform = document.querySelector('#email-login-form');
if (loginform) {
    const validator = new JustValidate('#email-login-form');
    validator
        .addField('#email-input', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập email của bạn"
            },
            {
                rule: 'email',
                errorMessage: "Email không hợp lệ"
            }
        ])
        .addField('#password-input', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập password của bạn"
            },
        ])
        .onSuccess((event) => {
            const email = event.target.email.value;
            const password = event.target.password.value;
            const remmeberpass = event.target.querySelector('#check-box-remember-password').checked;
            const account = {
                email: email,
                password: password,
                rememberpassword: remmeberpass,
            }
            fetch(`/${pathAdmin}/account/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(account),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        notyf.error(data.message);
                    }
                    else if (data.code == "success") {
                        alertMessage(data);
                        window.location.href = `/${pathAdmin}/dashboard`;
                    }
                })
        })
}

// trang đăng ký

const registerform = document.querySelector('#register-form');
if (registerform) {
    const validator = new JustValidate('#register-form');
    validator
        .addField('#fullname', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập họ tên của bạn"
            }
        ])
        .addField('#email-input', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập email của bạn"
            },
            {
                rule: 'email',
                errorMessage: "Email không hợp lệ"
            }
        ])
        .addField('#password-input', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập password của bạn"
            },
            {
                rule: 'minLength',
                value: 3,
                errorMessage: "Mật khẩu cần có ít nhất 3 kí tự"
            },
            {
                rule: 'customRegexp',
                value: /[a-z]/,
                errorMessage: "Mật khẩu cần ít nhất 1 kí tự thường"
            },
            {
                rule: 'customRegexp',
                value: /[A-Z]/,
                errorMessage: "Mật khẩu cần ít nhất 1 kí tự in hoa"
            },
            {
                rule: 'customRegexp',
                value: /[0-9]/,
                errorMessage: "Mật khẩu cần ít nhất 1 chữ số"
            },
        ])
        .addField('#checkbox-register-admin', [
            {
                rule: 'required',
                errorMessage: "Bạn phải đồng ý với các điều khoản và điều kiện"
            },
        ])
        .onSuccess((event) => {

            const fullname = event.target.fullname.value;
            const email = event.target.email.value;
            const password = event.target.password.value;
            const registerInform = {
                fullname: fullname,
                email: email,
                password: password,
                status: "pending",
            }
            fetch(`/${pathAdmin}/account/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerInform),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        notyf.error(data.message);
                    }
                    else if (data.code == "success") {
                        alertMessage(data);
                        window.location.href = `/${pathAdmin}/account/login`;
                    }
                })
        })
}

//Quên mật khẩu
const forgetpass = document.querySelector('#forgetpassword');
if (forgetpass) {
    console.log()
    const validator = new JustValidate('#forgetpassword');
    validator
        .addField('#email-input', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập email của bạn"
            },
            {
                rule: 'email',
                errorMessage: "Email không hợp lệ"
            }
        ])
        .onSuccess((event) => {
            const email = event.target["email-input"].value;
            const forgotpassword = {
                email: email,
            }
            fetch(`/${pathAdmin}/account/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(forgotpassword),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        notyf.error(data.message);
                    }
                    if (data.code == "success") {
                        alertMessage(data);
                        window.location.href = `/${pathAdmin}/account/enter-otp?email=${email}`;
                    }
                })
        })
}
//Nhập mã otp
const otpform = document.querySelector('#otp-password');
if (otpform) {
    const validator = new JustValidate('#otp-password');
    validator
        .addField('#otp', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập mã OTP"
            },
        ])
        .onSuccess((event) => {
            const params = new URLSearchParams(window.location.search);
            const email = params.get(`email`);
            const otpEnter = {
                otp: event.target.otp.value,
                email: email,
            }

            fetch(`/${pathAdmin}/account/enter-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(otpEnter),
            })
                .then(res => res.json())
                .then((data) => {
                    if (data.code == "error") {
                        notyf.error(data.message);
                    }
                    if (data.code == "success") {
                        alertMessage(data);
                        window.location.href = `/${pathAdmin}/account/reset-password`;
                    }
                })
        })
}

//Đổi mật khẩu
const confirmform = document.querySelector('#change-password');
if (confirmform) {
    const validator = new JustValidate('#change-password');
    validator.addField('#password', [
        {
            rule: 'required',
            errorMessage: "Vui lòng nhập mật khẩu của bạn"
        },
        {
            rule: 'minLength',
            value: 3,
            errorMessage: "Mật khẩu cần có ít nhất 3 kí tự"
        },
        {
            rule: 'customRegexp',
            value: /[a-z]/,
            errorMessage: "Mật khẩu cần ít nhất 1 kí tự thường"
        },
        {
            rule: 'customRegexp',
            value: /[A-Z]/,
            errorMessage: "Mật khẩu cần ít nhất 1 kí tự in hoa"
        },
        {
            rule: 'customRegexp',
            value: /[0-9]/,
            errorMessage: "Mật khẩu cần ít nhất 1 chữ số"
        },
        {
            rule: 'customRegexp',
            value: /[^\w\s]/,
            errorMessage: "Mật khẩu cần ít nhất 1 kí tự đặc biệt"
        },
    ])
        .addField('#confirm-password', [
            {
                rule: 'required',
                errorMessage: "Vui lòng xác nhận mật khẩu"
            },
            {
                validator: (value, context) => {
                    // console.log(value)
                    // console.log(context['#password'].elem.value);
                    if (value == context['#password'].elem.value) return true;
                },
                errorMessage: "Mật khẩu xác nhận không chính xác",
            }
        ])
        .onSuccess((event) => {
            const password = {
                password: event.target.password.value,
            }
            fetch(`/${pathAdmin}/account/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(password),
            })
                .then(res => res.json())
                .then((data) => {
                    if (data.code == "error") {
                        notyf.error(data.message);
                    }
                    else if (data.code == "success") {
                        alertMessage(data);
                        window.location.href = `/${pathAdmin}/account/login`;
                    }
                })
        })
}
//chen anh dung filepond
const inputfile = document.querySelectorAll("[filepond]");
const listFile = {};
if (inputfile.length > 0) {
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginFileValidateType);
    inputfile.forEach(element => {
        const inputId = element.id;
        const avatar = element.getAttribute("avatar")
        listFile[inputId] = FilePond.create(element, {
            labelIdle: "+",
            files: avatar ? [{
                source: avatar,
                options: {
                    type: "local"
                }
            }] : [],
            server: {
                load: (source, load, error, progress, abort) => {
                    fetch(source)
                        .then(res => res.blob())
                        .then(load)
                        .catch(error);

                    return {
                        abort: () => abort()
                    };
                }
            },
            allowMultiple: inputId === "images",
        });
    })
}

//ListImages
const inputImages = document.querySelectorAll("[filepond-multi-image]");
const listFileImage={}
if (inputImages && inputImages.length > 0) {
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginFileValidateType);
    inputImages.forEach(element => {
        let files = []
        const inputID = element.id;
        let images = JSON.parse(element.closest("[filepond-multi]").getAttribute("images"));
        if (images.length > 0) {
            files = images.map(item => (
                {
                    source: item,
                }
            ))

        }
        listFileImage[inputID]=FilePond.create(element, {
            labelIdle: "+",
            files: files,
            allowMultiple: true,
        });
    })

}


//Tạo danh mục
const tendanhmuc = document.querySelector('#tendanhmuc');
if (tendanhmuc) {
    const validator = new JustValidate('#tendanhmuc');
    validator
        .addField('#name', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập tên danh mục"
            }
        ])
        .onSuccess((event) => {
            // console.log(event.target.name.value);
            // console.log(event.target.parent.value);
            // console.log(event.target.position.value);
            // console.log(event.target.state.value);

            // console.log(listFile["avatar"].getFile(0));

            // console.log(tinymce.activeEditor.getContent());

            const formData = new FormData();
            formData.append('name', event.target.name.value);
            formData.append('parent', event.target.parent.value);
            formData.append('position', event.target.position.value);
            formData.append('state', event.target.state.value);
            const avatars = listFile["avatar"].getFiles();
            if (avatars.length > 0)
                formData.append('avatar', avatars[0].file);
            formData.append('description', tinymce.activeEditor.getContent());
            console.log(formData);
            fetch(`/${pathAdmin}/category/create`, {
                method: 'POST',
                body: formData,
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        notyf.error(data.message);
                    }
                    if (data.code == "success") {
                        alertMessage(data);
                        window.location.reload();
                    }
                })
        })
}

//Chỉnh sửa danh mục

const editCategory = document.querySelector('#edit-category');
if (editCategory) {
    const categoryID = (editCategory.getAttribute("categoryID"));

    const validator = new JustValidate('#edit-category');
    validator
        .addField('#name', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập tên danh mục"
            }
        ])
        .onSuccess((event) => {
            // console.log(event.target.name.value);
            // console.log(event.target.parent.value);
            // console.log(event.target.position.value);
            // console.log(event.target.state.value);

            // console.log(listFile["avatar"].getFile(0));

            // console.log(tinymce.activeEditor.getContent());
            const formData = new FormData();
            formData.append('name', event.target.name.value);
            formData.append('parent', event.target.parent.value);
            formData.append('position', event.target.position.value);
            formData.append('state', event.target.state.value);
            const avatars = listFile["avatar"].getFiles();
            if (avatars.length > 0)
                formData.append('avatar', avatars[0].file);
            formData.append('description', tinymce.activeEditor.getContent());
            fetch(`/${pathAdmin}/category/edit/${categoryID}`, {
                method: 'PATCH',
                body: formData,
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        notyf.error(data.message);
                    }
                    if (data.code == "success") {
                        alertMessage(data);
                        window.location.href = `/${pathAdmin}/category/manage`;
                    }
                })
        })
}

//Xoá danh mục, xoá tour
const deleteButton = document.querySelectorAll('#deleteButton');
if (deleteButton) {
    deleteButton.forEach((item) => {
        const id = (item.getAttribute("data-id"))
        const api = (item.getAttribute("data-api"))
        item.addEventListener("click", () => {
            fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        notyf.error(data.message)
                    }
                    else if (data.code == "success") {
                        alertMessage(data);
                        window.location.reload();
                    }
                })
        })
    })
}

//Bộ lọc
const filterItems = document.querySelectorAll('[filter]');
if (filterItems) {
    const url = new URL(window.location.href)
    filterItems.forEach((item) => {
        if (url.searchParams.get(item.getAttribute("filter"))) {
            item.value = url.searchParams.get(item.getAttribute("filter"));
        }
        item.addEventListener("change", () => {
            const filterType = item.getAttribute("filter");
            const value = item.value;
            if (value) {
                url.searchParams.set(filterType, value);
                console.log(url.href);
            }
            else {
                url.searchParams.delete(filterType);
            }
            window.location.href = url.href;


        })

    })
}

//reset bộ lọc
const filterReset = document.querySelector('[filter-reset]');
if (filterReset) {
    filterReset.addEventListener('click', () => {
        const filterItems = document.querySelectorAll('[filter]');
        if (filterItems) {
            const url = new URL(window.location.href)
            filterItems.forEach((item) => {
                url.searchParams.delete(item.getAttribute("filter"));
            })
            window.location.href = url.href;
        }
    })
}

//Checkbox
const checkAll = document.querySelector('[checkAll]');
if (checkAll) {
    const inputAll = checkAll.querySelector("input");
    checkAll.addEventListener("change", () => {
        const checkItems = document.querySelectorAll('[checkItem]');
        checkItems.forEach(item => {
            const input = item.querySelector("input");
            input.checked = inputAll.checked;
        })
    })
}

//Nút Áp dụng
const applyButton = document.querySelector('[applyButton]');
if (applyButton) {
    applyButton.addEventListener("click", () => {
        const value = document.querySelector("[actionOption]").value;
        if (!value) {
            notyf.error("Vui lòng chọn hành động")
        }
        else {
            const categorySelected = document.querySelectorAll("[checkItem] input:checked");
            if (categorySelected && categorySelected.length > 0) {
                const listID = [];
                categorySelected.forEach(item => {
                    listID.push(item.getAttribute("checkItemID"));
                });
                const api = applyButton.getAttribute("data-api");
                fetch(api, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        listID: listID,
                        option: value,
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.code == "error") {
                            notyf.error(data.message);
                        }
                        if (data.code == "success") {
                            alertMessage(data);
                            window.location.reload();
                        }
                    })
            }
            else {
                notyf.error("Vui lòng chọn ít nhất 1 danh mục")
            }
        }

    })
}

//Tính năng tìm kiếm
const search = document.querySelector('[search]');
if (search) {
    const url = new URL(window.location.href);
    search.addEventListener("keyup", (event) => {
        if (event.key == "Enter") {
            if (search.value) {
                url.searchParams.set("search", search.value);
            }
            else {
                url.searchParams.delete("search");
            }
            window.location.href = url.href;

        }
    })
    const searchValue = url.searchParams.get("search");
    if (searchValue) {
        search.value = searchValue;
    }
}

//Tính năng phân trang
const pagination = document.querySelector('[pagination]');
if (pagination) {
    const url = new URL(window.location.href);
    pagination.addEventListener("change", () => {
        url.searchParams.set("page", pagination.value);
        window.location.href = url.href;
    })
    const pageURL = url.searchParams.get("page");
    if (pageURL) {
        pagination.value = pageURL;
    }
}

//Tạo tour
const tourcreate = document.querySelector('#tourcreate');
if (tourcreate) {
    const validator = new JustValidate('#tourcreate');
    validator.addField('#tour', [
        {
            rule: 'required',
            errorMessage: "Vui lòng nhập tên tour"
        }
    ])
        .onSuccess((event) => {

            //destination
            let destinationID = []
            const destination = document.querySelectorAll("#destination");
            destination.forEach((item) => {
                const input = item.querySelector("[checkItem]");
                if (input.checked) {
                    destinationID.push(input.value);
                }
            })

            //lịch trình tour
            let schedule = [];
            const scheduleTour = document.querySelectorAll("#schedule");
            // console.log(scheduleTour.length);
            scheduleTour.forEach((item) => {
                const name = item.querySelector(".schedule-name").value;

                const id = item.querySelector(".schedule-desc").id;
                const desc = (tinymce.get(id).getContent());
                schedule.push({
                    name: name,
                    desc: desc,
                })
                // console.log(id);
            })
            // console.log(schedule);

            //tạo form
            const formData = new FormData();
            formData.append("name", event.target.tour.value);
            formData.append("category", event.target.category.value);
            const avatars = listFile["avatar-tour"].getFiles();
            if (avatars.length > 0) {
                formData.append("avatar", avatars[0].file);
            }
            const images = listFileImage["images"].getFiles();
            if (images && images.length > 0) {
                images.forEach(item => {
                    formData.append("images", item.file);
                })
            }
            formData.append("position", event.target.position.value);
            formData.append("state", event.target.state.value);

            formData.append("oldAdult", event.target.oldAdult.value ? event.target.oldAdult.value : 0);
            formData.append("oldChild", event.target.oldChild.value ? event.target.oldChild.value : 0);
            formData.append("oldBaby", event.target.oldBaby.value ? event.target.oldBaby.value : 0);

            formData.append("newAdult", event.target.newAdult.value ? event.target.newAdult.value : 0);
            formData.append("newChild", event.target.newChild.value ? event.target.newChild.value : 0);
            formData.append("newBaby", event.target.newBaby.value ? event.target.newBaby.value : 0);

            formData.append("remainAdult", event.target.remainAdult.value ? event.target.remainAdult.value : 0);
            formData.append("remainChild", event.target.remainChild.value ? event.target.remainChild.value : 0);
            formData.append("remainBaby", event.target.remainBaby.value ? event.target.remainBaby.value : 0);

            formData.append("destination", JSON.stringify(destinationID));

            formData.append("time", event.target.time.value);
            formData.append("vehicle", event.target.vehicle.value);
            formData.append("departureDate", event.target.departureDate.value);

            formData.append("information", tinymce.get("infor").getContent());
            formData.append("schedule", JSON.stringify(schedule));

            // console.log(formData)
            // console.log("gửi dữ liệu");

            fetch(`/${pathAdmin}/tour/create`, {
                method: "POST",
                body: formData,
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error")
                        notyf.error(data.message);
                    if (data.code == "success") {
                        alertMessage(data);
                        window.location.reload();
                    }
                })

        })
}

//Chỉnh sửa tour
const touredit = document.querySelector('#touredit');
if (touredit) {
    const validator = new JustValidate('#touredit');
    validator.addField('#tour', [
        {
            rule: 'required',
            errorMessage: "Vui lòng nhập tên tour"
        }
    ])
        .onSuccess((event) => {

            //destination
            let destinationID = []
            const destination = document.querySelectorAll("#destination");
            destination.forEach((item) => {
                const input = item.querySelector("[checkItem]");
                if (input.checked) {
                    destinationID.push(input.value);
                }
            })

            //lịch trình tour
            let schedule = [];
            const scheduleTour = document.querySelectorAll("#schedule");
            // console.log(scheduleTour.length);
            scheduleTour.forEach((item) => {
                const name = item.querySelector(".schedule-name").value;

                const id = item.querySelector(".schedule-desc").id;
                const desc = (tinymce.get(id).getContent());
                schedule.push({
                    name: name,
                    desc: desc,
                })
                // console.log(id);
            })
            // console.log(schedule);

            //tạo form
            const formData = new FormData();
            formData.append("name", event.target.tour.value);
            formData.append("category", event.target.category.value);
            const avatars = listFile["avatar-tour"].getFiles();
            if (avatars.length > 0) {
                formData.append("avatar", avatars[0].file);
            }

            const images = listFileImage["images"].getFiles();
            if (images && images.length > 0) {
                images.forEach(item => {
                    formData.append("images", item.file);
                })
            }

            formData.append("position", event.target.position.value);
            formData.append("state", event.target.state.value);

            formData.append("oldAdult", event.target.oldAdult.value ? event.target.oldAdult.value : 0);
            formData.append("oldChild", event.target.oldChild.value ? event.target.oldChild.value : 0);
            formData.append("oldBaby", event.target.oldBaby.value ? event.target.oldBaby.value : 0);

            formData.append("newAdult", event.target.newAdult.value ? event.target.newAdult.value : 0);
            formData.append("newChild", event.target.newChild.value ? event.target.newChild.value : 0);
            formData.append("newBaby", event.target.newBaby.value ? event.target.newBaby.value : 0);

            formData.append("remainAdult", event.target.remainAdult.value ? event.target.remainAdult.value : 0);
            formData.append("remainChild", event.target.remainChild.value ? event.target.remainChild.value : 0);
            formData.append("remainBaby", event.target.remainBaby.value ? event.target.remainBaby.value : 0);

            formData.append("destination", JSON.stringify(destinationID));

            formData.append("time", event.target.time.value);
            formData.append("vehicle", event.target.vehicle.value);
            formData.append("departureDate", event.target.departureDate.value);

            formData.append("information", tinymce.get("infor").getContent());
            formData.append("schedule", JSON.stringify(schedule));

            // console.log(formData)
            const tourID = touredit.getAttribute("tourID");
            fetch(`/${pathAdmin}/tour/edit/${tourID}`, {
                method: "PATCH",
                body: formData,
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error")
                        notyf.error(data.message);
                    if (data.code == "success") {
                        notyf.success(data.message);
                    }


                })




        })
}

//Khôi phục trong trang thùng rác
const restoreButton = document.querySelector('#restore');
if (restoreButton) {
    restoreButton.addEventListener("click", () => {
        const ID = restoreButton.getAttribute("tourID");
        console.log(ID);
        fetch(`/${pathAdmin}/tour/rubbish/restore`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: ID,
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.code == "error") {
                    notyf.error(data.message)
                }
                else if (data.code == "success") {
                    alertMessage(data);
                    window.location.reload();
                }
            })
    })
}

//Xoá vĩnh viễn trong trang thùng rác
const foreverDelete = document.querySelector("#foreverDelete");
if (foreverDelete) {
    foreverDelete.addEventListener("click", () => {
        const ID = foreverDelete.getAttribute("tourID");
        console.log(ID);
        fetch(`/${pathAdmin}/tour/rubbish/forever-delete`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: ID,
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.code == "error") {
                    notyf.error(data.message)
                }
                else if (data.code == "success") {
                    alertMessage(data);
                    window.location.reload();
                }
            })
    })
}

//Trang chỉnh sửa đơn hàng
const orderedit = document.querySelector('#order-edit');
if (orderedit) {
    const validator = new JustValidate('#order-edit');
    validator.addField('#fullname', [
        {
            rule: 'required',
            errorMessage: "Vui lòng nhập tên khách hàng"
        }
    ])
        .addField('#phone', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập số điện thoại"
            },
            {
                rule: 'customRegexp',
                value: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
                errorMessage: 'Số điện thoại không hợp lệ'
            },
        ])
        .onSuccess(event=>{
            const code=orderedit.getAttribute("code");

            const fullname=event.target.fullname.value;
            const phone=event.target.phone.value;
            const note=event.target.note.value;

            const paymentMethod=event.target.paymentMethod.value;
            const paymentStatus=event.target.paymentStatus.value;
            const status=event.target.status.value;

            const itemList=orderedit.querySelectorAll(".inner-list-tour .inner-item");
            const items=[...itemList].map(item=>item.getAttribute("item"));

            const subtotal=orderedit.querySelector("#subtotal").getAttribute("subtotal");
            const total=orderedit.querySelector("#total").getAttribute("total");
            console.log("guiwr duwx lieeuj");

            fetch(`/${pathAdmin}/order/edit/`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/JSON",
                },
                body:JSON.stringify({
                    code,
                    fullname,
                    phone,
                    note,
                    paymentMethod,
                    paymentStatus,
                    status,
                    items,
                    subtotal,
                    total,
                })
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.code=="error"){
                    notyf.error(data.message);
                }
                if(data.code=="success"){
                    notyf.success(data.message);
                }
            })
        })
}

//Thông tin website
const websiteinfor = document.querySelector('#website-infor');
if (websiteinfor) {
    const validator = new JustValidate('#website-infor');
    validator.addField('#name', [
        {
            rule: 'required',
            errorMessage: "Vui lòng nhập tên website"
        }
    ])
        .addField('#phone', [
            {
                rule: 'customRegexp',
                value: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
                errorMessage: 'Số điện thoại không hợp lệ'
            },
        ])
        .addField('#email', [
            {
                rule: 'email',
                errorMessage: "Email không hợp lệ"
            }
        ])
        .onSuccess(() => {
            // console.log(event.target.name);
            // console.log(event.target.phone);
            // console.log(event.target.email);
            // console.log(event.target.address);
            const formData = new FormData();
            formData.append("name", event.target.name.value);
            formData.append("phone", event.target.phone.value);
            formData.append("email", event.target.email.value);
            formData.append("address", event.target.address.value);
            const avatars = listFile["avatar"].getFiles();
            if (avatars.length > 0) {
                formData.append("avatar", avatars[0].file);
            }
            const favicons = listFile["favicon"].getFiles();
            if (favicons.length > 0) {
                formData.append("favicon", favicons[0].file);
            }
            fetch(`/${pathAdmin}/setting/website-infor`, {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        notyf.error(data.message)
                    }
                    else if (data.code == "success") {
                        notyf.success(data.message)
                    }
                })

        })
}

//Tạo tài khoản quản trị
const admincreate = document.querySelector('#admin-create');
if (admincreate) {
    const validator = new JustValidate('#admin-create');
    console.log(validator);
    validator
        .addField('#fullname', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập họ tên "
            }
        ])
        .addField('#phone', [
            {
                rule: 'customRegexp',
                value: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
                errorMessage: 'Số điện thoại không hợp lệ'
            },
        ])
        .addField('#email', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập email "
            },
            {
                rule: 'email',
                errorMessage: "Email không hợp lệ"
            }
        ])
        .addField('#password', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập password của bạn"
            },
            {
                rule: 'minLength',
                value: 3,
                errorMessage: "Mật khẩu cần có ít nhất 3 kí tự"
            },
            {
                rule: 'customRegexp',
                value: /[a-z]/,
                errorMessage: "Mật khẩu cần ít nhất 1 kí tự thường"
            },
            {
                rule: 'customRegexp',
                value: /[A-Z]/,
                errorMessage: "Mật khẩu cần ít nhất 1 kí tự in hoa"
            },
            {
                rule: 'customRegexp',
                value: /[0-9]/,
                errorMessage: "Mật khẩu cần ít nhất 1 chữ số"
            },
            {
                rule: 'customRegexp',
                value: /[^\w\s]/,
                errorMessage: "Mật khẩu cần ít nhất 1 kí tự đặc biệt"
            },
        ])
        .onSuccess(() => {
            formData = new FormData();
            formData.append("fullname", event.target.fullname.value);
            formData.append("email", event.target.email.value);
            formData.append("phone", event.target.phone.value);
            formData.append("role", event.target.role.value);
            formData.append("roleName", event.target.roleName.value);
            formData.append("status", event.target.status.value);
            formData.append("password", event.target.password.value);
            const avatars = listFile["avatar"].getFiles();
            if (avatars.length > 0)
                formData.append("avatar", avatars[0].file);
            fetch(`/${pathAdmin}/setting/account-admin/create`, {
                method: "POST",
                body: formData,
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        notyf.error(data.message);
                    }
                    else if (data.code == "success") {
                        alertMessage(data);
                        window.location.reload();
                    }
                })

        })
}

//Chỉnh sửa tài khoản quản trị
const adminedit = document.querySelector('#admin-edit');
if (adminedit) {
    const validator = new JustValidate('#admin-edit');
    console.log(validator);
    validator
        .addField('#fullname', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập họ tên "
            }
        ])
        .addField('#phone', [
            {
                rule: 'customRegexp',
                value: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
                errorMessage: 'Số điện thoại không hợp lệ'
            },
        ])
        .addField('#email', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập email "
            },
            {
                rule: 'email',
                errorMessage: "Email không hợp lệ"
            }
        ])
        .onSuccess(() => {
            formData = new FormData();
            formData.append("fullname", event.target.fullname.value);
            formData.append("email", event.target.email.value);
            formData.append("phone", event.target.phone.value);
            formData.append("role", event.target.role.value);
            formData.append("roleName", event.target.roleName.value);
            formData.append("status", event.target.status.value);
            formData.append("password", event.target.password.value);
            const avatars = listFile["avatar"].getFiles();
            if (avatars.length > 0)
                formData.append("avatar", avatars[0].file);
            const id = adminedit.getAttribute("accountID");
            fetch(`/${pathAdmin}/setting/account-admin/edit/${id}`, {
                method: "PATCH",
                body: formData,
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        notyf.error(data.message);
                    }
                    else if (data.code == "success") {
                        alertMessage(data);
                        window.location.reload();
                    }
                })

        })
}

//Tạo nhóm quyền
const nhomquyenform = document.querySelector('#nhom-quyen');
if (nhomquyenform) {
    const validator = new JustValidate('#nhom-quyen');
    validator.addField('#name', [
        {
            rule: 'required',
            errorMessage: "Vui lòng nhập tên nhóm quyền "
        }
    ])
        .onSuccess((event) => {
            const name = event.target.name.value;
            const desc = event.target.desc.value;
            let rightsValue = [];
            const listRights = document.querySelectorAll("[rights]");
            listRights.forEach(item => {
                const input = item.querySelector("input");
                if (input.checked) {
                    rightsValue.push(input.getAttribute("value"));
                }
            })
            fetch(`/${pathAdmin}/setting/role/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    description: desc,
                    listRights: rightsValue,
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        notyf.error(data.message);
                    }
                    else if (data.code == "success") {
                        alertMessage(data);
                        window.location.reload();
                    }
                })
        })
}

//Chỉnh sửa nhóm quyền
const roleeditform = document.querySelector('#edit-role');
if (roleeditform) {
    const validator = new JustValidate('#edit-role');
    validator.addField('#name', [
        {
            rule: 'required',
            errorMessage: "Vui lòng nhập tên nhóm quyền "
        }
    ])
        .onSuccess((event) => {
            const name = event.target.name.value;
            const desc = event.target.desc.value;
            let rightsValue = [];
            const listRights = document.querySelectorAll("[rights]");
            listRights.forEach(item => {
                const input = item.querySelector("input");
                if (input.checked) {
                    rightsValue.push(input.getAttribute("value"));
                }
            })
            const id = roleeditform.getAttribute("roleID");

            fetch(`/${pathAdmin}/setting/role/edit/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    description: desc,
                    listRights: rightsValue,
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        notyf.error(data.message);
                    }
                    else if (data.code == "success") {
                        alertMessage(data);
                        window.location.reload();
                    }
                })
        })
}

//Chỉnh sửa thông tin cá nhân
const individualinfor = document.querySelector('#individualinfor');
if (individualinfor) {
    console.log("ok");
    const validator = new JustValidate('#individualinfor');
    validator.addField('#fullname', [
        {
            rule: 'required',
            errorMessage: "Vui lòng nhập họ tên "
        }
    ])
        .addField('#phone', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập số điện thoại "
            },
            {
                rule: 'customRegexp',
                value: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
                errorMessage: 'Số điện thoại không hợp lệ'
            },
        ])
        .addField('#email', [
            {
                rule: 'required',
                errorMessage: "Vui lòng nhập email "
            },
            {
                rule: 'email',
                errorMessage: "Email không hợp lệ"
            }
        ])
        .onSuccess((event) => {
            formData = new FormData();
            formData.append("fullname", event.target.fullname.value);
            formData.append("email", event.target.email.value);
            formData.append("phone", event.target.phone.value);
            formData.append("role", event.target.role.value);
            formData.append("roleName", event.target.roleName.value);
            const avatars = listFile["avatar"].getFiles();
            if (avatars.length > 0)
                formData.append("avatar", avatars[0].file);
            fetch(`/${pathAdmin}/profile`, {
                method: "PATCH",
                body: formData,
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        notyf.error(data.message);
                    }
                    else if (data.code == "success") {
                        notyf.success(data.message);
                    }
                })


        })
}

//Đổi mật khẩu trang thông tin cá nhân
const profilePasswordForm = document.querySelector('#profile-change-password');
if (profilePasswordForm) {
    const validator = new JustValidate('#profile-change-password');
    validator.addField('#password', [
        {
            rule: 'required',
            errorMessage: "Vui lòng nhập mật khẩu của bạn"
        },
        {
            rule: 'minLength',
            value: 3,
            errorMessage: "Mật khẩu cần có ít nhất 3 kí tự"
        },
        {
            rule: 'customRegexp',
            value: /[a-z]/,
            errorMessage: "Mật khẩu cần ít nhất 1 kí tự thường"
        },
        {
            rule: 'customRegexp',
            value: /[A-Z]/,
            errorMessage: "Mật khẩu cần ít nhất 1 kí tự in hoa"
        },
        {
            rule: 'customRegexp',
            value: /[0-9]/,
            errorMessage: "Mật khẩu cần ít nhất 1 chữ số"
        },
        {
            rule: 'customRegexp',
            value: /[^\w\s]/,
            errorMessage: "Mật khẩu cần ít nhất 1 kí tự đặc biệt"
        },
    ])
        .addField('#confirm-password', [
            {
                rule: 'required',
                errorMessage: "Vui lòng xác nhận mật khẩu"
            },
            {
                validator: (value, context) => {
                    // console.log(value)
                    // console.log(context['#password'].elem.value);
                    if (value == context['#password'].elem.value) return true;
                },
                errorMessage: "Mật khẩu xác nhận không chính xác",
            }
        ])
        .onSuccess((event) => {
            const password = {
                password: event.target.password.value,
            }
            fetch(`/${pathAdmin}/profile/change-password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(password),
            })
                .then(res => res.json())
                .then((data) => {
                    if (data.code == "error") {
                        notyf.error(data.message);
                    }
                    else if (data.code == "success") {
                        alertMessage(data);
                        window.location.href = `/${pathAdmin}/profile`;
                    }
                })
        })
}


//Chỉnh sửa trang chủ bên client
const homepage = document.querySelector('#homepage')
if (homepage) {
    const validator = new JustValidate('#homepage');
    validator.addField('#category1', [
        {
            rule: 'required',
            errorMessage: "Vui lòng chọn danh mục thích hợp"
        }
    ])
        .addField('#category2', [
            {
                rule: 'required',
                errorMessage: "Vui lòng chọn danh mục thích hợp"
            }
        ])
        .onSuccess((event) => {
            const formData = new FormData();
            formData.append("category1", event.target.category1.value);
            formData.append("category2", event.target.category2.value);

            fetch(`/${pathAdmin}/setting/client/homepage`, {
                method: "PATCH",
                body: formData,
            })
                .then(res => res.json())
                .then((data) => {
                    if (data.code == "error") {
                        notyf.error(data.message);
                    }
                    else if (data.code == "success") {
                        notyf.success(data.message);
                    }
                })
        })
}