import { auth, messageRef, storage } from "../constants/common.js";
import { addDoc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-storage.js";
class ChatInput {
  _activeConversation;
  _fileUrl;
  _processingFile;
  isUpload = false;
  _progress = 0;
  constructor() {
    this.$container = document.createElement("form");
    this.$container.setAttribute("class", "mb-2 flex items-center");
    this.$container.addEventListener("submit", this.onSubmit);

    this.$input = document.createElement("input");
    this.$input.type = "text";
    this.$input.placeholder = "Add your message here";
    this.$input.setAttribute(
      "class",
      "w-full border-indigo-50 px-4 py-2 rounded-full bg-indigo-50"
    );

    this.$chooseFile = document.createElement("input");
    this.$chooseFile.type = "file";
    this.$chooseFile.setAttribute(
      "class",
      "text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 file:cursor-pointer"
    );
    this.$chooseFile.addEventListener("change", this.onChange);
  }

  onChange = (e) => {
    // Để lấy value của thẻ file ta phải .files
    // console.log(e.target.files[0]);

    this.isUpload = true;
    const file = e.target.files[0];
    // const storageRef = ref(storage, "ten file muon upload");
    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          Math.floor(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        this._progress = progress;
        if (progress === 100) {
          this._processingFile = true;
        }
      },
      // Nếu lỗi sẽ gọi tới callback này
      (error) => {
        alert(error.message);
      },
      // Thành công sẽ gọi tới callback này
      () => {
        // Hàm lấy link url của ảnh
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            this._fileUrl = url;
          })
          .catch((error) => {
            alert(error.message);
          });
      }

      // => Quy trình của hàm này có 3 phần
      // + Processing
      // + Error
      // + Complete
    );
    // => Kiểm soát đc file mk down lên đã chạy đc khoảng bn
    // phần trăm
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const msgValue = this.$input.value;
    try {
      if (msgValue.trim().length !== 0) {
        // Kiểm tra xem ảnh đã hoàn toản đc tải lên thì ms cho
        // upload tiếp
        if (this.isUpload) {
          if (this._processingFile === true) {
            const newMsg = {
              content: msgValue,
              createdAt: new Date().valueOf(),
              senderId: auth.currentUser.uid,
              conversationId: this._activeConversation.conversationId,
              file: this._fileUrl,
            };
            addDoc(messageRef, newMsg);
            this.$input.value = "";
          } else {
            alert(`Please wait for file to be uploaded ${this._progress}%`);
          }
        } else {
          const newMsg = {
            content: msgValue,
            createdAt: new Date().valueOf(),
            senderId: auth.currentUser.uid,
            conversationId: this._activeConversation.conversationId,
            file: "",
          };
          addDoc(messageRef, newMsg);
          this.$input.value = "";
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  setConversation(conversation) {
    this._activeConversation = conversation;
  }
  // để lấy conversationId

  render() {
    this.$container.appendChild(this.$input);
    this.$container.appendChild(this.$chooseFile);
    return this.$container;
  }
}

export default ChatInput;

// Khi dùng Storage
// + Ta phải vào Storafe trên Firebase rồi chuyển
// Rules của nó thành allow read, write: if true
