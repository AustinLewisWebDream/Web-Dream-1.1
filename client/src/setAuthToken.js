import axios from 'axios';


const setAuthToken = token => {

        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');


        // delete axios.defaults.headers.common['Authorization'];

}

export default setAuthToken;