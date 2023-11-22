<template>
  <header>
    <navBar class="nav" />
  </header>
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
          :clickMethod="setAttributes"
          @move="(evt) => { this.isDragging = true; return true; }"
          @drop="(evt) => { this.isDragging = false; return true; }"
          :dragoverBubble="true"
          class="dragArea resourceTree"
          >

          </nestedDraggable>
          <div class="trashcan" v-if="isDragging">

            <draggable
            :group="{
              name: 'trashcan',
              pull: (element) => {console.log(element); return true; },
              put: true,
            }"
              :list="[]"
              name="trashcan"
              class="dragArea"
              item-key="id"
              @change="(evt) => { isDragging = false; return evt;}"
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
    <div v-if="!attrSetting" class="rightTab">
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
        <div class="button" style="background-color: lightblue;" @click="loadFile">
          Load
        </div>
        <div class="btn button" style="background-color: red;" @click="createConnection">
          Connect
        </div>
        <div class="btn button" style="background-color: blue;" @click="doSubscribe">
          Sub
        </div>
        <div class="btn button" style="background-color: Yellow;" @click="doPublish">
          Pub
        </div>
      </div>
    </div>
    <div v-if="attrSetting" class="rightTab">
        <setAttrs 
        :element="selectedElement" 
        @modified="(status) => { this.attrSettingModified = status; }"
        @close="() => { this.attrSetting = false; this.selectedElement.selected=false; this.selectedElement = undefined; this.attrSettingModified = false;}"
        @save="(newElement, callback) => {
          this.attrSettingModified = false;
          Object.entries(newElement).forEach(([key, value]) => {
            if(value.value.length == 0)
              return;

            if(value.value == 0){
              return;
            }

            if(value.type == 'Number' && parseInt(value.value) != NaN && parseInt(value.value) != 0){
              this.selectedElement.attrs[key] = parseInt(value.value);
            }else{
              this.selectedElement.attrs[key] = value.value;
            }
            callback();
          });
        }"
        />
    </div>

  </div>
  <rawDisplayer class="col-4" :value="cse1" title="List 1" />

  <rawDisplayer class="col-4" :value="resources" title="List 2" />
</template>

<script>
import draggable from "vuedraggable";
import VueDraggableResizable  from "vue-draggable-resizable-vue3";
import nestedDraggable from "@/components/infra/nested.vue";
import setAttrs from "@/components/setAttrs.vue";
import navBar from "@/components/navBar.vue";
import mqtt from 'mqtt';

const RT_CSE = 5;
const RT_ACP = 1;
const RT_AE = 2;
const RT_CNT = 3;
const RT_GRP = 9;
const RT_SUB = 23;
const RT_FCNT = 7;
const RT_TS = 8;
const RT_TSI = 9;
const RT_TSR = 10;
const RT_MGMTOBJ = 11;
const RT_NODE = 14;


