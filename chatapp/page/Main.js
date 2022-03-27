import ConversationList from "../components/ConversationList.js";
import ChatContainer from "../components/ChatContainer.js";

class Main {
  constructor() {
    this.$mainContainer = document.createElement("div");
    this.$mainContainer.setAttribute("class", "flex");

    this.$conversationList = new ConversationList((conversation) => {
      this.setActiveConversation(conversation);
    });
    this.$chatContainer = new ChatContainer();

    // 1. Nếu truyển thẳng this.setActiveConversation
    // + Lần đầu chạy nó sẽ chạy constructor()
    // và truyển this.setActiveConversation cho thằng
    // Conversation List

    // => và khi ta truyền conversation xuống cho ChatContainer bằng
    // this.$chatContainer.setActiveConversation(conversation);

    // => Ta đã truyền xuống cho ChatContainer trước khi thằng
    // ChatContainer này được tạo ra

    // => nó sẽ ra undefined

    // 2. Ta truyền dưới dạng callback

    // - Hàm callback ta truyền vào chỉ đc gọi khi ta click
    // vào 1 conversation

    // - Tức lúc chạy hàm constructor hàm this.setActiveConversation
    // chưa đc chạy nó đợi khi ta click thì ms chạy
    // (khắc phục đc lỗi ở trên)
  }

  // => Các lệnh ở constructor chỉ thực thi 1 lần duy nhất

  // signOut = () => {
  //   signOut(auth)
  //     .then((response) => {
  //       if (response) {
  //         alert("You have been signed out");
  //       }
  //     })
  //     .catch((error) => {
  //       alert("Error signing out");
  //     });
  // };

  setActiveConversation(conversation) {
    // conversation chính là conversation mà ta bấm vào
    this.$chatContainer.setActiveConversation(conversation);
  }

  // Ta muốn click vào 1 conversation bên conversation list
  // và muốn nó hiện ra bên message list

  // => Đầu tiên ta phải tìm điểm chung của hai thằng là đều
  // là thằng con của thằng Main

  // => Viết ở Main, 1 hàm là setActiveConversation để truyền
  // xuống Conversation list (khi click gửi lên Main, từ Main
  // chuyển xuống Message list)

  render(container) {
    // this.$mainContainer.appendChild(this.$welcome);
    // this.$mainContainer.appendChild(this.$signOutButton);
    this.$conversationList.render(this.$mainContainer);
    this.$chatContainer.render(this.$mainContainer);
    container.appendChild(this.$mainContainer);
  }
}

export default Main;

// Để truyền dữ liệu từ component này sang component khác
// mà hai component đấy đang cùng cấp

// => Ta tìm điểm chung của nó (thường là thằng cha gần
// nhất của cả 2 thằng)
