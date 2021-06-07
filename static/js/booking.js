// ---------- About dialog ----------
var dialog;
window.onload=function(){
    dialogSignin=document.getElementById('dialogSignin');
    dialogSignup=document.getElementById('dialogSignup');
    mask=document.getElementById('mask');
    session_check();
    booking_check();
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




// ---------- About dialog --------------------------------------------------------------------------------
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
        // console.log(res['data']);
        if(res['data']!=null){
            document.getElementById("menuSignIn").innerHTML = '登出';
            document.getElementById("menuSignIn").onclick = user_signout;
            document.getElementById("menuBooking").onclick = parent.location.reload;
            console.log('why');
        }else{
            window.location.href = '/'
        }
    }
    req.send();
};
function user_signout(){
    let req = new XMLHttpRequest; //跟flask連線用的物件（起request用）
    req.open('delete','/api/user',true);
    req.onload = function(){
        let res = JSON.parse(req.response);
        // console.log(res['ok']);
        if(res['ok']==true){
            document.getElementById("menuSignIn").innerHTML = '登入/註冊';
            document.getElementById("menuSignIn").onclick = showDialogSignIn;showMask;
            parent.location.reload();
        }
    }
    req.send();
}


// ---------- About dialog --------------------------------------------------------------------------------




fetch("/api/booking", {method:"GET"}).then(function(response) {
    return response.json()
}).then(function (data){
    console.log(document.cookie);
    let image =data["data"]["attraction"]["image"]
    let pageName = data["data"]["attraction"]["name"]
    let pageAddress = data["data"]["attraction"]["address"]
    let pageDate = data["date"]
    let pageTime = data["time"]
    let pagePrice = data["price"]
    let username = sessionStorage.getItem('user_name');
    // console.log(image)
    // console.log(pageName)
    // console.log(pageAddress)
    // console.log(pageDate)
    // console.log(pageTime)
    // console.log(pagePrice)
    if (pageTime == 'afternoon'){
        pageTime = '下午4點到晚上7點';
    } 
    else{
        pageTime = '早上9點到中午12點';
    }
    appendData(image,pageName, pageAddress,pageDate,pageTime,pagePrice,username);
    // appendImages(image);
})

function appendData(image,pageName, pageAddress,pageDate,pageTime,pagePrice,username){
    //image
    let attractionImage = document.createElement("div");
    let img = document.createElement("img");
    img.src=image;
    attractionImage.appendChild(img);
    img.setAttribute('class','imgSelf');
    attractionImage.setAttribute('class','imgBox');
    document.getElementById("imgBox").appendChild(attractionImage);

    //attraction name
    let attractionName=document.createElement("div");
    let _name=document.createTextNode(pageName);
    attractionName.appendChild(_name);
    attractionName.setAttribute('class','attractionTitle')

    //**replace to attractionNameBox
    let oldAttractionName = document.getElementById("attractionNameId");
    let attractionNameBox = oldAttractionName.parentNode;
    attractionNameBox.replaceChild(attractionName, oldAttractionName);

    //attraction address
    let attractionAddress=document.createElement("div");
    let _address=document.createTextNode(pageAddress);
    attractionAddress.appendChild(_address);
    attractionAddress.setAttribute("class","content")
    console.log(attractionAddress);

    //schedule date
    let scheduleDate=document.createElement("div");
    let _date=document.createTextNode(pageDate);
    scheduleDate.appendChild(_date);
    scheduleDate.setAttribute('class','content')
    console.log(scheduleDate);

    //schedule time
    let scheduleTime=document.createElement("div");
    let _time=document.createTextNode(pageTime);
    scheduleTime.appendChild(_time);
    scheduleTime.setAttribute('class','content')

    //schedule price
    let schedulePrice=document.createElement("div");
    let _price=document.createTextNode(pagePrice);
    schedulePrice.appendChild(_price);
    schedulePrice.setAttribute('class','content')

    // schedule total price
    let scheduleTotalPrice=document.createElement("div");
    let _totalPrice=document.createTextNode(pagePrice);
    scheduleTotalPrice.appendChild(_totalPrice);
    scheduleTotalPrice.setAttribute('class','infoSubtitle')
    
    //**replace to infoBox
    let oldAttractionAddress=document.getElementById("attractionAddress");
    let infoBox1 = oldAttractionAddress.parentNode;
    infoBox1.replaceChild(attractionAddress,oldAttractionAddress);

    let oldScheduleDate=document.getElementById("scheduleDate");
    let infoBox2 = oldScheduleDate.parentNode;
    infoBox2.replaceChild(scheduleDate,oldScheduleDate);

    let oldScheduleTime=document.getElementById("scheduleTime");
    let infoBox3 = oldScheduleTime.parentNode;
    infoBox3.replaceChild(scheduleTime,oldScheduleTime);

    let oldSchedulePrice=document.getElementById("schedulePrice")
    let infoBox4 = oldSchedulePrice.parentNode;
    infoBox4.replaceChild(schedulePrice,oldSchedulePrice);

    let oldScheduleTotalPrice=document.getElementById("scheduleTotalPrice")
    let infoBox5 = oldScheduleTotalPrice.parentNode;
    infoBox5.replaceChild(scheduleTotalPrice,oldScheduleTotalPrice);

    //username
    let userName=document.createElement("div");
    let _username=document.createTextNode(username);
    userName.appendChild(_username);
    userName.setAttribute('class','infoTitle')

    let oldUserName = document.getElementById("userName");
    let titleBox = oldUserName.parentNode;
    titleBox.replaceChild(userName,oldUserName);
}
function booking_check(){
    let req = new XMLHttpRequest; //跟flask連線用的物件（起request用）
    req.open('get','/api/booking',true); //前端打request到後端
    req.onload = function(){ //接收到後端傳來的訊息，才會onload
        let res = JSON.parse(req.response);
        console.log(res['data']);
        if(res['data']==null){
            booking_delete()
        }
    }
    req.send();
}

function booking_delete(){
    let req = new XMLHttpRequest; //跟flask連線用的物件（起request用）
    // let formData = new FormData;
    let bookingInfo = document.querySelector('#bookingInfo');
    let titleUserInfo = document.querySelector('#titleUserInfo');
    let userInfo = document.querySelector('#userInfo');
    let titleCreditCard = document.querySelector('#titleCreditCard');
    let creditCardInfo = document.querySelector('#creditCardInfo');
    let order = document.querySelector('#order');
    req.open('delete','/api/booking',true); //前端打request到後端
    req.onload = function(){ //接收到後端傳來的訊息，才會onload
        let res = JSON.parse(req.response);
        if(res['error']!=true){
            bookingInfo.remove();
            titleUserInfo.remove();
            userInfo.remove();
            titleCreditCard.remove();
            creditCardInfo.remove();
            order.remove();
            let emptyStatus = document.createElement("div");
            let msg = '目前沒有任何待預訂的行程'
            let emptyMessage = document.createTextNode(msg);
            emptyStatus.appendChild(emptyMessage);
            emptyStatus.setAttribute('class','emptyStatus');
            document.getElementById('empty').appendChild(emptyStatus);

        }
    }
    req.send();
};
