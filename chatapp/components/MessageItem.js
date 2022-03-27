import { auth } from "../constants/common.js";
class MessageItem {
  constructor(msg) {
    this._myMessage = msg.senderId === auth.currentUser.uid;
    this.$container = document.createElement("div");
    this.$container.setAttribute(
      "class",
      `mb-8 ${this._myMessage ? "mr-0 ml-auto" : ""}`
    );
    this.$msg = document.createElement("p");
    this.$msg.setAttribute(
      "class",
      `${
        this._myMessage ? "bg-gray-500" : "bg-indigo-500"
      } rounded-full px-4 py-2 mb-2 w-max text-white`
    );
    this.$msg.textContent = msg.content;
    this.$time = document.createElement("p");
    this.$time.textContent = "8:20 PM";
    this.$time.setAttribute("class", "text-md text-gray-500");

    if (msg.file) {
      this.$img = document.createElement("img");
      this.$img.src = msg.file;
    }
  }

  render() {
    this.$container.appendChild(this.$msg);
    if (this.$img) {
      this.$container.appendChild(this.$img);
    }
    this.$container.appendChild(this.$time);
    return this.$container;
  }
}

export default MessageItem;
