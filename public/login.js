function login() {
    const nameEl = document.querySelector("#name");
    const passwordEl = document.querySelector("#password")
    localStorage.setItem("userName", nameEl.value);
    localStorage.setItem("password", passwordEl.value);
    window.location.href = "play.html";
  }

  function Register(){
    const nameEl = document.querySelector("#name");
    const passwordEl = document.querySelector("#password")
    localStorage.setItem("userName", nameEl.value);
    localStorage.setItem("password", passwordEl.value);
    window.location.href = "play.html";
  }