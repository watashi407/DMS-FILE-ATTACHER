const helperIcon = document.querySelector(".popuptext");
const showPopUp = () =>{
    helperIcon.classList.add('add_popup');
}

const hidePopUp = () =>{
    helperIcon.classList.add('hide_popup');
}




const ul = document.querySelector("ul"),
input = document.querySelector("input"),
tagNumb = document.querySelector(".details span");
// let maxTags = 5,
tags = [];
countTags();
createTag();


function countTags(){
    input.focus();
    // tagNumb.innerText = maxTags - tags.length;
}

function createTag(){
    ul.querySelectorAll("li").forEach(li => li.remove());
    tags.slice().reverse().forEach(tag =>{
        let liTag = `<li>${tag} <span class="close_tag" onclick="remove(this, '${tag}')"> ❌ </span></li>`;
        ul.insertAdjacentHTML("afterbegin", liTag);
    });
    countTags();
}

function remove(element, tag){
    let index  = tags.indexOf(tag);
    tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
    element.parentElement.remove();
    countTags();
}

function addTag(e){
    if(e.key == "Enter"){
        let tag = e.target.value.replace(/\s+/g, ' ');
        if(tag.length > 1 && !tags.includes(tag)){
            if(tags.length < 5){
                tag.split(',').forEach(tag => {
                    tags.push(tag);
                    createTag();
                });
            }
        }
        e.target.value = "";
    }
}

input.addEventListener("keyup", addTag);
const removeBtn = document.querySelector(".details button");
removeBtn.addEventListener("click", () =>{
    tags.length = 0;
    ul.querySelectorAll("li").forEach(li => li.remove());
    countTags();
});











window.onload = function () {
    ZOHODESK.extension.onload().then((App) => {



const sumbitRecord = document.querySelector("#submit");
sumbitRecord.addEventListener("click", ()  =>{









if (tags != null && tags != "") {
                
    // const zohoDeskUpdateTicket = `${zohodeskBaseUrl}/tickets`;

    // if(checkOrdeAppState || checkOrdeAppState === 'true'){
    //     useToggle = false;
    // }else{
    //     useToggle = true;
    // }
  

    // let post = {
    //     "cf_order_app": useToggle,
    // }
    // console.log(post)
   

    // const request = {
    //     url: `${zohoDeskUpdateTicket}/${ticketResponse.id}`,
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'orgId': orgId
    //     },
    //     postBody: {
    //         'cf': post
    //     },
    //     type: 'PATCH',
    //     data: {

    //     },
    //     connectionLinkName: "zoho_desk_connection"
    // }

    // ZOHODESK.request(request).then(res => {
    //     const patchRespone = JSON.parse(res).response;
    //                   /** checking the task activity response */
    //     if (patchRespone) {
    //         ZOHODESK.invoke("ROUTE_TO", "ticket.properties");
    //         ZOHODESK.invoke("ROUTE_TO", "ticket.task");

    //         ZOHODESK.notify({
    //             title: "Order App Notification",
    //             content: `Please review the activity task created as the client has no Client ID or Number.`,
    //             icon: "error",
    //             autoClose: false
    //         });
    //     }
    // }, (error) => {

    //     console.log(error);
    // })

}
else{
    ZOHODESK.notify({
        title: "DMS APP : WARNING ❗",
        content: `Please dont submit empty value`,
        icon: "failure",
        autoClose: true
    });
}






})
    })
}