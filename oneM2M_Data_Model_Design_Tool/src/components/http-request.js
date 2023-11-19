import axios from 'axios';
//import slave from './app.js'

async function select_resource(attr)
{
  const attr_list = {
    "header" : {},
    "body" : {}
  };

  const ae_header = ["ty"];
  const cnt_header = ["ty"];
  const grp_header = ["ty"];
  const acp_header = ["ty"];
  const sub_header = ["ty"];

  var attribute_list = [];
  if (attr["ty"] == 1)
  {
    attribute_list = acp_header;
  }
  else if (attr["ty"] == 2)
  {
    attribute_list = ae_header;
  }
  else if (attr["ty"] == 3)
  {
    attribute_list = cnt_header;
  }
  else if (attr["ty"] == 9)
  {
    attribute_list = grp_header;
  }
  else
  {
    attribute_list = sub_header;
  }

  for (const key of attribute_list)
  {
    if (attr.hasOwnProperty(key)) 
    {
      attr_list["header"][key] = attr[key];
    }
    else if (!attr.hasOwnProperty(key)) 
    {
      attr_list["body"][key] = attr[key];//JSON.parse(JSON.stringify(currentNode[key]));
      //console.log(currentNode[key]);
      //resource[]
    }
  }

  return attr_list;
}


/*

*/
async function create_resource(attr)
{ 
    console.log("hello im free");
    const url = "127.0.0.1";

    const attrs = select_resource(attr);
    console.log("------");
    console.log(attrs);
    console.log("------");
 

    const headers = {
        'X-M2M-Origin': "tool_id", //tool에서 설정해야됨
        'Content-Type': `application/json;ty=${attr["ty"]}`,
        'Cache-Control': 'no-cache',
    }

    //body_attr = 

    const body = attr;
    
    try {
        const response = await axios.post(url, body, {
          headers: headers,
        });
        console.log(`[AE ${rn} created]`)
        return response.data;
      } catch (error) {
        console.log(`[AE ${rn} creation failed]`)
        throw error;
      }
}

export default create_resource;

/*
async function create_cnt(url, rn, attrs)
{ 
    url = url + "/" + rn;
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

async function create_grp(url, rn, attrs)
{ 
    headers = {
        'X-M2M-Origin': tool_id, //tool에서 설정해야됨
        'Content-Type': 'application/json;ty=2',
        'Cache-Control': 'no-cache',
    }
    body = {
        'm2m:grp': {
            'api': api,
            'rn': rn,
            'rr': true
        }
    }

    try {
        const response = await axios.post(url, body, {
          headers: headers,
        });
        console.log(`[GRP ${rn} created]`)
        return response.data;
      } catch (error) {
        console.log(`[GRP ${rn} creation failed]`)
        throw error;
      }
}

async function create_sub(url, rn, attrs)
{ 
    headers = {
        'X-M2M-Origin': tool_id, //tool에서 설정해야됨
        'Content-Type': 'application/json;ty=2',
        'Cache-Control': 'no-cache',
    }
    body = {
        'm2m:sub': {
            'api': api,
            'rn': rn,
            'rr': true
        }
    }

    try {
        const response = await axios.post(url, body, {
          headers: headers,
        });
        console.log(`[SUB ${ae_name} created]`)
        return response.data;
      } catch (error) {
        console.log(`[SUB ${ae_name} creation failed]`)
        throw error;
      }
}

async function create_acp(url, rn, attrs)
{ 
    headers = {
        'X-M2M-Origin': tool_id, //tool에서 설정해야됨
        'Content-Type': 'application/json;ty=2',
        'Cache-Control': 'no-cache',
    }
    body = {
        'm2m:acp': {
        }
    }

    try {
        const response = await axios.post(url, body, {
          headers: headers,
        });
        console.log(`[ACP ${ae_name} created]`)
        return response.data;
      } catch (error) {
        console.log(`[ACP ${ae_name} creation failed]`)
        throw error;
      }
}

*/
