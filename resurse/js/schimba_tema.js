window.addEventListener("load", function () {
    const buton = document.getElementById("schimba_tema");
    const icon = document.getElementById("icon-tema");
  
    function seteazaIcon() {
      if (document.body.classList.contains("dark")) {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      } else {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      }
    }
  
    seteazaIcon();
  
    buton.onclick = function () {
      if (document.body.classList.toggle("dark")) {
        localStorage.setItem("tema", "dark");
      } else {
        localStorage.removeItem("tema");
      }
      seteazaIcon();
    };
  });
  