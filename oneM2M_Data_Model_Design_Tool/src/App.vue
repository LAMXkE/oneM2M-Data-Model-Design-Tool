<template>
  <header>
    <navBar class="nav" />
  </header>
  <div class="configure">
    <div class="box">
      <div class="key">Originator</div>
      <input type="text" v-model="originator" />
    </div>
    <div class="box">
      <div class="key">CSE IP address</div>
      <input type="text" v-model="targetIP" placeholder="http://127.0.0.1:3000/TinyIoT" />
    </div>
    <div>
        <div class="btn button" @click="loadFromRemoteCSE">Load</div>
    </div>
  </div>
  <div class="body">
    <div class="canvas">
        <nestedDraggable 
          :tasks="cse1"
          style="padding-left: 0px;"
          :group="{
                    name: 'resourceTree', 
                    pull: true,
                    put: true
                  }"
          :min-height="200"
          item-key="id"
          @clicked="(element) => { 
            this.setAttributes(element); 
          }"
          @move="(evt) => { this.isDragging = true; }"
          :dragoverBubble="true"
          class="dragArea resourceTree"
          >

          </nestedDraggable>
          <div class="trashcan" v-if="isDragging">

            <draggable
            :group="{
              name: 'trashcan',
              pull: true,
              put: true,
            }"
              :list="[]"
              name="trashcan"
              class="dragArea"
              item-key="id"
              @change="(evt) => { 
                this.isDragging = false; 
                // console.log(evt);
                if(this.selectedElement)
                  this.selectedElement.selected=false; 
                this.selectedElement = undefined; 
                this.attrSettingModified = false;

                return evt;
              }"
              >
              <template #item="item">
                <div class="">{{ item }}</div>
                
              </template>
            </draggable>
            <svg width="25px" height="25px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" version="1.1" id="Capa_1" viewBox="0 0 490.646 490.646" xml:space="preserve">
                <g>
                  <g>
                    <path d="M399.179,67.285l-74.794,0.033L324.356,0L166.214,0.066l0.029,67.318l-74.802,0.033l0.025,62.914h307.739L399.179,67.285z     M198.28,32.11l94.03-0.041l0.017,35.262l-94.03,0.041L198.28,32.11z"/>
                    <path d="M91.465,490.646h307.739V146.359H91.465V490.646z M317.461,193.372h16.028v250.259h-16.028V193.372L317.461,193.372z     M237.321,193.372h16.028v250.259h-16.028V193.372L237.321,193.372z M157.18,193.372h16.028v250.259H157.18V193.372z"/>
                  </g>
                </g>
              </svg>
          </div>
    </div>
    <div class="rightTab">
      <nestedDraggable
        class="dragArea resources list-items"
        :tasks="resources"
        style="padding-left: 0px;"
        :group="{name:'resources', pull: 'clone', put: false}"
        item-key="id"
      >
      </nestedDraggable>
      <div class="buttonBox">
        <div class="btn button" style="background-color: aqua;" @click="createResourceTree">
          Create
        </div>
        <div class="btn button" style="background-color: aquamarine;" @click="saveResourceTree">
          Save
        </div>
        <div class="btn button" style="background-color: lightblue;" @click="loadFile">
          Load
        </div>
        <mq_re :cse1="cse1"></mq_re>
      </div>
    </div>
    <div v-if="attrSetting" class="modal">
      <div class="overlay"> 
      </div>
      <div class="modalBody">
        <setAttrs 
        :element="selectedElement" 
        @modified="(status) => { this.attrSettingModified = status; }"
        @close="() => { 
          this.attrSetting = false; 
          if(this.selectedElement)
            this.selectedElement.selected=false; 
          this.selectedElement = undefined; 
          this.attrSettingModified = false;
      }"
        @save="(newElement, callback) => {
          this.attrSettingModified = false;
          Object.entries(newElement).forEach(([key, value]) => {
            if(value.value.length == 0)
            return;
          
          if(value.value == 0){
            return;
          }
          if(value.dataType === 'Number'){
            if(parseInt(value.value) != NaN && parseInt(value.value) != 0){
              this.selectedElement.attrs[key] = parseInt(value.value);
            }
            else{
              this.selectedElement.attrs[key] = value.value;
            }
          }
          else{
            this.selectedElement.attrs[key] = value.value;
          }
          callback();
        });
      }"
        />
      </div>
    </div>
      
  </div>
  <rawDisplayer class="col-4" :value="cse1" title="List 1" />
