import axios from 'axios';
//import slave from './app.js'

async function json_parser(data)
{
    // 웹에서 전달받은 json파일 파싱 및 resource_create함수에 전달.
}


async function create_ae(url, rn)
{ 
    headers = {
        'X-M2M-Origin': tool_id, //tool에서 설정해야됨
        'Content-Type': 'application/json;ty=2',
        'Cache-Control': 'no-cache',
    }
    body = {
        'm2m:ae': {
            'api': api,
            'rn': rn,
            'lbl': [],
            'rr': true
        }
    }

    try {
        const response = await axios.post(url, body, {
          headers: headers,
        });
        console.log("[AE ${ae_name} created]")
        return response.data;
      } catch (error) {
        console.log("[AE ${ae_name} creation failed]")
        throw error;
      }
}

async function create_cnt(url, rn, ae_name)
{ 
    url = url + "/" + ae_name;
    headers = {
        'X-M2M-Origin': tool_id, //tool에서 설정해야됨
        'Content-Type': 'application/json;ty=3',
        'Cache-Control': 'no-cache',
    }
    body = {
        "m2m:cnt" : {
            "rn" : rn
        } 
    }
    try {
        const response = await axios.post(url, body, {
          headers: headers,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
}

async function create_resource(ae_list, cnt_list)
{
    //json parser에서 받아온 json데이터 기반으로 create_ae, create_cnt에 요청 전달
}