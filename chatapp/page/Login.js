import InputButton from "../components/inputButton.js";
import InputGroup from "../components/inputGroup.js";
import Register from "./Register.js";
import Main from "./Main.js";
import app from "../index.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { auth } from "../constants/common.js";

class Login {
  constructor() {
    this.$loginContainer = document.createElement("form");
    this.$loginContainer.setAttribute(
      "class",
      "w-1/3 bg-blue-400 mx-auto mt-12 p-8 rounded-2xl"
    );
    this.$loginContainer.addEventListener("submit", this.onSubmit);

    this.$email = new InputGroup("Email", "email", "Enter your email");
    this.$password = new InputGroup(
      "Password",
      "password",
      "Enter your password"
    );

    this.$loginBtn = new InputButton("Login", "submit");

    this.$goToRegisterPage = document.createElement("span");
    this.$goToRegisterPage.innerText = "Don't have an account?";
    this.$goToRegisterPage.setAttribute(
      "class",
      "text-white ml-4 cursor-pointer"
    );
    this.$goToRegisterPage.addEventListener("click", this.goToRegisterPage);
  }

  goToRegisterPage = () => {
    const registerScreen = new Register();
    app.setActiveScreen(registerScreen);
  };
  onSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = this.$email.getValue();
      const password = this.$password.getValue();

      if (email.length === 0) {
        this.$email.setErrorMsg("Email is required");
      } else {
        this.$email.setErrorMsg("");
      }

      if (password.length === 0) {
        this.$password.setErrorMsg("Password is required");
      } else {
        this.$password.setErrorMsg("");
      }
      if (email && password) {
        const response = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = response.user;
        if (user) {
          // const mainScreen = new Main();
          // app.setActiveScreen(mainScreen);
          // => ko cần setScreen ở đây vì hàm
          // onAuthStateChanged đã cập nhập dc trạng thái
          // đăng nhập hay đăng xuất sẽ tự động thay đổi screen
          // sang màn hình Main

          alert("Login successful");
        }
      }
    } catch (error) {
      // alert(error.message);
      console.error(error);
    }
  };

  render(container) {
    // container để truyền thẻ div id = "app" thay code html bên trong
    this.$loginContainer.appendChild(this.$email.render());
    this.$loginContainer.appendChild(this.$password.render());
    this.$loginContainer.appendChild(this.$loginBtn.render());
    this.$loginContainer.appendChild(this.$goToRegisterPage);
    // return this.$loginContainer;
    container.appendChild(this.$loginContainer);
  }
}

export default Login;
