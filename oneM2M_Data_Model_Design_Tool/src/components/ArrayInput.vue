<template>
    <input
    :disabled="content.disable" 
    autocomplete="off" 
    :required="content.required" 
    v-model="contents.raw_value"
    :placeholder="content.placeholder"
    @keydown.enter.prevent=""
    v-on:keyup.prevent="(evt) => { addArrayItem(evt, contents, contents.value) }" 
    @input="isModified=true" />
    <ul class="Arrayitems">
        <li v-for="item2, idx2 in contents.value" :key="idx2" class="item">
            {{ item2 }}
            <button class="arrayDelete" @click="contents.value.splice(idx2, 1)">x</button>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'ArrayInput',
    emits: ['input', 'addArrayItem'],
    data: function(){
        return {
            contents: {
                raw_value: "",
                value: []
            },
            isModified: false
        }
    },
    mounted: function(){
        this.contents.value = this.content.value;
    },
    props: {
        content: {
            required: true,
            type: Object
        },
    },
    watch: {
        contents: {
            deep: true,
            handler(){
                this.$emit('input', this.contents.value);
            },
        }
    },
    methods:{
        addArrayItem(evt){
            if(evt.code == 'Enter'){
                return;
            }
            if(evt?.code =='Comma'){
                var str = evt.target;
                if(str.value.length < 0 || str.value == ""){
                    str.value="";
                    return;
                }
                str.value = str.value.replace(/,/g, "");
                if(str.value == ""){
                    return;
                }
                
                if(this.content.validation != undefined && !this.content.validation(str.value)){
                    console.log("invalid value");
                    alert("invalid value");
                    return;
                }
                this.contents.value.find((item) => item == str.value) ? null : this.contents.value.push(str.value);
                this.contents.raw_value = "";
            }
        }
    }
}
</script>

<style scoped>

input {
    width: 100%;
    padding: 0%;
    margin: 0%;
}


.Arrayitems {
  list-style: none;
  display: flex;
  flex-wrap: wrap ;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  margin: 0;
  padding: 0;
  white-space: inherit;
}

.arrayInput .divider {
    flex-basis: 100%;
}
.item {
    background-color: beige;
    margin: 5px;
    padding-left: 5px;
    padding-right: 5px;
    border: black 1px solid;
    border-radius: 4px;
    white-space: nowrap;
}
.tag {
  background: rgb(250, 104, 104);
  padding: 5px;
  border-radius: 4px;
  color: white;
  white-space: nowrap;
  transition: 0.1s ease background;
}

.arrayDelete {
  color: black;
  background: none;
  outline: none;
  border: none;
  cursor: pointer;
}
</style>