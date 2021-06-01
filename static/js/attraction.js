let pageId = window.location.pathname.split("/")[2];

fetch("/api/attraction/"+ pageId, {method:"GET"}).then(function(response) {
    return response.json()
}).then(function (data){
    let image =data["data"][0]["images"]
    let pageName = data["data"][0]["name"]
    let pageCategory = data["data"][0]["category"]
    let pageMrt = data["data"][0]["mrt"]
    let pageDescription = data["data"][0]["description"]
    let pageAddress = data["data"][0]["address"]
    let pageTransport = data["data"][0]["transport"]
    appendData(pageName, pageCategory,pageMrt,pageDescription,pageAddress,pageTransport);
    appendDot(image);
    appendImages(image);
})
var dialog;
window.onload=function(){
    dialogSignin=document.getElementById('dialogSignin');
    dialogSignup=document.getElementById('dialogSignup');
    mask=document.getElementById('mask');
    session_check();
};
function showMask(){
    mask.style.display="block";
}
function hideMask(){
    mask.style.display="none";
}
function showDialogSignIn(){
    dialogSignin.style.display="block";
}
function hideDialogSignIn(){
    dialogSignin.style.display="none";
}
function showDialogSignUp(){
    dialogSignup.style.display="block";
}
function hideDialogSignUp(){
    dialogSignup.style.display="none";
}
function hideMsgSignUp(){
    errorMsgSignUp.style.display="none";
    successedMsgSignUp.style.display="none";
}
function hideMsgSignIn(){
    errorMsgSignIn.style.display="none";
    successedMsgSignIn.style.display="none";
}
function cleanInput(){
    document.getElementById("signInPwd").value = "";
    document.getElementById("signInEmail").value = "";
    document.getElementById("signUpName").value = "";
    document.getElementById("signUpEmail").value = "";
    document.getElementById("signUpPwd").value = "";
}
function user_signup(){
    let req = new XMLHttpRequest; //跟flask連線用的物件（起request用）
    let formData = new FormData();//傳遞資料用
    let name = document.getElementById("signUpName").value;
    let email = document.getElementById("signUpEmail").value;
    let pwd = document.getElementById("signUpPwd").value;
    req.open('post','/api/user',true);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("pwd", pwd);
    req.onload = function(){
        let res = JSON.parse(req.response); //變成json物件
        if(res['error']==true){
            errorMsgSignUp.style.display="block";
            document.getElementById("errorMsgSignUp").innerHTML = res['message'];
        }
        else{
            successedMsgSignUp.style.display="block";
            errorMsgSignUp.style.display="none";
            window.setTimeout("hideDialogSignUp();hideMask();cleanInput();hideMsgSignUp()",1500);
        }
    }
    req.send(formData); //把資料送去後端
}
function user_signin(){
    let req = new XMLHttpRequest; //跟flask連線用的物件（起request用）
    let formData = new FormData();//傳遞資料用
    let email = document.getElementById("signInEmail").value;
    let pwd = document.getElementById("signInPwd").value;
    req.open('patch','/api/user',true);
    formData.append("email", email);
    formData.append("pwd", pwd);
    req.onload = function(){
        let res = JSON.parse(req.response);
        if(res['error']==true){
            errorMsgSignIn.style.display="block";
            document.getElementById("errorMsgSignIn").innerHTML = res['message'];
        }
        else{
            successedMsgSignIn.style.display="block";
            errorMsgSignIn.style.display="none";
            window.setTimeout("hideDialogSignIn();hideMask();cleanInput();hideMsgSignIn()",1500);
            document.getElementById("menuSignIn").innerHTML = '登出';
            document.getElementById("menuSignIn").onclick = user_signout;
            parent.location.reload();
        }
    }
    req.send(formData);
};
function session_check(){
    let req = new XMLHttpRequest; //跟flask連線用的物件（起request用）
    req.open('get','/api/user',true);
    req.onload = function(){
        let res = JSON.parse(req.response);
        console.log(res['data']);
        if(res['data']!=null){
            document.getElementById("menuSignIn").innerHTML = '登出';
            document.getElementById("menuSignIn").onclick = user_signout;
            document.getElementById("menuBooking").onclick = null;
            console.log('why');
        }
    }
    req.send();
}
function user_signout(){
    let req = new XMLHttpRequest; //跟flask連線用的物件（起request用）
    req.open('delete','/api/user',true);
    req.onload = function(){
        let res = JSON.parse(req.response);
        console.log(res['ok']);
        if(res['ok']==true){
            document.getElementById("menuSignIn").innerHTML = '登入/註冊';
            document.getElementById("menuSignIn").onclick = showDialogSignIn;showMask;
            parent.location.reload();
        }
    }
    req.send();
}

