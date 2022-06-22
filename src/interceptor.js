import axios from "axios";
import { startLoading, endLoading } from './actions';
import {
  NotificationManager,
} from "react-notifications";

const interceptor = {
  setup: (history) => {
    axios.interceptors.request.use(req => {
      startLoading();
      return req;
    });

    axios.interceptors.response.use(res => {
      endLoading();
      return res;
    },
      (error) => {
        console.log(error.response);
        if (error.response.status === 401) {
          //Unauthorized
          localStorage.clear();
          history.push(`/`);
          window.location.reload(false);
        } else if (error.response.status === 400) {
          //Resource not found
        } else if (error.response.status === 500) {
          //Something went wront
          NotificationManager.error("Please try again after some time", "Something went wrong", 4000);
        }
        //console.clear();
        return Promise.reject(error);
      });
  },
};

export default interceptor;