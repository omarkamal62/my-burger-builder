import axios from "axios";

const instance = axios.create({
  baseURL: "https://react-my-burger-41530-default-rtdb.firebaseio.com/",
});

export default instance;
