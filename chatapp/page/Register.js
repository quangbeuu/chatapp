import InputButton from "../components/inputButton.js";
import InputGroup from "../components/inputGroup.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { auth } from "../constants/common.js";
import app from "../index.js";
import Login from "./Login.js";

class Register {
  constructor() {
    this.$registerContainer = document.createElement("form");
    this.$registerContainer.setAttribute(
      "class",
      "w-1/3 bg-blue-400 mx-auto mt-12 p-8 rounded-2xl"
    );
    this.$registerContainer.addEventListener("submit", this.onSubmit);
    //Sự kiện submit chỉ sinh ra dành cho thẻ form thôi

    this.$displayName = new InputGroup(
      "Display name",
      "text",
      "Enter your name"
    );
    this.$email = new InputGroup("Email", "email", "Enter your email");
    this.$password = new InputGroup(
      "Password",
      "password",
      "Enter your password"
    );
    this.$confirmPassword = new InputGroup(
      "Confirm password",
      "password",
      "Confirm your password"
    );

    this.$registerButton = new InputButton("Register", "submit");

    this.$goToLogin = document.createElement("span");
    this.$goToLogin.innerText = "Already have an account?";
    this.$goToLogin.setAttribute("class", "text-white ml-4 cursor-pointer");
    this.$goToLogin.addEventListener("click", this.goToLoginPage);
  }

  goToLoginPage = () => {
    const loginScreen = new Login();
    app.setActiveScreen(loginScreen);
  };

  // Hàm submit của thẻ input
  // (sự kiện thì dùng arrow function)
  // Khi click vào thì sẽ lấy dữ liệu từ thẻ input
  onSubmit = async (event) => {
    event.preventDefault();
    try {
      const displayName = this.$displayName.getValue();
      const email = this.$email.getValue();
      // Hàm getValue ở inputGroup
      const password = this.$password.getValue();
      const consfirmPassword = this.$confirmPassword.getValue();

      if (email.length === 0) {
        this.$email.setErrorMsg("Email is required");
      } else {
        this.$email.setErrorMsg("");
      }
      if (displayName.length === 0) {
        this.$displayName.setErrorMsg("Display name is required");
      } else {
        this.$displayName.setErrorMsg("");
      }
      if (password.length === 0) {
        this.$password.setErrorMsg("Password is required");
      } else {
        this.$password.setErrorMsg("");
      }
      if (password === consfirmPassword) {
        // Tạo người dùng mới
        // Hàm createUserWithEmailAndPassword là 1 hàm bất đồng
        // bộ vì cần tốn tg để tạo ng dùng

        // => dùng promise hoặc async await
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = response.user;
        console.log(user);
        if (user) {
          // window.location.href = "./login.html";

          // => Chuyển sang màn hình Login
          const loginScreen = new Login();
          app.setActiveScreen(loginScreen);
        }
      } else {
        this.$confirmPassword.$error.innerText = "Passwords do not match";
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  render(container) {
    this.$registerContainer.appendChild(this.$displayName.render());
    this.$registerContainer.appendChild(this.$email.render());
    this.$registerContainer.appendChild(this.$password.render());
    this.$registerContainer.appendChild(this.$confirmPassword.render());
    this.$registerContainer.appendChild(this.$registerButton.render());
    this.$registerContainer.appendChild(this.$goToLogin);
    // return this.$registerContainer;
    container.appendChild(this.$registerContainer);
  }
}

export default Register;

// Để từ Register sang Login

// thì phải lấy phương thức setActiveScreen
// từ thằng App xuống Register

// + Tại hàm onSubmit ở Register
// ta sẽ gọi hàm setActiveScreen(Login) truyền Login vào

// (nó sẽ xóa Register và đổi thành Login)

// => Để Register sử dụng được hàm setActiveScreen thì
// ta phải export thằng app ra
