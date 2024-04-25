let tags = [];
let orgId = "20097803016" || "20081917756";
let fileName;
const ul = document.querySelector("ul"),
  input = document.querySelector("input"),
  tagNumb = document.querySelector(".details span");


function extractBinary(data){
  const startIndex = data.indexOf('%PDF');

  const endIndex = data.lastIndexOf('------WebKitFormBoundary');
  const pdfContent = data.substring(startIndex, endIndex);

  return pdfContent;
}  

createTag();

/*
Creation of Li function 
*/
function createTag() {
  ul.querySelectorAll("li").forEach((li) => li.remove());
  tags
    .slice()
    .reverse()
    .forEach((tag) => {
      let liTag = `<li>${tag} <span class="close_tag" onclick="remove(this, '${tag}')"> ❌ </span></li>`;
      ul.insertAdjacentHTML("afterbegin", liTag);
    });
}

/*
Remove Function
*/
function remove(element, tag) {
  let index = tags.indexOf(tag);
  tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
  element.parentElement.remove();
}

/* remove list tag */
const removeBtn = document.querySelector("#remove");
removeBtn.addEventListener("click", () => {
  tags.length = 0;
  ul.querySelectorAll("li").forEach((li) => li.remove());
});

/*error message */
const promptMessages = (message, messageType) => {
  const loadingContainer = document.getElementById("popupMessageContainer");

  loadingContainer.innerHTML = "";
  loadingContainer.style.display = "block";
  loadingContainer.classList.add("popupMessageContainer");

  const messageCreation = document.createElement("div");
  messageCreation.classList.add("error-message");
  messageCreation.innerText = message;

  const loadingBar = document.createElement("div");
  loadingBar.id = "loading-container";
  loadingBar.classList.add(messageType);

  loadingContainer.appendChild(messageCreation);
  loadingContainer.appendChild(loadingBar);

  setTimeout(() => {
    loadingBar.style.display = "none";
    messageCreation.style.display = "none";
    loadingContainer.style.display = "none";
  }, 4000);
};

/*
Addtag Function
*/
input.addEventListener("keyup", addTag);
function addTag(e) {
  if (e.key === "Enter") {
    let tag = e.target.value.replace(/\s+/g, " ").trim();
    const numberPattern = /^\d+$/;

    if (tag.length > 1 && numberPattern.test(tag) && !tags.includes(tag)) {
      let inputTags = tag.split(",");
      if (tags.length + inputTags.length <= 5) {
        inputTags.forEach((tagPart) => {
          if (numberPattern.test(tagPart)) {
            tags.push(tagPart.trim());
            createTag();
          }
        });
      } else {
        textMessage =
          "Error: You have reached the 5-document number entry limit.❗";
        messageType = "loading-bar-error";
        promptMessages(textMessage, messageType);
      }
    } else {
      if (tags.includes(tag)) {
        textMessage = "Message: This value has already been added.❗";
        messageType = "loading-bar-error";
        promptMessages(textMessage, messageType);
      } else {
        textMessage =
          "Error: Invalid input. Please enter only numerical values.❗";
        messageType = "loading-bar-error";
        promptMessages(textMessage, messageType);
      }
    }
    e.target.value = "";
  }
}

/* API REQUEST */
window.onload = function () {
  ZOHODESK.extension.onload().then((App) => {
    let ticketId;

    ZOHODESK.get("ticket")
      .then(function (response) {
        if(response){
          ticketId = response["ticket"].id;
          return;
        }
      })
      .catch(function (err) {
        console.log(err);
      });

    const sumbitRecord = document.querySelector("#submit");
    sumbitRecord.addEventListener("click", () => {
      if (tags != null && tags != "") {
        const orgId = "20081917756";

        tags.forEach((tag) => {
          const baseUrl =
            "https://datevconnect.riecken-webservices.at/datev/api/dms/v2";
          let requestUrl = `${baseUrl}/documents`;

          let filter = `number eq ${tag}`;
          const request = {
            url: requestUrl,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json;charset=utf-8",
            },
            postBody: {},
            type: "GET",
            data: {
              filter: filter,
            },
            connectionLinkName: "datev_connection",
          };

          ZOHODESK.request(request).then((res) => {
              if(!res){
                console.log(error)
                return
              }
              
                const documentResponse = JSON.parse(
                  JSON.parse(JSON.parse(res).response).statusMessage
                )[0];           
                const documentID = documentResponse.id;
     
                let documentStructure = `${baseUrl}/documents/${documentID}/structure-items`;

                const requestStructure = {
                  url: documentStructure,
                  headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json;charset=utf-8",
                  },
                  postBody: {},
                  type: "GET",
                  data: {},
                  connectionLinkName: "datev_connection",
                };

                ZOHODESK.request(requestStructure).then(
                  (res) => {
                    if (!res) {
                      console.log("something happend in server");
                    } else {
                      let documentFileID = JSON.parse(JSON.parse(JSON.parse(res).response).statusMessage).shift().document_file_id;
                        console.log(documentFileID)
                        console.log(ticketId)
                      var triggerAttachment = {
                        url: "https://www.zohoapis.eu/crm/v2/functions/testemail/actions/execute",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        postBody: {},
                        type: 'POST',
                        data: {
                            "auth_type":"apikey",
                            "zapikey":"1003.eb88b4a772b1f4098656ebd6f6a1e895.10ba8555d32264469535fee12d98a084",
                            "documentId": documentFileID,
                            "ticketId":ticketId
                        }
                    }
                    ZOHODESK.request(triggerAttachment).then(res => {
                        // Implement your logic here
                       let reponseAttchment =JSON.parse(res).response;
                       console.log(reponseAttchment);
                    }, (error) => {
                        // Implement your logic here
                        console.log(error);
                    })
  

                    }
                  },
                  (error) => {
                    console.log(error);
                  }
                );

            },
            (error) => {
              console.log(error);
            }
          );
        });
      } else {
        textMessage = "Error: Don`t submit empty value.❗";
        messageType = "loading-bar-error";
        promptMessages(textMessage, messageType);
      }
    });
  });
};

// ZOHODESK.notify({
//     title: "DMS APP : WARNING ❗",
//     content: `Please dont submit empty value`,
//     icon: "failure",
//     autoClose: true
// });
