const btn = document.querySelector(".btn");
const input = document.querySelector(".form-input");
const container = document.querySelector(".container");
const notice = document.querySelector(".notice");
const online = document.querySelector(".online");
const formCont = document.querySelector(".form");
const userInp = document.querySelector("#username");
const submit = document.querySelector("#usernameForm");

const socket = io();
let username = "";

// receiving messages
socket.on("message", (data) => {
  if (!username) return;
  showMsg(data);
});

// information of notice
socket.on("info", ({ reason, username }) => {
  if (!username) return;
  const displayMsg =
    reason === "connected"
      ? `User connected: ${username}`
      : `User disconnected: ${username}`;
  const putClass = reason === "connected" ? "chat-green" : "chat-red";
  showNotice(displayMsg, putClass);
});

// getting active status
socket.on("status", (status) => {
  if (username) online.textContent = status;
  else online.textContent = 0;
});

// helper function to show received message
const showMsg = function (data) {
  const el = document.createElement("div");
  el.className = "message-container";
  if (data?.senderId === socket.id) el.classList.add("own");

  // Add username display
  const usernameDiv = document.createElement("div");
  usernameDiv.className = "message-sender";
  usernameDiv.textContent =
    data.senderId === socket.id ? "You" : data.username || "Anonymous";

  const p = document.createElement("p");
  p.className = "message";
  p.textContent = data.msg;

  el.appendChild(usernameDiv);
  el.appendChild(p);
  container.appendChild(el);

  // Auto-scroll to the latest message
  container.scrollTop = container.scrollHeight;
};

// helper function to show notice
const showNotice = function (msg, putClass) {
  notice.classList = `notice ${putClass}`;
  notice.textContent = msg;
  setTimeout(() => {
    notice.classList = `notice none`;
    notice.textContent = "";
  }, 5000);
};

// event listener for send button
btn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!username) {
    location.reload();
    return;
  }
  socket.emit("chat-msg", input.value);
  input.value = "";
});

// event listeners for username button
submit.addEventListener("submit", (e) => {
  e.preventDefault();
  username = userInp.value.trim();
  if (username) {
    formCont.classList.add("none");
    formCont.style.display = "none";

    userInp.value = "";

    socket.emit("username", { username });
  }
});
