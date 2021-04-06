import axios from "axios";

const instance = axios.create({
  baseURL: "https://blooming-sea-28460.herokuapp.com",
});

export default instance;
