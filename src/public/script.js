const btn = document.querySelector(".btn");
const input = document.querySelector(".form-input");
const container = document.querySelector(".container");
const notice = document.querySelector(".notice");
const online = document.querySelector(".online");

const socket = io();

// receiving messages
socket.on("message", (data) => {
  showMsg(data);
});

// information of notice
socket.on("info", ({ reason, userId }) => {
  const displayMsg =
    reason === "connected"
      ? `User connected: ${userId}`
      : `User disconnected: ${userId}`;
  const putClass = reason === "connected" ? "chat-green" : "chat-red";
  showNotice(displayMsg, putClass);
});

// getting active status
socket.on("status", (status) => {
  online.textContent = status;
});

// event listener for button
btn.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("chat-msg", input.value);
  input.value = "";
});

// helper function to show received message
const showMsg = function (data) {
  const el = document.createElement("div");
  el.className = "message-container";
  if (data?.senderId === socket.id) el.classList.add("own");

  const p = document.createElement("p");
  p.className = "message";
  p.textContent = data.msg;

  el.appendChild(p);
  container.appendChild(el);
};

// helper function to show notice
const showNotice = function (msg, putClass) {
  notice.classList = `notice ${putClass}`;
  notice.textContent = msg;
  setTimeout(() => {
    notice.classList = `notice none`;
    notice.textContent = "";
  }, 4000);
};
