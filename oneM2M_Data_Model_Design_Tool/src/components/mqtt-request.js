export function attribute_check(resource, currentNode ,attribute_list)
{
  for (const key of attribute_list) 
  {
    if (currentNode.hasOwnProperty(key)) 
    {
      resource[key] = currentNode[key];
    }
    if (currentNode["attrs"].hasOwnProperty(key)) 
    { 
      resource[key] = currentNode["attrs"][key];//JSON.parse(JSON.stringify(currentNode[key]));
      if (key == "cr")
      {
        if (resource[key] == true)
        {
          resource[key] = NULL; 
        }
      }
    }
  }
 return resource;
}
export function obj_to_payload(currentNode, rn_list){
  let payload = {
    op : 1,
	  fr : '',
	  to : '',
	  rqi : '',
	  pc : '',
	  ty : '',
	  ot : ''
  }

  /* --------------- pc, ty -------------- */
  const cnt_attribute = ['ty', 'rn', 'lbl', 'acpi', 'at', 'aa', 'cr', 'mni', 'mbs', 'mia'];
  const ae_attribute = ['ty', 'rn', 'lbl', 'at', 'aa', 'ast', 'acpi', 'api', 'rr', 'srv', 'poa'];
  const acp_attribute = ['ty', 'rn', 'ri', 'pi', 'ct', 'lt', 'lbl', 'acpi', 'et', 'st', 'cr', 'pv', 'pvs'];
  const grp_attribute = ['ty', 'rn', 'lbl', 'macp', 'at', 'aa', 'ast', 'cr', 'csy', 'gn', 'mt', 'macpi'];
  const sub_attribute = ['ty', 'rn', 'lbl', 'cr', 'acpi', 'enc', 'nu', 'su', 'nec', 'ln', 'nct'];

  let resource = {};
  // console.log(currentNode, rn_list);
  if (currentNode.ty == 1)
  {
    resource = attribute_check(resource, currentNode, acp_attribute);
    const pc = JSON.stringify(resource);
    payload.pc = `"m2m:acp" :${pc}`;
    payload.ty = 1;
  }
  else if (currentNode.ty == 2)
  {
    resource = attribute_check(resource, currentNode, ae_attribute);
    const pc = JSON.stringify(resource);
    payload.pc = `"m2m:ae" :${pc}`;
    payload.ty = 2;
  }
  else if (currentNode.ty == 3)
  {
    resource = attribute_check(resource, currentNode, cnt_attribute);
    const pc = JSON.stringify(resource);
    payload.pc = `"m2m:cnt" :${pc}`;
    payload.ty = 3;
  }
  else if (currentNode.ty == 9)
  {
    resource = attribute_check(resource, currentNode, grp_attribute);
    const pc = JSON.stringify(resource);
    payload.pc = `"m2m:grp" :${pc}`;
    payload.ty = 9;
  }
  else if (currentNode.ty == 23)
  {
    resource = attribute_check(resource, currentNode, sub_attribute);
    const pc = JSON.stringify(resource);
    payload.pc = `"m2m:sub" :${pc}`;
    payload.ty = 23;
  }

  console.log(resource, currentNode, rn_list);

  let result = rn_list.replace(/\/[^/]*$/, '');
  payload.fr = `CSE1${result}`;
  payload.to = `TinyIoT${result}`;
  payload.op = 1;
  payload.rqi = Math.floor(Math.random() * 5000);

  console.log(payload);
  return payload;
}



export function bfs(jsonData, targetIP){
  // console.log(jsonData);
  const queue = [[jsonData, ""]]; // 노드와 부모 노드 정보를 함께 저장
  const result = [];
  let payload = "";
  let rn_list = "";

  let resource = {
    currentNode : "", 
    targetIP : "",
    payload : {},
  } 

  while (queue.length > 0) {
    const [currentNode, parentRn] = queue.shift(); // 현재 노드와 부모 노드 정보 추출
    
    if (Array.isArray(currentNode)) {
      for (const item of currentNode) {
        queue.push([item, parentRn]); // 부모 노드 정보를 그대로 전달
      }
    } else if (typeof currentNode === 'object') 
    {
      if (currentNode.hasOwnProperty("name") && currentNode.hasOwnProperty("ty")) 
      {
        if (currentNode.hasOwnProperty("id")) 
        {
          rn_list = parentRn + "/" + currentNode.attrs.rn; // 부모 노드 정보와 현재 노드의 rn 조합
          // console.log(rn_list);
        }
        payload = obj_to_payload(currentNode, rn_list); // 부모 노드 정보 전달
        resource = {currentNode, targetIP, payload};
        console.log(resource);
        result.push(resource);
      }

      for (const key in currentNode) {
        if (Array.isArray(currentNode[key]) || typeof currentNode[key] === 'object') {
          queue.push([currentNode[key], rn_list]); // 부모 노드 정보를 그대로 전달
        }
      }
    }

  }
  return result;
}


export default{
  obj_to_payload,
  bfs,
  attribute_check
}