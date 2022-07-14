let url = "https://udemypremiumfree.tk/api/cookie/";

$(document).ready(function (){
    // console.log(document.cookie);

    function get_udemy_cookie(){
        var settings = {
            "url": url,
            "method": "GET",
            "timeout": 0,
        };
        
        $.ajax(settings).done(function (response) {
            json = JSON.parse(JSON.stringify(response));

            let cookies = json.data.cookie;
            cookies.forEach(cookie => {
                setCookie(cookie["name"], cookie["value"], cookie["expirationDate"]);
            });
            console.log("update cookies!!!");
            notification();
        });
    }
    
    function setCookie(cname, cvalue, exp) {
        let exdays = 1;
        const d = new Date(exp * 1000);
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        let cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        document.cookie = cookie
    }
    
    // setTimeout(() => {
    //     if(document.querySelector('a[href="/user/edit-profile/"]') == null){
    //         get_udemy_cookie();
    //     }
    // }, 1000);

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
        ">Udemy Premium Free</h1>
        <p>Vui lòng tải lại trang để sử dụng tài khoản premium miễn phí!</p>
    </div>
</div>
        `;
        console.log(html);
        $("body").append(html);
        console.log("notification");

        $("#notification-btn-close").click(function (){
            $("#notification-bg").hide();
            $("#notification-sec").hide();
        });
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if(request.action == "update"){
            console.log("updating...");
            get_udemy_cookie();
        }
    });
});

