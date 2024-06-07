import axios from "axios";

// Define the URL to make the request to
const url = "https://jsonplaceholder.typicode.com/posts/1";

// Make a GET request using Axios
axios
  .get(url)
  .then((response) => {
    console.log("Response:", response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Make a POST request using Axios


const loginResponse = await axios.post(`https://login.seek.com/oauth/token`, {
  audience: "https://seek/api/candidate",
  client_id: "jd2uDa6siybZo6m4hb6tXLsn3yXftOYc",
  client_secret:
    "OyLPTxdKpcKwZprgb0lwuaHT6G3BgXz_UFJnNpHJNTAMIjlgkSf5M3YukPftqyto",
  grant_type: "password",
  password: "notiplatform@gmail.com",
  username: "noti-platform123",
});

if (loginResponse?.data?.access_token) {
  const { data } = loginResponse as {
    data: {
      access_token: string;
    };
  };
  return data;
}
