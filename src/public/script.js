const btn = document.querySelector(".btn");
const input = document.querySelector(".form-input");
const container = document.querySelector(".container");
const notice = document.querySelector(".notice");
const online = document.querySelector(".online");

const socket = io();

socket.on("message", (data) => {
  showMsg(data);
});

socket.on("info", (data) => {
  const displayMsg =
    data.reason === "connected"
      ? `User connected: ${data.userId}`
      : `User disconnected: ${data.userId}`;
  const putClass = data.reason === "connected" ? "cgreen" : "cred";
  showNotice(displayMsg, putClass);
});

socket.on("status", (status) => {
  online.textContent = status;
});

btn.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("chat-msg", input.value);
  input.value = "";
});

const showMsg = function (data) {
  const el = `<div class="message-container ${ data?.senderId === socket.id ? "own" : "" }">
              <p class="message">${data.msg}</p>
                </div>`;
  container.insertAdjacentHTML("beforeend", el);
};

const showNotice = function (msg, putClass) {
  notice.classList.remove("none");
  notice.classList.add(putClass);
  notice.textContent = msg;
  setTimeout(() => {
    notice.classList.add("none");
    notice.classList.remove(putClass);
    notice.textContent = "";
  }, 4000);
};
