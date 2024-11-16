document.getElementById("login-tab").addEventListener("click", function () {
    document.getElementById("login-form").classList.add("active");
    document.getElementById("register-form").classList.remove("active");
    this.classList.add("active");
    document.getElementById("register-tab").classList.remove("active");
  });
  
  document.getElementById("register-tab").addEventListener("click", function () {
    document.getElementById("register-form").classList.add("active");
    document.getElementById("login-form").classList.remove("active");
    this.classList.add("active");
    document.getElementById("login-tab").classList.remove("active");
  });
  
  document.getElementById("switch-to-register").addEventListener("click", function () {
    document.getElementById("register-tab").click();
  });
  
  document.getElementById("switch-to-login").addEventListener("click", function () {
    document.getElementById("login-tab").click();
  });
  