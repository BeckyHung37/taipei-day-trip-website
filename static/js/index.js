// ---------- About dialog ----------
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
// ---------- About dialog ----------
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
            document.getElementById("menuBooking").onclick = null;
            console.log('why');
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
function get_data(page=0){
    if (sessionStorage.getItem('loadingFinish')=='true'){
        let keyword = document.getElementById('keyword').value;
        if (keyword!=null){var url = "/api/attractions?page="+page.toString()+"&keyword="+keyword;}
        else{var url = "/api/attractions?page="+page.toString();}
        // XMLHttpRequest是js內建的物件，專門用來和伺服器做連線
        let req=new XMLHttpRequest();
        // 設定連線方法是什麼，使用get取得網頁/連線的網址
        req.open("get",url);
        // open只是做設定，下面才是送出
        // 偵測連線狀態的結束
        req.onload=function(){
            sessionStorage.setItem('loadingFinish',true);
            let nextPage = JSON.parse(this.response)['nextPage'];
            sessionStorage.setItem('nextPage', nextPage);
            let response=JSON.parse(this.response)["data"] //回傳值
            var contentBox = document.getElementById("contentBox");
            while (contentBox.firstChild){
                contentBox.removeChild(contentBox.lastChild);}
            if(response[0]!=null){
                for(i=0;i<response.length;i++){
                    let name = response[i]["name"];
                    let mrt = response[i]["mrt"];
                    let category = response[i]["category"];
                    let image = response[i]["images"][0];
                    let ID = response[i]["id"];
                    moreInfo(name, mrt, category, image, ID);}}
            else{
                // var contentBox = document.getElementById("contentBox");
                // while (contentBox.firstChild){
                //     contentBox.removeChild(contentBox.lastChild);}
                let empty_message=document.createTextNode('查無結果');
                contentBox.appendChild(empty_message);    
            }        
        }
        req.send();
        sessionStorage.setItem('loadingFinish',false);
    }
}

function append_data(page=0){
    if (sessionStorage.getItem('loadingFinish')=='true'){
        let keyword = document.getElementById('keyword').value;
        if (keyword!=null){var url = "/api/attractions?page="+page.toString()+"&keyword="+keyword;}
        else{var url = "/api/attractions?page="+page.toString();}
        // XMLHttpRequest是js內建的物件，專門用來和伺服器做連線
        let req=new XMLHttpRequest();
        // 設定連線方法是什麼，使用get取得網頁/連線的網址
        req.open("get",url);
        // open只是做設定，下面才是送出
        // 偵測連線狀態的結束
        req.onload=function(){
            sessionStorage.setItem('loadingFinish',true);
            let nextPage = JSON.parse(this.response)['nextPage'];
            sessionStorage.setItem('nextPage', nextPage);
            let response=JSON.parse(this.response)["data"] //回傳值
            if(response[0]!=null){
                for(i=0;i<response.length;i++){
                    let name = response[i]["name"];
                    let mrt = response[i]["mrt"];
                    let category = response[i]["category"];
                    let image = response[i]["images"][0];
                    let ID = response[i]["id"];
                    moreInfo(name, mrt, category, image, ID);}}
            else{
                let empty_message=document.createTextNode('查無結果');
                contentBox.appendChild(empty_message);    
            }        
        }
        req.send();
        sessionStorage.setItem('loadingFinish',false);
    }
}

function moreInfo(name, mrt, category, image, ID){
    //-------------------- for attraction.html ---------------------
    let getSpotId="attraction/" + ID;
    let attractionBox=document.createElement("a");
    attractionBox.setAttribute("href",getSpotId);
    //-------------------- for attraction.html ---------------------

    attractionBox.setAttribute("class", "attractionBox");

    //attraction name
    let attractionName=document.createElement("div");
    let _name=document.createTextNode(name);
    attractionName.appendChild(_name);
    attractionName.setAttribute("class", "attractionName");

    //tag mrt
    let attractionTag=document.createElement("div");
    let tagMrt=document.createElement("div");
    let _mrt=document.createTextNode(mrt);
    tagMrt.appendChild(_mrt);
    attractionTag.appendChild(tagMrt);
    tagMrt.setAttribute("class", "tagMrt");

    //tag category

    let tagCategory=document.createElement("div");
    let _category=document.createTextNode(category);
    tagCategory.appendChild(_category);
    attractionTag.appendChild(tagCategory);
    tagCategory.setAttribute("class", "tagCategory");
    attractionTag.setAttribute("class", "attractionTag");

    //image
    let imageMask=document.createElement("div");
    let imgBox=document.createElement("img");
    imgBox.src=image;
    imageMask.appendChild(imgBox);
    imgBox.getAttribute("img");
    imageMask.setAttribute("class", "imageMask");

    //放進attractionBox後再放進contentBox
    attractionBox.appendChild(imageMask);
    attractionBox.appendChild(attractionName);
    attractionBox.appendChild(attractionTag);
    document.getElementById("contentBox").appendChild(attractionBox);

}

function fetchData() {
    let triggerDistance = 0;
    let footerNode = document.getElementById("footer");
    let distance = footerNode.getBoundingClientRect().bottom - window.innerHeight;
    if (distance == triggerDistance) {
        let nextPage = sessionStorage.getItem('nextPage');
        if(nextPage!='null'){append_data(page=nextPage)}
    };
    };

// function booking(){
//     let req = new XMLHttpRequest; //跟flask連線用的物件（起request用）
//     req.open('get','/api/user',true);
//     req.onload = function(){
//         let res = JSON.parse(req.response);
//         console.log(res['data']);
//         if(res['data']!=null){


//         }
//     }
//     req.send();
    
//     }    
sessionStorage.setItem('loadingFinish',true);
window.addEventListener('scroll', fetchData);
get_data();

