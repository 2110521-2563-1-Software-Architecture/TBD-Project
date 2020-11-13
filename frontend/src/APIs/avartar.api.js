import axios from 'axios';

export const getAvatar = (username) => {
    let data = "";
    axios.delete('https://avatars.abstractapi.com/v1/?api_key=ba6cab77a81941959a513c430a836ded&name=' + username, {

    })
        .then(response => {
            response.on("data", (chunk) => {
                data += chunk;
            });
            response.on("end", () => {
                // console.log(JSON.parse(data));
                return JSON.parse(data);
            });
        })
        .catch((error) => {
            console.log('error ' + error);
        });
}