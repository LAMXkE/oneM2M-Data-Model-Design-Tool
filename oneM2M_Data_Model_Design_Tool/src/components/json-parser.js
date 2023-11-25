// async function json_parser(data)
// {
//     // 웹에서 전달받은 json파일 파싱 및 resource_create함수에 전달
// }
//const fs = require('fs'); // Node.js의 파일 시스템 모듈을 불러옵니다.
// 로컬 JSON 파일의 경로 (여기서는 예시 파일 경로입니다. 실제 파일 경로로 변경해야 합니다.)
// import fs from 'fs';
import create_resource from "@/components/http-request.js";
//const jsonFilePath = "./storagedata.json"//local json file path;

// export let resource = {};

// JSON 파일을 읽어오는 함수
//function readJSONFile(filePath)
export function readJSONFile() {
    try {
        console.log('파일읽는중')
        //const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        var jsonData = resource;
        return jsonData;
    } catch (error) {
        console.error('Unable to Read JSON file : ', error);
        return null;
    }
}

export function attribute_check(resource, currentNode ,attribute_list)
{
  //console.log("---------");
  //console.log(currentNode);
  for (const key of attribute_list) 
  {
    if (currentNode.hasOwnProperty(key)) 
    {
      resource[key] = currentNode[key];
    }
    if (currentNode["attrs"].hasOwnProperty(key)) 
    {
      resource[key] = currentNode["attrs"][key];//JSON.parse(JSON.stringify(currentNode[key]));
      //console.log(currentNode[key]);
      //resource[]
    }
  }
  //console.log(resource);
  create_resource(resource);

  //console.log("---------");
  
  // for key:value check
  // const entries = Object.entries(resource);
  // for (const [key, value] of entries) {
  //   console.log(key + ": " + value);
  // }

  // return resource;
}

export function make_request_resource(currentNode)
{
  //ty, rn + resource 형성, http-request에 데이터 전송
  //ty에 따라서 호출해야하는 함수가 다름.. 

  const cnt_attribute = ['ty', 'rn', 'lbl', 'acpi', 'at', 'aa', 'cr', 'mni', 'mbs', 'mia'];
  // if cr == true, value is NULL
  const ae_attribute = ['ty', 'rn', 'lbl', 'at', 'aa', 'ast', 'acpi', 'api', 'rr', 'srv', 'poa'];
  const acp_attribute = ['ty', 'rn', 'ri', 'pi', 'ct', 'lt', 'lbl', 'acpi', 'et', 'st', 'cr', 'pv', 'pvs'];
  const grp_attribute = ['ty', 'rn', 'lbl', 'macp', 'at', 'aa', 'ast', 'cr', 'csy', 'gn', 'mt', 'macpi'];
  const sub_attribute = ['ty', 'rn', 'lbl', 'cr', 'acpi', 'enc', 'nu', 'su', 'nec', 'ln', 'nct'];

  const resource = {};

  // console.log(currentNode);
  //console.log("hello im ty", currentNode.ty);
  if (currentNode.ty == 1)
  {
    attribute_check(resource, currentNode, acp_attribute);
  }
  else if (currentNode.ty == 2)
  {
    attribute_check(resource, currentNode, ae_attribute);
  }
  else if (currentNode.ty == 3)
  {
    attribute_check(resource, currentNode, cnt_attribute);
  }
  else if (currentNode.ty == 9)
  {
    attribute_check(resource, currentNode, grp_attribute);
  }
  else if (currentNode.ty == 23)
  {
    attribute_check(resource, currentNode, sub_attribute);
  }
  return resource
}


export function bfs_json(jsonData) {
  console.log(jsonData);
  // let resource;
  let resource_req_que = []; 
    const queue = [jsonData];
    // ty 번호순서대로 create요청 보내기 
    while (queue.length > 0) {
      const currentNode = queue.shift();
      // console.log("current Node is : ", currentNode);
      if (Array.isArray(currentNode)) {
        // console.log("now isArray");
        // 만약 현재 노드가 배열이면, 배열의 각 요소를 큐에 추가
        for (const item of currentNode) {
          queue.push(item);
        }
      } else if (typeof currentNode === 'object') {
        // console.log("now object");
        // 만약 현재 노드가 객체이면, "name" 및 "ty" 값을 확인
        if (currentNode.hasOwnProperty("name") && currentNode.hasOwnProperty("ty")) {
        // console.log(currentNode);
        // console.log(`Name: ${currentNode.name}, Ty: ${currentNode.ty}`);
        // resource = make_request_resource(currentNode);
         resource_req_que.push(make_request_resource(currentNode));
        // console.log(resource)
        }
  
        // 객체의 하위 항목을 큐에 추가
        for (const key in currentNode) {
          if (Array.isArray(currentNode[key]) || typeof currentNode[key] === 'object') {
            queue.push(currentNode[key]);
          }
        }
      }
    }
    return resource_req_que;
  }


//async function get_jsonfile(json_data)
export function get_jsonfile(json_data)
{
  console.log("now get_jsonfile", json_data);
  //const jsonObject = readJSONFile();
  //console.log(jsonObject)
  //console.log(json_data)
  //bfs_json(JSON.stringify(jsonObject, null));
  bfs_json(json_data);
}

export default get_jsonfile;

// export default {
//   //resource,
//   get_jsonfile,
//   bfs_json,
//   make_request_resource,
//   attribute_check,
//   readJSONFile,
// }

// JSON 데이터 가져오기

// if (jsonObject) {
//     // JSON 데이터를 그대로 출력
//     console.log(JSON.stringify(jsonObject, null, 2));
// }

// if (jsonObject) {
//     // jsonObject를 사용하여 JSON 데이터를 처리합니다.
//     console.log(jsonObject);

//     // 예시: JSON 데이터의 "key" 프로퍼티 값을 출력
//     if (jsonObject.hasOwnProperty("key")) {
//         console.log(jsonObject.key);
//     } else {
//         console.log("JSON 데이터에 'key' 프로퍼티가 없습니다.");
//     }
// }
