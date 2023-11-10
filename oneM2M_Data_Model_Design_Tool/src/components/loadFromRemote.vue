<!-- Load from Remote server -->
<!-- 
    show modal that sets protocol for request,
    and sets the url to request
    makes request and emits result to parent
-->
<template>
    <div class="modal" tabindex="-1" id="remoteLoadModal" role="dialog" v-if="showModal">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title">Load from Remote Server</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
            <label for="protocol">Protocol</label>
            <select name="protocol" id="protocol" v-model="protocol">
                <option value="http">http</option>
                <option value="https">https</option>
            </select>
            <label for="url">URL</label>
            <input type="text" name="url" id="url" v-model="url">
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="loadFromRemote">Load</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        showModal: {
            required: true,
            type: Boolean
        }
    },
    data(){
        return {
            protocol: 'http',
            url: ''
        }
    },
    methods: {
        loadFromRemote(){
            // this.$emit('loadFromRemote', this.protocol, this.url);
        }
    },
    watch:{
        showModal: function(val){
            console.log(val)
            if(val){
                document.getElementById('remoteLoadModal').show();
            }else{
                document.getElementById('remoteLoadModal').modal('fade');
            }
        }
    
    }
}
</script>

<style scoped>
</style>