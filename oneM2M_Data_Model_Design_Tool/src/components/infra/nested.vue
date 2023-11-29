<template>
    <draggable
      class="dragArea"
      tag="ul"
      :clone="cloneResource"
      :list="tasks"
      :group="this.group"
      :sort="true"
      item-key="id"
      :move="validateMove"
    >
      <template #item="{ element }">
        <li class="resourceBox" @click.stop @click="$emit('clicked', element)">
          <p :class="{ selected: element.selected }">{{ element.name }}</p>
          <nested-draggable 
            v-if="element.tasks && getChildRT(element.ty).length > 0" 
            :tasks="element.tasks" 
            :group="this.group"
            @clicked="(element) => { $emit('clicked', element) }"
            :childRT="getChildRT(element.ty)"
            />
        </li>
      </template>
    </draggable>
  </template>


  <script>
  import draggable from "vuedraggable";
  import {v4 as uuidv4} from 'uuid';
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

  const resourceStructure = {
    5:[RT_AE, RT_GRP, RT_MGMTOBJ, RT_ACP, RT_FCNT, RT_CNT, RT_SUB],
    1:[],
    2:[RT_CNT, RT_GRP, RT_SUB, RT_FCNT, RT_TS, RT_TSI, RT_TSR, RT_MGMTOBJ, RT_NODE],
    3:[RT_CNT, RT_FCNT, RT_TS],
    4:[],
    9:[],
    16:[],
    23:[]
  }

  export default {
    props: {
      tasks: {
        required: true,
        type: Array
      },
      group: {
        required: true,
        type: Object
      },
      childRT: {
        required: false,
        type: Array,
        default: () => []
      },
      clickMethod: {
        required: false,
        type: Function,
        default: () => {}
      }
    },
    components: {
      draggable
    },
    computed:{
    },
    name: "nested-draggable"
    ,
    methods: {
      validateMove(evt) {
        if(evt?.to?.parentElement?.className  == 'trashcan'){
          // console.log("trashcan");
          evt.willInsertAfter = true;
          return true;
        }
        if(evt.relatedContext.component.$parent.childRT == undefined){
          evt.willInsertAfter = false;
          return false;
        }
        if(evt.relatedContext.component.$parent.childRT.indexOf(evt.draggedContext.element.ty) == -1){
          evt.willInsertAfter = false;
          return false;
        }
        
        evt.willInsertAfter = true;
        return true;
      },
      cloneResource(evt) {
        // console.log("cloneResource", evt);
        let newElement = JSON.parse(JSON.stringify(evt));
        // const uuid = uuidv4();
        if(newElement.id == undefined)
          newElement.id = uuidv4();
        newElement.tasks = [];
        newElement.attrs={};
        return newElement;
      },
      RTtoStr(ResourceType) {
        switch(ResourceType){
          case RT_CSE:
            return "CSE";
          case RT_AE:
            return "AE";
          case RT_CNT:
            return "CNT";
          case RT_ACP:
            return "ACP";
          case RT_GRP:
            return "GRP";
          case RT_SUB:
            return "SUB";
          case RT_FCNT:
            return "FCNT";
          case RT_TS:
            return "TS";
        }
      },
      getChildRT(parent_ty){
        return resourceStructure[parent_ty];
      },
    }
  };
  </script>
  <style scoped>
   .dragArea {
    min-height: 20px;
    /* outline: 1px dashed; */
  } 
  .resources .resourceBox .dragArea {
  padding-left: 0px;
  min-height: 0px !important;
  outline: 0px !important;
}
  .resourceBox {
    list-style-type: none;
  }

  .selected {
    background-color: #ccc;
    border: 2px solid orange !important;
    border-radius: 5px;
    margin: 5px;
    padding: 5px;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.0;
    text-align: center;
    width: 120px;
  }
  .resourceBox p{
    outline: 1px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #000;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.5;
    text-align: center;
    width: 150px;
    min-height: 40px;
    margin: 10px;

  }

  </style>