</template>

<script>
import draggable from "vuedraggable";
import nestedDraggable from "@/components/infra/nested.vue";
import setAttrs from "@/components/setAttrs.vue";
import navBar from "@/components/navBar.vue";
import { resourceType as RT } from "./components/attributes";
import get_jsonfile from "@/components/json-parser.js";
import mq_re from "@/components/mq-re.vue";
import http_cse_retrieve from "@/components/retrieve_cse.js"

export default {
  name: "App",
  display: "app",
  order: 3,
  components: {
    navBar,
    draggable,
    nestedDraggable,
    setAttrs,
    mq_re,
    // rawDisplayer
  },
  data() {
    return {
      cse1: [
      {
          name: "CSE1",
          ty: RT.CSE,
          tasks: [
          ],
          attrs:{

          }
        }
      ],
      resources: [
          { name: "AE", ty: RT.AE },
          { name: "CNT", ty: RT.CNT },
          { name: "ACP", ty: RT.ACP },
          { name: "GRP", ty: RT.GRP },
          { name: "SUB", ty: RT.SUB },
          // { name: "FCNT", ty: RT.FCNT },
      ]
      ,
      attrSetting : false,
      attrSettingModified: false,
      isDragging: false,
      selectedElement: {},
      targetIP: "",
      originator: "Cae-test-1"
    }
  },
  created(){
    const cse = JSON.parse(sessionStorage.getItem("CSE1"));
    //get_jsonfile(cse);
    if (cse!=undefined) this.cse1 = cse;
    this.targetIP = sessionStorage.getItem('targetIP');
  },
  methods: {
    saveResourceTree(){
      console.log("saveResourceTree");
      this.exportTextFile();
    },
    createResourceTree(){
      console.log("createResourceTree");
      this.create_oneM2M_resource();
     // console.log("create finish");
    },
    setAttributes(element){
      this.selectedElement = element;
      this.attrSettingModified = false;
      this.attrSetting = true;
      element.selected = true;
    },
    create_oneM2M_resource()
    {
      const JSON_string = JSON.stringify(this.cse1);
      const dataToSave = JSON.parse(JSON_string);
      const filename = 'storagedata.json';
      const element = document.createElement('a');
      // console.log("datatosave", dataToSave);
      // console.log("targetIP : ", this.targetIP);
      const target_IP = this.targetIP;
      get_jsonfile(dataToSave, target_IP);
      //console.log("create finish")
    },
    exportTextFile() {
      const dataToSave = sessionStorage.getItem('CSE1');
      const filename = 'storagedata.json';
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/json;charset=utf-8, ' + encodeURIComponent(dataToSave));
      element.setAttribute('download', filename);
      document.body.appendChild(element);
      element.click();
    },
    loadFile() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/json') {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = e.target.result;
              sessionStorage.setItem('CSE1', data);
              this.loadFromSessionStorage();
            } catch (err) {
              console.error('Invalid JSON file:', err);
            }
          };
          reader.readAsText(file);
        } else {
          console.error('Invalid file type. Please upload a JSON file.');
        }
      };
      fileInput.click();
    },
    loadFromRemoteCSE(){
      console.log("loadFromRemoteCSE");
      console.log(this.targetIP);
      sessionStorage.setItem('targetIP', this.targetIP);
      if(this.targetIP === ""){
        alert("Please input CSE IP address");
        return;
      }
      const url = this.targetIP;
      const protocol = url.split(':')[0];
      var ip = "";
      var port = "";
      var path = "";
      if(url.split(':').length == 3){
        ip = url.split(':')[1].replace('//','');
        port = url.split(':')[2].split('/')[0];
        path = url.split(':')[2].split('/').slice(1).join('/');
      }
      else{
        ip = url.split(':')[1].replace('//','');
        port = "80";
        path = url.split(':')[1].split('/').slice(1).join('/');
      }
      console.log(protocol, ip, port, path);
      if(protocol === "http"){
        const setCSEData = (data) => {
          console.log(data['m2m:cb']);
          this.cse1[0].attrs = data['m2m:cb'];
        };
        http_cse_retrieve(this.originator, ip, port, path, setCSEData);
        // console.log(cb);
      }
      else if(protocol === "https"){
        alert("https is not supported yet");
      }
      else{
        alert("Please input correct protocol");
      }
    },
    loadFromSessionStorage() {
      const data = sessionStorage.getItem('CSE1');
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          if (!this.checkData(parsedData[0])) {
            return;
          }
          this.cse1 = parsedData;
        } catch (err) {
          console.error('Invalid JSON data in sessionStorage:', err);
        }
      }
    },
    checkData(data) {    
      const allowedResourcesMap = { /* childResource */
        'AE': ['SUB', 'CNT', 'GRP', 'ACP'],
        'CNT': ['SUB', 'CNT'],
        'SUB': [],
        'GRP': ['SUB'],
        'ACP': ['SUB'],
      };
      const typeNum = [RT.MIXED, RT.ACP, RT.AE, RT.CNT, RT.CIN, RT.CSE, RT.GRP, RT.CSR, RT.SUB];                                              // TinyIoT Resource Type
      
      const resourceType = ['ACP', 'AE', 'CNT', 'CIN', 'CSE', 'GRP', 'CSR', 'SUB'];                                                           // Resource Type
      const serializations = ['application/json', 'application/xml', 'application/cbor'];                                                     // Serialization Type

      // const announceSyncType = ['UNI_DIRECTIONAL', 'BI_DIRECTIONAL'];
      // const notificationEventCat = ['Immediate', 'BestEffort', 'Latest'];
      // const notificationContentType = ['All_Attributes', 'Modified_Attributes', 'ResourceID', 'Trigger_Payload', 'TimeSeries_notification'];
      // const consistencyStrategy = ['ABANDON_MEMBER', 'ABANDON_GROUP', 'SET_MIXED'];

      const attributeCSE = data.attrs;
      if(data.ty == RT.CSE) { /* CSE */
        if(
          (attributeCSE.ty !== RT.CSE) ||                                                                                                     // Mandatory Attribute
          (typeof attributeCSE.rn !== "undefined" && !/^[a-zA-Z0-9\-._]*$/.test(attributeCSE.rn)) ||                                          // resourceName
          (typeof attributeCSE.lbl !== "undefined" && !/^[a-zA-Z0-9:]*$/.test(attributeCSE.lbl)) ||                                           // labels
          (typeof attributeCSE.acpi !== "undefined" && typeof attributeCSE.acpi !== 'string') ||                                              // accessControlPolicyIDs
          (typeof attributeCSE.cst == "undefined" && (attributeCSE.cst < 1 || attributeCSE.cst > 3)) ||                                       // cseType
          (typeof attributeCSE.csi !== "undefined" && typeof attributeCSE.csi !== 'string') ||                                                // CSE-ID
          (typeof attributeCSE.poa !== "undefined" && typeof attributeCSE.poa !== 'string')                                                   // pointOfAccess
        ){
          alert("Invalid Loading(CSE)");
          return false;
        }
        if (Array.isArray(attributeCSE.srt)) {                                                                                                // supportedResourceType                                                                                                   
          for (let i = 0; i < attributeCSE.srt.length; i++) {
            if (!resourceType.includes(attributeCSE.srt[i])) {
              alert("Invalid Loading(CSE)");
              return false;
            }
          }
        }
        if (Array.isArray(attributeCSE.csz)) {                                                                                                // supportedResourceType                                                                                                   
          for (let i = 0; i < attributeCSE.csz.length; i++) {
            if (!serializations.includes(attributeCSE.csz[i])) {
              alert("Invalid Loading(CSE)");
              return false;
            }
          }
        }
      }

      for (const task of data.tasks) { // Recursively check the tasks of this task by calling this function again
        if (Array.isArray(task.tasks)) { /* childResource */
          if (task.tasks.some(subTask => !allowedResourcesMap[task.name].includes(subTask.name))) {
            alert("Invalid ChildResource(AE)"); 
            return false;
          }
        }
        const attribute = task.attrs;
        if(task.ty == RT.ACP){ /* AE */
          if(
            (typeof attribute.pv == "undefined" || typeof attribute.pvs == "undefined" || attribute.ty !== RT.ACP) ||                         // Mandatory Attribute
            (typeof attribute.rn !== "undefined" && !/^[a-zA-Z0-9\-._]*$/.test(attribute.rn)) ||                                              // resourceName
            (typeof attribute.lbl !== "undefined" && !/^[a-zA-Z0-9:]*$/.test(attribute.lbl)) ||                                               // labels
            (typeof attribute.pv.acop == "undefined" && (attribute.pv.acop < 1 || attribute.pv.acop > 6)) ||                                  // privileges accessControlOperations
            (typeof attribute.pvs.acop == "undefined" && (attribute.pvs.acop < 1 || attribute.pvs.acop > 6))                                  // selfPrivileges accessControlOperations
            ){ 
              alert("Invalid Loading(ACP)");
              return false;
          }
          if (Array.isArray(attribute.pv.acor)) {                                                                                             // privileges accessControlOriginators
            for (let i = 0; i < attribute.pv.acor.length; i++) {
              if (typeof attribute.pv.acor[i] !== 'string') {
                alert("Invalid Loading(ACP)");
                return false;
              }
            }
          }
          if (Array.isArray(attribute.pvs.acor)) {                                                                                            // selfPrivileges accessControlOriginators
            for (let i = 0; i < attribute.pv.acor.length; i++) {
              if (typeof attribute.pv.acor[i] !== 'string') {
                alert("Invalid Loading(ACP)");
                return false;
              }
            }
          }
        }
        else if(task.ty == RT.AE){ /* AE */
          if(
            (typeof attribute.api == "undefined" || typeof attribute.rr == "undefined" || attribute.srv == "undefined" || attribute.ty !== RT.AE) ||             // Mandatory Attribute
            (typeof attribute.rn !== "undefined" && !/^[a-zA-Z0-9\-._]*$/.test(attribute.rn)) ||                                                                 // resourceName
            (typeof attribute.lbl !== "undefined" && !/^[a-zA-Z0-9:]*$/.test(attribute.lbl)) ||                                                                  // labels
            (typeof attribute.acpi !== "undefined" && typeof attribute.acpi !== 'string') ||                                                                     // accessControlPolicyIDs
            (typeof attribute.at !== "undefined" && typeof attribute.at !== 'string') ||                                                                         // announceTo
            (typeof attribute.aa !== "undefined" && (typeof attribute.aa !== 'string' || attribute.aa.includes(':'))) ||                                         // announcedAttribute
            (typeof attribute.ast !== "undefined" && (attribute.ast < 1 || attribute.ast > 2)) ||                                                                // announceSyncType            
            (typeof attribute.apn !== "undefined" && typeof attribute.apn !== 'string') ||                                                                       // appName
            (typeof attribute.api !== "undefined" && (typeof attribute.api !== 'string' || !attribute.api.startsWith('N'))) ||                                   // App-ID
            (typeof attribute.aei !== "undefined" && typeof attribute.aei !== 'string') ||                                                                       // AE-ID
            (typeof attribute.rr == "undefined" && typeof attribute.rr !== 'boolean') ||                                                                         // requestReachability
            (typeof attribute.poa !== "undefined" && typeof attribute.poa !== 'string')                                                                          // pointOfAccess
            ){ 
            alert("Invalid Loading(AE)");
            return false;
          }
          if (Array.isArray(attribute.srv)) {                                                                                                                    // supportedReleaseVersions
            for (let i = 0; i < attribute.srv.length; i++) {
              if (!['1','2','2a','3','4','5'].includes(attribute.srv[i])) {
                alert("Invalid Loading(AE)");
                return false;
              }
            }
          }
        }
        if(task.ty == RT.CNT){ /* CNT */
          if(
            (attribute.ty !== RT.CNT) ||                                                                                                      // Mandatory Attribute
            (typeof attribute.lbl !== "undefined" && !/^[a-zA-Z0-9:]*$/.test(attribute.lbl)) ||                                               // labels
            (typeof attribute.acpi !== "undefined" && typeof attribute.acpi !== 'string') ||                                                  // accessControlPolicyIDs
            (typeof attribute.at !== "undefined" && typeof attribute.at !== 'string') ||                                                      // announceTo
            (typeof attribute.aa !== "undefined" && (typeof attribute.aa !== 'string' || attribute.aa.includes(':'))) ||                      // announcedAttribute
            (typeof attribute.ast !== "undefined" && (attribute.ast < 1 || attribute.ast > 2)) ||                                             // announceSyncType            
            (typeof attribute.cr !== "undefined" && typeof attribute.cr !== 'boolean') ||                                                     // creator
            (typeof attribute.mni !== "undefined" && (!Number.isInteger(attribute.mni) || attribute.mni < 0)) ||                              // maxNrOfInstances
            (typeof attribute.mbs !== "undefined" && (!Number.isInteger(attribute.mbs) || attribute.mbs < 0)) ||                              // maxByteSize
            (typeof attribute.mia !== "undefined" && (!Number.isInteger(attribute.mia) || attribute.mia < 0))                                 // maxInstanceAge
            ){ 
            alert("Invalid Loading(CNT)");
            return false;
          }
        }        
        if(task.ty == RT.SUB){ /* SUB */
          if(
            (typeof attribute.nu == "undefined" || attribute.ty !== RT.SUB) ||                                                                // Mandatory Attribute
            (typeof attribute.lbl !== "undefined" && !/^[a-zA-Z0-9:]*$/.test(attribute.lbl)) ||                                               // labels
            (typeof attribute.acpi !== "undefined" && typeof attribute.acpi !== 'string') ||                                                  // accessControlPolicyIDs
            (typeof attribute.cr !== "undefined" && typeof attribute.cr !== 'boolean') ||                                                     // creator
            (typeof attribute.nu !== "undefined" && typeof attribute.nu !== 'string') ||                                                      // notificationURI
            (typeof attribute.su !== "undefined" && typeof attribute.su !== 'string') ||                                                      // subscriberURI
            (typeof attribute.nec !== "undefined" && (attribute.nec < 2 || attribute.nec > 4)) ||                                             // notificationEventCat
            (typeof attribute.ln !== "undefined" && typeof attribute.ln !== 'boolean') ||                                                     // latestNotify
            (typeof attribute.nct !== "undefined" && (attribute.nct < 1 || attribute.nct > 5))                                                // notificationContentType
            ){ 
            alert("Invalid Loading(SUB)");
            return false;
          }
        }
        if(task.ty == RT.GRP){ /* GRP */
          if(
            (typeof attribute.mnm == "undefined" || typeof attribute.mid == "undefined" || attribute.ty !== RT.GRP) ||                        // Mandatory Attribute
            (typeof attribute.lbl !== "undefined" && !/^[a-zA-Z0-9:]*$/.test(attribute.lbl)) ||                                               // labels
            (typeof attribute.acpi !== "undefined" && typeof attribute.acpi !== 'string') ||                                                  // accessControlPolicyIDs
            (typeof attribute.at !== "undefined" && typeof attribute.at !== 'string') ||                                                      // announceTo
            (typeof attribute.aa !== "undefined" && (typeof attribute.aa !== 'string' || attribute.aa.includes(':'))) ||                      // announcedAttribute
            (typeof attribute.ast !== "undefined" && (attribute.ast < 1 || attribute.ast > 2)) ||                                             // announceSyncType            
            (typeof attribute.cr !== "undefined" && typeof attribute.cr !== 'boolean') ||                                                     // creator
            (typeof attribute.mnm !== "undefined" && (!Number.isInteger(attribute.mnm) || attribute.mnm <= 0)) ||                             // maxNrOfMembers
            (typeof attribute.mid !== "undefined" && typeof attribute.mid !== 'string') ||                                                    // memberIDs
            (typeof attribute.csy !== "undefined" && (attribute.csy < 1 || attribute.csy > 3)) ||                                             // consistencyStrategy
            (typeof attribute.gn !== "undefined" && typeof attribute.gn !== 'string')                                                         // groupName 
            ){ 
            alert("Invalid Loading(GRP)");
            return false;
          }
          if (typeof attribute.mt !== "undefined" && !typeNum.includes(attribute.mt)) {                                                       // memberType
            alert("Invalid Syntax(AE)");
            return false;
          }
          if (Array.isArray(attribute.macp)) {                                                                                                // membersAccessControlPolicyIDs
            for (let i = 0; i < attribute.macp.length; i++) {
              if (typeof attribute.macp[i] !== 'string') {
                alert("Invalid Loading(GRP)");
                return false;
              }
            }
          }
        }
        else /* Invalid Resource Type */
          return false; 

        if(!this.checkData(task)) {
          return false;
        }
      }
      return true;
    },
  },
  watch: {
    cse1 : {
      deep: true,
      handler(){
        this.isDragging=false;
      sessionStorage.setItem("CSE1",JSON.stringify(this.cse1, null, 2));
      }
    }
  }
}
</script>
<style scoped>
#app{
  overflow: hidden;
}

