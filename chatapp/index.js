// file index muốn sử dụng JS từ file Login

// import {isLogin} from "./page/Login.js";
import Login from "./page/Login.js";
import Register from "./page/Register.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
// Hàm onAuthStateChanged để theo dõi trạng thái đăng nhập
// hay đăng xuất của ng dùng
import Main from "./page/Main.js";
import { auth } from "./constants/common.js";
// Nhiệm vụ thằng App là điều hướng cái view của mình

class App {
  _activeScreen;
  //_activeScreen là màn hình hiện tại
  constructor(view) {
    console.log(this._activeScreen);
    this.view = view;
    // view là màn hình hiện tại

    this.onAuthenticationListener();
  }
  // tham số truyền vào cho thằng constructor là thg div id="app"
  // => Vc ta cần lm là xóa hết html trg thằng này và thay
  // bằng thằng khác

  // Theo dõi trạng thái đăng nhập hay đăng xuất của ng dùng
  onAuthenticationListener() {
    onAuthStateChanged(auth, (user) => {
      console.log(this._activeScreen);
      if (user) {
        const mainScreen = new Main();
        this.setActiveScreen(mainScreen);
      } else {
        const loginScreen = new Login();
        this.setActiveScreen(loginScreen);
      }
      console.log(this._activeScreen);
    });
  }

  // => Gọi phương thức này khi app được tạo ra
  // => Tức gọi luôn ở constructor
  setActiveScreen(screen) {
    // screen là màn hình (page) ta truyền vào

    if (this._activeScreen) {
      // => Ktra xem màn hình hiện tại đg hiển thị màn hình
      // nào khác hay k
      // => Xóa màn hình hiện tại
      this.view.innerHTML = "";
    }
    // Thay thế màn hình khác
    this._activeScreen = screen;

    // Thêm màn hình mới vào
    screen.render(this.view);
  }
  // input của thằng này là 1 page (vd Login)
}

const view = document.getElementById("app");

const app = new App(view);

export default app;

// Nguyên lý chuyển đổi giữa các trang

// - file index.js sẽ là file trung gian nằm giữa
// Screen và các pages

// => Nhiệm vụ nếu đang ở Login muốn chuyển sang file Main
// nó sẽ lấy file Main hiển thị lên cái Screen và xóa thằng
// Login đi
