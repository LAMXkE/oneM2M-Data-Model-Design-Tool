import axios from 'axios';

axios.defaults.withCredentials = false;

async function http_cse_retrieve(originator, host, port, path)
{

  
    const url = `http://${host}:${port}/${path}`;

    // console.log("url, origin", url, originator);

    const headers = {
        "X-M2M-Origin": originator
    }
    // console.log(headers);
    const body_attr = {
    } 
  // operation code RETRIEVE 2
    try {
        const response = await axios.get(url, {
          headers: headers,
          withCredentials: false,
        });
        console.log(`[CSE data Retrieved]`)
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.log(`[CSE data Retrieve Failed]`)
        //console.log(url);
        throw error;
      }
}

export default http_cse_retrieve;