.configure {
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
  align-items: flex-start;
  margin-left: 10px;
  margin-right: 10px;
  min-width: 1200px;
  overflow: hidden;

}
.configure .box {
  border: 1px solid black;
  padding: 5px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: #eee;
  border-radius: 5px;
  display: flex;
  align-items: center;
  flex-direction: row;
  min-height: 20px;
}

.configure .box .key {
  width: 200px;
  text-align: center;
}

.configure .box input {
  flex-grow: 1;
  border-radius: 5px;
  padding: 5px;
  width: 100%;
}

.body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin: 10px;
  height: 100%;
  min-width: 1200px;
  overflow: hidden;
}

.canvas {
  border: 1px solid black;
  width: 75%;
  height: 80vh;
  padding: 10px;
  margin: 10px;
  background-color: #eee;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

.rightTab {
  border: 1px solid black;
  width: 25%;
  height: 80vh;
  padding: 10px;
  margin: 10px;
  overflow: auto;
  background-color: #eee;
  border-radius: 5px;

}
.nav {
  margin-bottom: 15px;
  min-width: 1200px;
  overflow: hidden;
  margin-right: 0px;
}

.dragArea {
  border: 1px solid red;
  position: relative;

}

.resourceTree {
  flex-grow: 1;
}

.trashcan {
  height: 10%;
}

.trashcan .dragArea {
  height: 100%;
}
.trashcan svg{
  position: relative;
  left: 49%;
  bottom: 80%;
  width: 40px;
  height: 40px;
}

.serverName {
  background-color: #ccc;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.0;
  text-align: center;
  width: 120px;
}

.buttonBox {
  position: relative;
  bottom: 10px;
  right: 10px;
  width: 100%;
  text-align: center;
  padding: 10px;
}

.modal {
  position: fixed;
  display: block;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;

}

.modal .overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.3);
}

.modal .modalBody {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
  width: 70vw;
  height: auto;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 15px;

}

.button {
  margin: 0px;
  padding: 10px;
}

.selectedBox {
  border: 1px solid black;
  border-radius: 5px;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.0;
  text-align: center;
  width: 120px;
}


</style>