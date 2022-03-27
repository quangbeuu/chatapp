import { auth, db } from "../constants/common.js";
import InputGroup from "./inputGroup.js";
import {
  doc,
  setDoc,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
class NewConversationModal {
  constructor() {
    this.$container = document.createElement("form");
    this.$container.setAttribute(
      "class",
      "hidden new-conversation-modal bg-blue-400 px-8 py-4 rounded-lg shadow-lg"
    );

    this.$container.addEventListener("submit", this.onSubmit);

    this.$conversationName = new InputGroup(
      "Conversation Name",
      "text",
      "Enter your conversation name"
    );
    this.$email = new InputGroup("Email", "text", "Enter email");
    this.$submit = document.createElement("button");
    this.$submit.textContent = "Create";
    this.$submit.type = "Submit";
    this.$submit.setAttribute(
      "class",
      "bg-yellow-300 hover:bg-yellow-400 px-8 py-2 text-gray-700 font-bold rounded-lg"
    );
  }

  onSubmit = (e) => {
    e.preventDefault();
    const email = this.$email.getValue();
    const conversationName = this.$conversationName.getValue();

    // Tin nhắn ta cần lấy email của chính bản thân và email của
    // ng nhắn vs ta

    // => Dựa vào auth ta có thể lấy được thông tin của
    // tài khoản mà mk đã đăng nhập

    const newConversationDocument = {
      members: [email, auth.currentUser.email],
      // auth.currentUser: thông tin tìa khoản mà mk đăng nhập
      conversationName,
      createdAt: new Date().valueOf(),
    };

    // Gửi dữ liệu lên firestore
    // C1: setDoc (cách này ta có thể custom id)
    // const collectionRef = doc(db, "conversations");
    // setDoc(collectionRef, newConversationDocument);
    // this.$container.classList.add("hidden");

    // C2: addDoc (cách này ko custom id dc)
    const conversationRef = collection(db, "conversations");
    addDoc(conversationRef, newConversationDocument);
  };

  render() {
    this.$container.appendChild(this.$conversationName.render());
    this.$container.appendChild(this.$email.render());
    this.$container.appendChild(this.$submit);
    return this.$container;
  }
}

export default NewConversationModal;
