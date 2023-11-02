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

async function bfs_json(json_data){

}

// JSON 데이터 가져오기
const jsonObject = readJSONFile(jsonFilePath);
bfs_json(jsonObject);

if (jsonObject) {
    // JSON 데이터를 그대로 출력
    console.log(JSON.stringify(jsonObject, null, 2));
}

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
