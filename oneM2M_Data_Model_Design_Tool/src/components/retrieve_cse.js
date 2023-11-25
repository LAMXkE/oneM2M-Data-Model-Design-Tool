import axios from 'axios';

async function http_cse_retrieve(host, port, path)
{
    const url = `http://${host}:${port}/${path}`;

    const headers = {
        'X-M2M-Origin': "tool_id", //tool에서 설정해야됨
        'Content-Type': `application/json;ty=2`,
    }

    const body_attr = {
    } 
// operation code RETRIEVE 2
    try {
        const response = await axios.get(url, body_attr, {
          headers: headers,
          withCredentials: false,
        });
        console.log(`[CSE data Retrieved]`)
        return response.data;
      } catch (error) {
        console.log(`[CSE data Retrieve Failed]`)
        //console.log(url);
        throw error;
      }
}
