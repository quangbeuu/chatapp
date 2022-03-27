import ConversationItem from "./ConversationItem.js";
import NewConversationButton from "./NewConversationButton.js";
import NewConversationModal from "./NewConversationModal.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import {
  collection,
  doc,
  getFirestore,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { auth, db } from "../constants/common.js";
import { mockConversation } from "../assets/mockData.js";

class ConversationList {
  constructor(setActiveConversation) {
    this._setActiveConversation = setActiveConversation;
    this.$container = document.createElement("div");
    this.$container.setAttribute(
      "class",
      "w-1/4 h-screen px-4 pt-4 overflow-y-scroll"
    );

    this.$newConversationModal = new NewConversationModal();
    this.$newConversationButton = new NewConversationButton(
      this.$newConversationModal.$container
    );

    this.$signOutButton = document.createElement("button");
    this.$signOutButton.textContent = "Sign Out";
    this.$signOutButton.setAttribute(
      "class",
      "w-full px-4 py-2 text-gray-700 text-xl font-bold rounded-lg bg-yellow-400 hover:bg-yellow-500 cursor-pointer mb-4"
    );
    this.$signOutButton.addEventListener("click", this.signOut);

    // Các đoạn code ở Constructor luôn luôn được thực thi trước
    this.createConversationFromCollection();
  }

  signOut = () => {
    signOut(auth)
      .then(() => {
        alert("Signed out");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  createConversationFromCollection = async () => {
    // 1. get collection from mockData.js
    // mockConversation.forEach((conversation) => {
    //   const conversationItem = new ConversationItem(conversation);
    //   this.$container.appendChild(conversationItem.render());
    // });
    // ----------------------------------------------------------------------
    // 2. Lấy 1 dữ liệu (document) từ firestore
    // Cú pháp:
    //    const conversationRef = doc(db,"ten collection tren firestore","id của document ta muốn lây")
    // const conversationRef = doc(db, "conversations", "s4sf0EBL2QTYdLuV4hEc");
    // const data = await getDoc(conversationRef);
    // console.log("data", data.data());
    // ----------------------------------------------------------------------
    // 3. Lấy tất cả doc từ firestore
    // Cú pháp:
    // const conversationsRef = collection(db, "ten collection muon lay");
    // const conversationsRef = collection(db, "conversations");
    // const data = await getDocs(conversationsRef);
    // data.forEach((document) => {
    //   // console.log("document", document.data());
    //   const conversationItem = new ConversationItem(document.data());
    //   this.$container.appendChild(conversationItem.render());
    // });
    // 4. Lấy doc với 1 điều kiện nhất định
    // VD: tìm createdAt < 1500;
    // const conversationsRef = collection(db, "conversations");
    // const q = query(conversationsRef, where("createdAt", "<", 1500));
    // const data = await getDocs(q);
    // data.forEach((document) => {
    //   // console.log("document", document.data());
    //   const conversationItem = new ConversationItem(document.data());
    //   this.$container.appendChild(conversationItem.render());
    // });

    // 5. Update doc realtime (tức thêm trên firestore tự động
    // render ra giao diện)

    // - Hàm onSnapshot: ktra xem dữ liệu dưới local so với
    // dữ liệu trên firestore nó như thế nào

    // a. Listen update realtime cho 1 doc

    // const documentRef = doc(db, "conversations", "s4sf0EBL2QTYdLuV4hEc");
    // onSnapshot(documentRef, (doc) => {
    //   console.log("Current data", doc.data());
    // });

    // b. Listen update realtime cho all doc
    // const conversationRef = collection(db, "conversations");
    // onSnapshot(conversationRef, (snapshot) => {
    //   snapshot.docChanges().forEach((change) => {
    //     if (change.type === "added") {
    //       // console.log(change.doc.data());
    //       const conversationDoc = change.doc.data();
    //       const conversationItem = new ConversationItem(conversationDoc);
    //       this.$container.appendChild(conversationItem.render());
    //     }
    //   });
    // });

    // c. Listen update realtime có điều kiện
    console.log(auth.currentUser.email);
    const conversationRef = collection(db, "conversations");
    const q = query(
      conversationRef,
      where("members", "array-contains", auth.currentUser.email)
    );
    // array-contains: để ktra trong mảng members có chứa email của mk hay k
    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          // console.log(change.doc.data());
          // const conversationDoc = change.doc.data();
          const conversationDoc = {
            ...change.doc.data(),
            conversationId: change.doc.id,
          };
          const conversationItem = new ConversationItem(
            conversationDoc,
            this._setActiveConversation
          );
          this.$container.appendChild(conversationItem.render());
        }
      });
    });
  };

  // container chính là cái div của thằng Main
  render(container) {
    this.$container.appendChild(this.$newConversationButton.render());
    this.$container.appendChild(this.$newConversationModal.render());

    // for (let i = 0; i < 10; i++) {
    //   let temp = new ConversationItem(i);
    //   this.$container.appendChild(temp.render());
    // }

    // for (let i = 0; i < mockConversation.length; i++) {
    //   const conversationItem = new ConversationItem(mockConversation[i]);
    //   this.$container.appendChild(conversationItem.render());
    // }

    // mockConversation.forEach((conversation) => {
    //   const conversationItem = new ConversationItem(conversation);
    //   this.$container.appendChild(conversationItem.render());
    // });

    this.$container.appendChild(this.$signOutButton);
    container.appendChild(this.$container);
  }
}

export default ConversationList;

// - Main bây sẽ sẽ nhận thêm 2 component
//      + Conversation List và Chat
