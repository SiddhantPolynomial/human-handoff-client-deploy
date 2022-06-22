import axios from 'axios';
import LoadingBar from 'react-top-loading-bar';
import React, { useRef } from 'react';
let ref;
const Loader = () => {
    ref = useRef(null);
    axios.interceptors.request.use(req => {
        ref.current.continuousStart();
        return req;
    });


    axios.interceptors.response.use(res => {
        ref.current.complete();
        return res;
    },
        (error) => {
            return Promise.reject(error);
        });
    return (
        <LoadingBar color='#ee4d6d' ref={ref} />
    )
};



export default Loader;
