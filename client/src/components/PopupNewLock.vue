<template>
  <span class="lock" v-if = "newLock">
    <p class = 'long-button validate' @click="onAssign">New Lock at <b>{{newLock.ip}}</b>.</p>
    <p class = 'short-button gray' @click="onDelete">X</p>
    <Modal v-if="modalVisible">
      <ul class = 'doorlist'>
        <li class='doorname' 
          v-for="(door, i) in doors" 
          :key = "i"
          @click="onSelect(door)">
          {{ door.name }}
        </li>

      </ul> 
      <div class="footer">
      <button @click="onCancel">cancel</button>
    </div>
    </Modal>
  </span>
</template>

<script>
import axios from "axios";
import { getUrl } from "../js/utils";
import Modal from "./Modal";


export default {
  name: "PopupNewLock",
  data(){
    return {newLocks: [], modalVisible: false, doors: []};
  },
  computed: {
    newLock: function(){
      return this.newLocks[0];
    }
  },
  methods: {
    fetch(){
      axios
      .get(getUrl('lock'))
      .then(({ data }) => {
        this.newLocks = data.filter(({doorId}) => !doorId);
        this.locks = data;
      });

      axios
      .get(getUrl('door'))
      .then(({ data }) => {
        this.doors = data.filter(({id}) => !this.locks.find(({doorId}) => doorId === id));
      });
    },
    onAssign(){
      this.modalVisible = true;
    },
    onSelect(door){
      axios.post(getUrl('lock'), {
        ...this.newLock,
        doorId: door.id
      }).then(() => {
        this.fetch();
      })
      this.modalVisible = false;
    },
    onDelete(){
      console.log('todo')
    }
  },
  mounted(){
    setInterval(() => {
      this.fetch();
    },1000);
  },
  components:{
    Modal
  }
};
</script>
<style>
.long-button{
  flex: 0 0 95%; 
}
.short-button{
  flex: 0 0 5%; 
}
.newlock{
  display: flex;
  width: 100%;
}
.newlock > p{  
  padding: 0.5em 0;
  border-radius: 5px;
  cursor: pointer;
}
.doorname{
  width: 100%;
  padding: 0.2em 0;
  margin: 0;
  cursor: pointer;
}
.doorlist{
  display: block;
  width: calc(100% - 10px);
  list-style: none;
  margin: 0;
  padding: 0
}
.doorname:nth-of-type(odd) {
  background: #ccc;
}
.doorname:hover {
  background: #ddd;
}
</style>
