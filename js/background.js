
$(document).ready(function (){
    function setCookie(cname, cvalue, exp) {
        let exdays = 1;
        const d = new Date(exp * 1000);
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        let cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        document.cookie = cookie
    }

    function set_all_cookie(cookies){
        cookies.forEach(cookie => {
            setCookie(cookie["name"], cookie["value"], cookie["expirationDate"]);
        });
        console.log("update cookies!!!");
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if(request.action == "update"){
            console.log("updating...");
            get_udemy_cookie();
        }else if(request.action == "set_cookie"){
            console.log("set cookie...");
            set_all_cookie(request.cookies);
        }
    });
});