function appendData(pageName, pageCategory,pageMrt,pageDescription,pageAddress,pageTransport){
//------attractionInfoBox------

//attraction name
let attractionName=document.createElement("div");
let _name=document.createTextNode(pageName);
attractionName.appendChild(_name);
attractionName.setAttribute("class","attractionName");

//attraction tag
let attractionTag=document.createElement("div");
attractionTag.setAttribute("class", "attractionTag");

//tag category
let tagCategory=document.createElement("div");
let _category=document.createTextNode(pageCategory);
tagCategory.appendChild(_category);
attractionTag.appendChild(tagCategory);
tagCategory.setAttribute("class", "tagCategory");

//at
let atString=document.createElement("p");
let _at=document.createTextNode("at");
atString.appendChild(_at);
attractionTag.appendChild(atString);

//tag mrt
let tagMrt=document.createElement("div");
let _mrt=document.createTextNode(pageMrt);
tagMrt.appendChild(_mrt);
attractionTag.appendChild(tagMrt);
tagMrt.setAttribute("class", "tagMrt");


//replace to attractionInfo
let oldAttractionName = document.getElementById("attractionNameId");
let attractionInfo = oldAttractionName.parentNode;
attractionInfo.replaceChild(attractionName, oldAttractionName);

let oldAttractionTag = document.getElementById("attractionTagId");
attractionInfo.replaceChild(attractionTag, oldAttractionTag);

//------attractionInfoBox------

//------attractionContentBox------
//description
let attractionDescription=document.createElement("div");
let _description=document.createTextNode(pageDescription);
attractionDescription.appendChild(_description);
attractionDescription.setAttribute("class","attractionDescription")

//address
let attractionAddress=document.createElement("div");
let _address=document.createTextNode(pageAddress);
attractionAddress.appendChild(_address);
attractionAddress.setAttribute("class","attractionAddress")

//transport
let attractionTransport=document.createElement("div");
let _transport=document.createTextNode(pageTransport);
attractionTransport.appendChild(_transport);
attractionTransport.setAttribute("class","attractionTransport")

//replace to attractionContentBox
let oldAttractionDescription = document.getElementById("attractionDescriptionId");
let attractionContentBox = oldAttractionDescription.parentNode;
attractionContentBox.replaceChild(attractionDescription, oldAttractionDescription);

let oldAttractionAddress = document.getElementById("attractionAddressId");
attractionContentBox.replaceChild(attractionAddress, oldAttractionAddress);

let oldAttractionTransport = document.getElementById("attractionTransportId");
attractionContentBox.replaceChild(attractionTransport, oldAttractionTransport);

// let attractionContentBox = document.getElementById("attractionContentBox");
// let oldAttractionDescription = document.querySelectorAll('div')[0];
// attractionContentBox.replaceChild(attractionDescription, oldAttractionDescription);

// let oldAttractionAddress = document.querySelectorAll('div')[2];
// attractionContentBox.replaceChild(attractionAddress, oldAttractionAddress);

// let oldAttractionTransport = document.querySelectorAll('div')[4];
// attractionContentBox.replaceChild(attractionTransport, oldAttractionTransport);

//------attractionContentBox------
}

// 設定一個引數記錄當前是第幾張圖片
var slideIndex = 1;
// showSlides(slideIndex);


// 按鈕的點擊事件
function plusSlides(n) {
    showSlides(slideIndex += n);
}


// 圓點的點擊事件
function currentSlide(n) {
    showSlides(slideIndex = n);
}

// 設定當前在第幾張的計算方式
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    // 一旦設定這個屬性，所在的圖片就會顯示
    slides[slideIndex - 1].style.display = "block";
    // 一旦設定這個屬性，所在的小圓點就會變化
    dots[slideIndex - 1].className += " active";
}

function appendImages(image){
    // console.log(image.length);
    for (let i=0; i<image.length; i++){
        let mySlides = document.createElement("div");
        let img = document.createElement("img");
        img.src=image[i];
        mySlides.appendChild(img);
        img.getAttribute("img");
        mySlides.setAttribute("class","mySlides");
        document.getElementById("imageGallery").appendChild(mySlides);
        showSlides(1)
    };
}

function appendDot(image){
    // console.log(image.length);
    for (let i=0; i<image.length; i++){
        let dot = document.createElement("span");
        dot.setAttribute("class", "dot");
        dot.setAttribute("onclick", "javascript:currentSlide(i);");
        document.getElementById("dotGroup").appendChild(dot);
    };
};