export default {
  name: "App",
  display: "app",
  order: 3,
  components: {
    navBar,
    draggable,
    VueDraggableResizable,
    nestedDraggable,
    setAttrs
    // rawDisplayer
  },
  data() {
    return {
      cse1: [
      {
          name: "CSE1",
          ty: RT_CSE,
          tasks: [
          ],
          attrs:{

          }
        }
      ],
      resources: [
        
          { name: "AE", id: 2, ty: RT_AE },
          { name: "CNT", id: 3, ty: RT_CNT },
          { name: "ACP", id: 4, ty: RT_ACP },
          { name: "GRP", id: 5, ty: RT_GRP },
          { name: "SUB", id: 6, ty: RT_SUB },
          { name: "FCNT", id: 7, ty: RT_FCNT },
      ]
      ,
      attrSetting : false,
      attrSettingModified: false,
      isDragging: false,
      selectedElement: {},
      // mqtt connection data field
      pl : {
        "fr" : "CSE19",
        "op" : 1,
        "pc" : {
            "m2m:ae" : {
              "rn": "test",
              "api": "AE__001",
              "rr":true
            }
        },
        "rqi" : "m_createAE001",
        "to" : "TinyIoT",
        "ty" : 2
      }
    ,
      connection: {
        protocol: 'ws',
        host: 'localhost',
        // ws: 8083; wss: 8084
        port: 8083,
        endpoint: '/mqtt',
        // for more options, please refer to https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
        clean: true,
        connectTimeout: 30 * 1000, // ms
        reconnectPeriod: 4000, // ms
        clientId:
          'emqx_vue_' +
          Math.random()
            .toString(16)
            .substring(2, 8),
        // auth
        username:'',
        password:'',
      },
      subscription: {
        topic: '/oneM2M/resp/CSE19/+/#',
        qos: 0,
      },
      publish: {
        topic: '/oneM2M/req/CSE19/tinyiot/json',
        qos: 0,
        payload :'{"fr" : "CSE19", "op" : 1, "pc" : {"m2m:ae" : {"rn": "test2","api": "Rae002","rr":true, "srv": ["2a", "3"]}},"rqi" : "m_createAE003","to" : "TinyIoT", "ty" : 2}'
      },
      receiveNews: '',
      qosList: [0, 1, 2],
      client: {
        connected: false,
      },
      subscribeSuccess: false,
      connecting: false,
      retryTimes: 0,
    }
  },
  created(){
    const cse = JSON.parse(sessionStorage.getItem("CSE1"));
    if (cse!=undefined) this.cse1 = cse;
  },
  methods: {
    log: function(evt) {
      // window.console.log(evt);
    },  
    saveResourceTree(){
      console.log("saveResourceTree");
      this.exportTextFile();
    },
    createResourceTree(){
      console.log("createResourceTree");
      this.submit();
    },

    setAttributes(element){
      if(element == this.selectedElement){
        return;
      }
      if(this.attrSettingModified){
        if(confirm("Are you sure to switch without saving?")){
          this.selectedElement.selected = false;
          this.selectedElement = element;
          this.attrSettingModified = false;
          element.selected = true;
        }
      }else{
        if(this.selectedElement)
          this.selectedElement.selected = false;
        this.selectedElement = element;
        this.attrSettingModified = false;
        this.attrSetting = true;
        element.selected = true;
      }
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
    loadFromSessionStorage() {
      const data = sessionStorage.getItem('CSE1');
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          this.cse1 = parsedData;
        } catch (err) {
          console.error('Invalid JSON data in sessionStorage:', err);
        }
      }
    },
    submit(){
      this.createConnection();
      this.doPublish();
      this.destroyConnection();
    },
    initData() {
      this.client = {
        connected: false,
      }
      this.retryTimes = 0
      this.connecting = false
      this.subscribeSuccess = false
    },
    handleOnReConnect() {
      this.retryTimes += 1
      if (this.retryTimes > 5) {
        try {
          this.client.end()
          this.initData()
          this.$message.error('Connection maxReconnectTimes limit, stop retry')
        } catch (error) {
          this.$message.error(error.toString())
        }
      }
    },
    createConnection() {
      try {
        this.connecting = true
        const { protocol, host, port, endpoint, ...options } = this.connection
        const connectUrl = `${protocol}://${host}:${port}${endpoint}`
        this.client = mqtt.connect(connectUrl, options)
        if (this.client.on) {
          this.client.on('connect', () => {
            this.connecting = false
            console.log('Connection succeeded!')
          })
          this.client.on('reconnect', this.handleOnReConnect)
          this.client.on('error', error => {
            console.log('Connection failed', error)
          })
          this.client.on('message', (topic, message) => {
            this.receiveNews = this.receiveNews.concat(message)
            console.log(`Received message ${message} from topic ${topic}`)
          })
        }
      } catch (error) {
        this.connecting = false
        console.log('mqtt.connect error', error)
      }
    },
    // subscribe topic
    // https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback
      doSubscribe() {
      const { topic, qos } = this.subscription
      this.client.subscribe(topic, { qos }, (error, res) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
        this.subscribeSuccess = true
        console.log('Subscribe to topics res', res)
      })
    },
    // unsubscribe topic
    // https://github.com/mqttjs/MQTT.js#mqttclientunsubscribetopictopic-array-options-callback
    doUnSubscribe() {
      const { topic } = this.subscription
      this.client.unsubscribe(topic, error => {
        if (error) {
          console.log('Unsubscribe error', error)
        }
      })
    },
    // publish message
    // https://github.com/mqttjs/MQTT.js#mqttclientpublishtopic-message-options-callback
    doPublish() {
      const { topic, qos, payload } = this.publish
      this.client.publish(topic, payload, { qos }, error => {
        if (error) {
          console.log('Publish error', error)
        }
      })
      //console.log(JSON.stringify(this.pl))
    },
    // disconnect
    // https://github.com/mqttjs/MQTT.js#mqttclientendforce-options-callback
    destroyConnection() {
      if (this.client.connected) {
        try {
          this.client.end(false, () => {
            this.initData()
            console.log('Successfully disconnected!')
          })
        } catch (error) {
          console.log('Disconnect failed', error.toString())
        }
      }
    },
    handleProtocolChange(value) {
      this.connection.port = value === 'wss' ? '8084' : '8083'
    }
  },
  watch: {
    cse1 : {
      deep: true,
      handler(){
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
  overflow: hidden;
  background-color: #eee;
  border-radius: 5px;

}
.nav {
  margin-bottom: 15px;
  min-width: 1200px;
  overflow: hidden;
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