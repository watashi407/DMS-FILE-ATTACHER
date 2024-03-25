let tags = [];
const orgId = "20097803016";
const ul = document.querySelector("ul"),
  input = document.querySelector("input"),
  tagNumb = document.querySelector(".details span");

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

    ZOHODESK.get("ticket").then(function(response) {
        if(!response){
            console.log("cant absorb")
        }else{
            ticketId = response["ticket"].id
        }
     }).catch(function(err){
      console.log(err)
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
              "Accept": "application/json;charset=utf-8",
            },
            postBody: {},
            type: "GET",
            data: {
              filter: filter,
            },
            connectionLinkName: "datev_connection",
          };

          ZOHODESK.request(request).then(
            (res) => {
              if (!res) {
                console.log("something happend in server");
              } else {
                const documentResponse = JSON.parse(JSON.parse(JSON.parse(res).response).statusMessage)[0];
                const documentID = documentResponse.id;
                let documentName;
                documentName = documentResponse.name;
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
                      const documentFileID = JSON.parse(JSON.parse(JSON.parse(res).response).statusMessage)[0].document_file_id;
                      let documentFileUrl = `${baseUrl}/document-files/${documentFileID}`;
                      const documentFile = {
                        url: documentFileUrl,
                        headers: {
                          "Accept": "application/octet-stream"
                        },
                        postBody: {},
                        type: "GET",
                        data: {},
                        connectionLinkName: "datev_connection",
                      };
                      ZOHODESK.request(documentFile).then(res => {
                        if(!res){
                            console.log("something happend in server");
                        }
                        else{
                            const documentFileUnrefined = JSON.parse(res).response;

                            const blob = new Blob([documentFileUnrefined], { type: 'application/pdf' });
                            const formData = new FormData();
                            formData.append("file", blob, documentName);
                            
                            let attachmentFIle = {
                                url: `https://desk.zoho.eu/api/v1/tickets/${ticketId}/attachments`,
                                type: "POST",
                                data: {
                                },
                                postBody: {},
                                headers: {
                                    "Content-Type": "application/json",
                                    "Content-Type":"multipart/form-data",
                                    'orgId': orgId
                                },
                                fileObj: [{ "key": "file1", "file": blob }],
                                connectionLinkName:"zoho_desk_connection",
                                
                            }
                        
                            ZOHODESK.request(attachmentFIle).then(res => {
                                console.log(res);
                            }, (error) => {

                                console.log(`something happend ${error}`);
                            })
                        }

                    }, (error) => {
                        console.log(error);
                    })
                    }
                  },
                  (error) => {
                    console.log(error);
                  }
                );
              }
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
