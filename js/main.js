let base_url = "http://localhost:8000/api/";

// $(".btn-update").click(function (){
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//         chrome.tabs.sendMessage(tabs[0].id, {action: "update"}, function(response){

//         });
//     });
// });

function set_cookie(cookies){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "set_cookie", cookies: cookies}, function(response){
            notification()
        });
    });
}

function get_cookie(platform){
    var settings = {
        "url": base_url+"cookie/"+platform+"/",
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function (response) {
        json = JSON.parse(JSON.stringify(response));

        let cookie = json.data.cookie;
        console.log(cookie);
        set_cookie(cookie);
    }).fail(function() {
        alert("Out of cookie");
    })
}

function get_all_platforms(){
    var settings = {
        "url": base_url+"platforms/",
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function (response) {
        console.log(response);
        console.log(response.data);
        console.log(response.data.platforms);
        response.data.platforms.forEach(element => {
            $(".cookies").append(get_platform_card(element));
        });
        $(".cookies").append(`
            <div class="col-4"></div>
            <div class="col-4"></div>
            <div class="col-4"></div>`);

        btn_get_cookie = document.getElementsByClassName("btn-get-cookie");
        [].forEach.call(btn_get_cookie, function (element) {
            element.addEventListener("click", function (){
                chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                    let url = tabs[0].url.toLowerCase();
                    let platform = $(element).attr("data-platform").toLowerCase();
                    if(url.includes(platform)){
                        $(element).text("Getting...");
                        get_cookie(platform);
                        $(element).text("Get Cookie");
                    }else{
                        alert("Please open "+platform+" site before");
                    }
                });
                
            });
        });
    });

    
    
}

$(document).ready(function (){
    get_all_platforms();
});

function get_platform_card(platform){
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]

    const days = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
      ]

    let d = new Date(platform.last_update);
    console.log(d);

    const year = d.getFullYear()
    const date = d.getDate()
    const monthName = months[d.getMonth()]
    const dayName = days[d.getDay()]
    const formatted = `${dayName}, ${date} ${monthName} ${year}`
    console.log(formatted)
    return `<div class="col-4 cookie-item">
        <div class="cookie-card card" style="width: 18rem;">
            <div class="sec-image">
                <img src="`+ platform.image +`" class="card-img-top">
            </div>
            <div class="card-body">
                <h5 class="card-title">`+ platform.name +`</h5>
                <p class="card-text">Last update: `+ formatted +`</p>
                <div class="sec-action">
                    <a href="#" data-platform="`+ platform.key +`" class="btn btn-primary btn-get-cookie">Get Cookie</a>
                </div>
            </div>
        </div>
    </div>`;
}

function notification(){
    let html = `
    <div id="notification-bg" style="position: absolute; top: 0; left: 0; width: 100%; 
        height: 100%; z-index: 99999; background-color: black; opacity: 0.5;">
    </div>
    <div id="notification-sec" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 999999; ">
    <div id="notification-popup" style="width: 300px;position: relative;top: 50%;left: 50%;transform: translate(-50%, -50%);background-color: white;padding: 20px;">
        <a id="notification-btn-close" style="
            position: absolute;
            right: 0px;
            margin-right: 20px;
            cursor: pointer;
        ">X</a>
        <h1 style="
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
        ">Free Premium Account</h1>
        <p>Vui lòng tải lại trang để sử dụng tài khoản premium miễn phí!</p>
    </div>
    </div>
    `;
    console.log(html);
    $(".content").append(html);
    console.log("notification");

    $("#notification-btn-close").click(function (){
        $("#notification-bg").hide();
        $("#notification-sec").hide();
        chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
            chrome.tabs.reload(arrayOfTabs[0].id);
            window.close();
        });
    });
}