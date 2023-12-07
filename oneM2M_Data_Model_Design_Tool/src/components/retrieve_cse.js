import axios from 'axios';

axios.defaults.withCredentials = false;

async function http_cse_retrieve(originator, host, port, path, callback)
{

  
    const url = `http://${host}:${port}/${path}`;

    // console.log("url, origin", url, originator);

    const headers = {
        "X-M2M-Origin": originator,
        "X-M2M-RVI" : 3,
        "X-M2M-RI" : 12345,
        "Accept" : "application/json"
    }
    // console.log(headers);
  // operation code RETRIEVE 2
    try {
        const response = await axios.get(url, {
          headers: headers,
          withCredentials: false,
        });
        console.log(`[CSE data Retrieved]`)
        console.log(response);
        // return response.data;
        callback(response.data);
      } catch (error) {
        console.log(`[CSE data Retrieve Failed]`)
        //console.log(url);
        throw error;
      }

    
}

export default http_cse_retrieve;