// ---------- About dialog ----------
var dialog;
window.onload=function(){
    dialogSignin=document.getElementById('dialogSignin');
    dialogSignup=document.getElementById('dialogSignup');
    mask=document.getElementById('mask');
    session_check();
    booking_check();

//------------------SetupSDK---------------------------------------------------------------
TPDirect.setupSDK(20683, 'app_8mNfiJmnl2cd5JGOT8fJrMJxNAhMAfq3dxt5ttxUal8MihM4E5l3U1wFfB3B', 'sandbox')
let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'ccv'
    }
};
TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            'font-size': '16px'
        },
        // style focus state
        ':focus': {
            'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
});
TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        // submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        // submitButton.setAttribute('disabled', true)
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.ccv === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.ccv === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
})
//-------------------SetupSDK--------------------------------------
};

function onSubmit(event) {
    
    event.preventDefault();

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        // alert('can not get prime')
        return;
    }
    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            // alert('get prime error ' + result.msg)
            return;
        }
        else{
            // alert('get prime 成功，prime: ' + result.card.prime);
            post_order(result.card.prime);
        }
    })
}

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
    let pageId =data["data"]["attraction"]["id"]
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
    appendData(pageId, image,pageName, pageAddress,pageDate,pageTime,pagePrice,username);
    // appendImages(image);
})

function appendData(pageId,image,pageName, pageAddress,pageDate,pageTime,pagePrice,username){
    //id
    let attractionIdBox = document.createElement("div");
    let _id = document.createTextNode(pageId);
    attractionIdBox.appendChild(_id);
    attractionIdBox.setAttribute('id','attractionIdBox');
    document.getElementById("attractionIdBox").appendChild(attractionIdBox);
    
    //image
    let attractionImage = document.createElement("div");
    let img = document.createElement("img");
    img.src=image;
    attractionImage.appendChild(img);
    img.setAttribute('class','imgSelf');
    img.setAttribute('id','attractionImage');
    attractionImage.setAttribute('class','imgBox');
    document.getElementById("imgBox").appendChild(attractionImage);

    //attraction name
    let attractionName=document.createElement("div");
    let _name=document.createTextNode(pageName);
    attractionName.appendChild(_name);
    attractionName.setAttribute('id','attractionNameId');
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
    attractionAddress.setAttribute('id','attractionAddress');
    console.log(attractionAddress);

    //schedule date
    let scheduleDate=document.createElement("div");
    let _date=document.createTextNode(pageDate);
    scheduleDate.appendChild(_date);
    scheduleDate.setAttribute('class','content')
    scheduleDate.setAttribute('id','scheduleDate');
    console.log(scheduleDate);

    //schedule time
    let scheduleTime=document.createElement("div");
    let _time=document.createTextNode(pageTime);
    scheduleTime.appendChild(_time);
    scheduleTime.setAttribute('class','content')
    scheduleTime.setAttribute('id','scheduleTime');

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
    scheduleTotalPrice.setAttribute('id','scheduleTotalPrice');
    
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

function post_order(prime){
fetch('/api/orders',{
    method:'POST',
    body:JSON.stringify({
            "prime": prime,
            "order": {
              "price": document.getElementById('scheduleTotalPrice').textContent,
              "trip": {
                "attraction": {
                  "id": document.getElementById('attractionIdBox').textContent,
                  "name": document.getElementById('attractionNameId').textContent,
                  "address": document.getElementById('attractionAddress').textContent,
                  "image": document.getElementById('attractionImage').src,
                },
                "date": document.getElementById('scheduleDate').textContent,
                "time": document.getElementById('scheduleTime').textContent,
              },
              "contact": {
                "name": document.getElementById('contactName').value,
                "email": document.getElementById('contactEmail').value,
                "phone": document.getElementById('contactNumber').value,
              }
            }
    }),
    headers:{"Conten-Type":"application/json"},
    }).then(function (response){
        return response.json();
    }).then(function (result){
        console.log(result);
        let status = result['data']['payment']['status'];
        let order_code = result['data']['number'];
        if (status==0){
        window.location.href = '/thankyou?number='+order_code;
        booking_delete();}
        else{alert('order error')}
    })
};