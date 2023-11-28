<template>
  <div>
  <button @click="submit">
    Submit
  </button><!--
  <button  @click="createConnection">
    Connect
  </button>
  <button @click="doSubscribe">
    Sub
  </button>
  <button @click="doPublish">
    Pub  
  </button>-->
  </div>
</template>
<script>

import mqtt from 'mqtt'
//import {resource, get_jsonfile,
import {get_jsonfile,
  bfs_json,
  make_request_resource,
  attribute_check,
  readJSONFile } from './json-parser2.js'

export default{
    name: "mq_re",
    props: {
      cse1: Object,
      originator: String
    },
    data(){
     return{
        connection: {
            protocol: 'ws',
            host: 'localhost',
            // ws: 8083; wss: 8084
            port: 8083,
            endpoint: '/mqtt',
            // for more options, please refer to https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
            clean: true,
            connectTimeout: 30 * 1000, // ms
            reconnectPeriod: 0, // ms 0(default) is do not reconnect
            clientId:
            'sejong_guest' +
            Math.random()
                .toString(16)
                .substring(2, 8),
            // auth
            username:'',
            password:'',
        },
        subscription: {
            topic: '/oneM2M/resp/CSE1/+/#', //
            qos: 0,
        },
        publish: {
            topic: '/oneM2M/req/CSE1/tinyiot/json',
            qos: 0,
            payload :'{"fr" : "CSE1", "op" : 1, "pc" : {"m2m:ae" : {"rn": "test2","api": "Rae002","rr":true, "srv": ["2a", "3"]}},"rqi" : "m_createAE003","to" : "TinyIoT", "ty" : 2}'
        },
        receiveNews: '',
        qosList: [0, 1, 2],
        client: {
            connected: false,
        },
        subscribeSuccess: false,
        connecting: false,
        retryTimes: 0,
        resource_req_que: []
      }
    },
    methods: {
        submit() {
            this.resource_req_que = bfs_json(this.cse1)
            this.createConnection(); //통신 연결
            this.resource_sub_pub_init();
            this.doSubscribe();
            this.resource_req_que.forEach((resource) => {
              //console.log(resource);
              // 각 resource에 대한 작업 실행
              this.doPublish(); 
            });
        },
        resource_sub_pub_init(){
            const recei = this.cse1[0].attrs.rn;
            /* sub init */ 
            this.subscription.topic = `/oneM2M/resp/${this.originator}/+/#`;
            console.log(this.subscription.topic)
            /* pub init */ 
            this.publish.topic = `/oneM2M/req/${this.originator}/${recei}/json`;
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
              } 
              catch (error) {
                console.log('Disconnect failed', error.toString())
              }
            }
          },
        handleProtocolChange(value) {
           this.connection.port = value === 'wss' ? '8084' : '8083'
          }        
    },
}
</script>