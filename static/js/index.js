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
sessionStorage.setItem('loadingFinish',true);
window.addEventListener('scroll', fetchData);
get_data();