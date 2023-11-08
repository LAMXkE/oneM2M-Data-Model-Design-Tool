// async function json_parser(data)
// {
//     // 웹에서 전달받은 json파일 파싱 및 resource_create함수에 전달
// }
const fs = require('fs'); // Node.js의 파일 시스템 모듈을 불러옵니다.

// 로컬 JSON 파일의 경로 (여기서는 예시 파일 경로입니다. 실제 파일 경로로 변경해야 합니다.)
const jsonFilePath = "storagedata.json"//local json file path;

// JSON 파일을 읽어오는 함수
function readJSONFile(filePath) {
    try {
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return jsonData;
    } catch (error) {
        console.error('파일 읽기 오류:', error);
        return null;
    }
}

function send_request(currentNode)
{
  //ty, rn + resource 형성, http-request에 데이터 전송
  //ty에 따라서 호출해야하는 함수가 다름.. 
  console.log(currentNode);


}

function bfs_json(jsonData) {
    const queue = [jsonData];
    // ty 번호순서대로 create요청 보내기 
    while (queue.length > 0) {
      const currentNode = queue.shift();
  
      if (Array.isArray(currentNode)) {
        // 만약 현재 노드가 배열이면, 배열의 각 요소를 큐에 추가
        for (const item of currentNode) {
          queue.push(item);
        }
      } else if (typeof currentNode === 'object') {
        // 만약 현재 노드가 객체이면, "name" 및 "ty" 값을 확인
        if (currentNode.hasOwnProperty("name") && currentNode.hasOwnProperty("ty")) {
          //console.log(currentNode);
          //console.log(`Name: ${currentNode.name}, Ty: ${currentNode.ty}`);
          send_request(currentNode);
        }
  
        // 객체의 하위 항목을 큐에 추가
        for (const key in currentNode) {
          if (Array.isArray(currentNode[key]) || typeof currentNode[key] === 'object') {
            queue.push(currentNode[key]);
          }
        }
      }
    }
  }

// JSON 데이터 가져오기
const jsonObject = readJSONFile(jsonFilePath);

//bfs_json(JSON.stringify(jsonObject, null));
bfs_json(jsonObject);

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
