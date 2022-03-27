import { mocMessage } from "../assets/mockData.js";
import {
  getDocs,
  query,
  where,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { messageRef } from "../constants/common.js";
import MessageItem from "./MessageItem.js";

class MessageList {
  constructor() {
    this.$container = document.createElement("div");
    this.$container.setAttribute("class", "flex flex-1 flex-col p-4");
    // this.renderMessages();
    // => Nếu để renderMessages ở đây thì dù mk chưa bấm vào
    // conversation nó cg render ra dữ liệu
    // => nên để ở setConversation
  }

  renderMessages(currentConversationId) {
    // mocMessage.forEach((msg) => {
    //   const messageItem = new MessageItem(msg);
    //   this.$container.appendChild(messageItem.render());
    // });
    const q = query(
      messageRef,
      where("conversationId", "==", currentConversationId)
    );
    onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          messages.push(change.doc.data());
        }
      });
      // Sắp xếp thời gian tin nhắn nào xuất mới nhất sẽ hiển
      // thị sau cùng
      messages.sort((a, b) => a.createdAt - b.createdAt);
      messages.forEach((msg) => {
        const messageItem = new MessageItem(msg);
        this.$container.appendChild(messageItem.render());
      });
    });
  }

  setConversation(conversation) {
    this.$container.innerHTML = "";
    // => Có một vấn để là ta chat ở conversation này
    // nhưng đoạn chat này hiện lên cả conversation khác
    // => trc khi render ta phải xóa hết nội dung đoạn chat
    this.renderMessages(conversation.conversationId);
  }

  render() {
    return this.$container;
  }
}

export default MessageList;
