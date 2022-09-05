const ws = new WebSocket("ws://localhost:8080/ws");

let btn = document.getElementById("btn");
let txtBox = document.getElementById("input");
let output = document.getElementById("msgOut");
let postButton = document.getElementById("create-post-button");
let submitPostButton = document.getElementById("submit-post-button");
let submitCommentButton = document.getElementById("submit-comment-button");
let postModal = document.getElementById("post-modal");
let postContent = document.getElementById("post-content-text");
let postTitle = document.getElementById("post-title-text");
let commentContent = document.getElementById("comment-content-text");
let postDisplay = document.getElementById("post-feed");
let content = document.getElementById("content");
let msgArr = [];
let objData = {};
let commentData = {};
let sendingArr = [];
const loginButton = document.getElementById("login-button");
const loginSubmitButton = document.getElementById("login-submit-button");
const signUpModal = document.getElementById("signupModal");
const signUpButton = document.getElementById("signup-submit-button");
const signUpForm = document.getElementById("signup-form");
let duplicateUsername = false;
let duplicateEmail = false;

let regFormToGo = {};

let modalBackdrop = document.getElementsByClassName("modal-backdrop");

let clientFormValidated = false;

let usernameInvalid = document.getElementById("validateUsername");
let emailInvalid = document.getElementById("validateEmail");
let passwordInvalid = document.getElementById("validatePassword");
let firstName = document.getElementById("signup-firstname");
let lastName = document.getElementById("signup-lastname");

// client side websocket
ws.onopen = () => {
    console.log("Connection to server established...");
};

submitPostButton.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("submit---", postButton);
    postButton.style.display = "block";
    postModal.style.display = "none";

    objData["title"] = postTitle.value;
    objData["postcontent"] = postContent.value;
    objData["type"] = "post";
    objData["posttime"] = new Date().toISOString().slice(0, 10);

    postTitle.value = "";
    postContent.value = "";

    // message sent to server
    ws.send(JSON.stringify(objData));
});

// message received from server side
ws.onmessage = (e) => {
    let data = JSON.parse(e.data);
    console.log("datatype", data.tipo);
    console.log(data);

    if (data.tipo === "post") {
        msgArr.push(
            data.title +
                "\n" +
                data.postcontent +
                "\n" +
                data.user +
                " " +
                data.posttime
        );
        content.textContent += "\n" + msgArr[msgArr.length - 1];
    }

    if (data.tipo === "comment") {
        alert(`Comment received${data.commentcontent}`);
    }

    if (data.tipo === "formValidation") {
        if (formValidation(data)) formValidated();
    }
    console.log("Received this message from server....", data);
};

submitCommentButton.addEventListener("click", function (e) {
    e.preventDefault();
    postButton.style.display = "block";
    postModal.style.display = "none";

    commentData["commentcontent"] = commentContent.value;
    commentData["type"] = "comment";
    commentData["commenttime"] = new Date().toISOString().slice(0, 10);

    commentContent.value = "";

    console.log(commentData);
    ws.send(JSON.stringify(commentData));
});

postButton.addEventListener("click", function (e) {
    e.preventDefault();

    postButton.style.display = "none";
    postModal.style.display = "block";
});

const formValidation = (input) => {
    let okForm = true;

    usernameInvalid.innerText = "";
    console.log("data.usernameLength");
    if (input.usernameLength) {
        usernameInvalid.innerText =
            "Your username must be at least 5 characters\n";

        usernameInvalid.style.display = "block";
        okForm = false;
        console.log("usernameLength");
    }
    if (input.usernameDuplicate) {
        usernameInvalid.innerText =
            "This username already exists. Please choose another";
        usernameInvalid.style.display = "block";
        okForm = false;
    }

    if (input.usernameSpace) {
        usernameInvalid.innerText += "No spaces allowed in username";
        usernameInvalid.style.display = "block";
        okForm = false;
    }

    if (input.emailDuplicate) {
        emailInvalid.innerText = "This email already exists. Please log in";
        emailInvalid.style.display = "block";
        okForm = false;
    }

    if (input.passwordLength) {
        passwordInvalid.innerText =
            "Your password must be longer than 5 characters";
        passwordInvalid.style.display = "block";
        okForm = false;
    }
    return okForm;
};
// once validation is done we can remove the modal and backdrop
const formValidated = () => {
    signUpForm.reset();
    signUpModal.classList.remove("show");
    modalBackdrop[0].classList.remove("show");
};

signUpButton.addEventListener("click", (e) => {
    let data = new FormData(signUpForm);
    regFormToGo = Object.fromEntries(data);

    //clientFormValidated = false;

    regFormToGo["type"] = "register";
    ws.send(JSON.stringify(regFormToGo));

    //formValidation();

    //if (clientFormValidated) formValidated();
});
