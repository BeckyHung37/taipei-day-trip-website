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
    console.log(image.length);
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
    console.log(image.length);
    for (let i=0; i<image.length; i++){
        let dot = document.createElement("span");
        dot.setAttribute("class", "dot");
        dot.setAttribute("onclick", "javascript:currentSlide(i);");
        document.getElementById("dotGroup").appendChild(dot);
    };
}