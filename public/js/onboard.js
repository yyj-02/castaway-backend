// HTML elements
const loginForm = document.getElementById("login");
const livestreamPage = document.getElementById("livestream");
const placeholder = document.getElementById("idToken");

livestreamPage.style.display = "none";

loginForm.onsubmit = async (event) => {
  event.preventDefault();
  console.log("submit");
  const email = loginForm.elements[0].value;
  const password = loginForm.elements[1].value;
  // console.log({ email, password });
  try {
    let loginData = {
      email,
      password,
    }
    url = "https://us-central1-castaway-819d7.cloudfunctions.net/app/api/auth/login"
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const resData = await res.json();
    console.log({...resData});
    placeholder.innerHTML = resData.idToken;

    loginForm.style.display = "none";
    livestreamPage.style.display = "block";
  } catch (err) {
    console.log({err});
  }
};
