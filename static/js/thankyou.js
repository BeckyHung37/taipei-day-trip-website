let orderCode = window.location.href.split("=")[1];
// ---------- About dialog ----------
var dialog;
window.onload=function(){
    dialogSignin=document.getElementById('dialogSignin');
    dialogSignup=document.getElementById('dialogSignup');
    mask=document.getElementById('mask');
    session_check();
    appendOrderCode(orderCode);
};
function appendOrderCode(orderCode){
    let orderCodeBox = document.createElement('div');
    let _orderCode = document.createTextNode(orderCode);
    orderCodeBox.appendChild(_orderCode);
    orderCodeBox.setAttribute("class","orderCode");
    document.getElementById("orderCodeBox").appendChild(orderCodeBox);
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
            document.getElementById("menuBooking").onclick = redirect_to_booking;
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
            document.getElementById("menuBooking").onclick = redirect_to_booking;
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
function redirect_to_booking(){
    window.location.href = '/booking';
};

// ---------- About dialog --------------------------------------------------------------------------------
