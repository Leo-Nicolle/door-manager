<template>
  <div class="doors">
    <ElementsDisplay
      :elements="elements"
      :selectedElement="selectedElement"
      :elementsToFilter="elementsToFilter"
      @queryResult="onQueryResult"
      @add="onAddElement"
    >
      <tr slot="headers">
        <th @click="onHeaderClick('name')">Nom</th>
        <th @click="onHeaderClick('ip')">IP</th>

      </tr>
      <tr slot="body" v-for="(door, i) in sortedElements" :key="i" @click="onElementClick(door)">
        <td>{{ door.name }}</td>
        <td>{{ door.ip || 'Pas Assignee' }}</td>
      </tr>
      <Door slot="form" :locks="locks" :element="selectedElement" @cancel="onCancel()" @submit="onSubmit()" />

    </ElementsDisplay>
    <button @click = "onCompileCode">COMPILE CODE</button>
    <div>
    <p :class = "compileStatus.length ? compileStatus === 'success' ? 'validate' : 'delete' : 'hidden'">
      {{compileStatus === 'success' ? 'compile success' : 'compile failed : please check your c++ code'}}</p>
    </div>

  </div>
</template>

<script>
import Door from "./Door";
import { getUrl } from "../js/utils";
import axios from "axios";
import ElementsDisplay from "../mixins/ElementsDisplay";
import ElementsDisplayMixin from "../mixins/ElementsDisplayMixin.js";

export default {
  name: "Doors",
  mixins: [ElementsDisplayMixin],
  data(){
    return {compileStatus: '', locks: []} 
  },
  methods: {
    onAddElement() {
      this.selectedElement = {
        name: "",
      };
    },
    onCompileCode(){
      let successCompile = true;
      this.compileStatus = '';
       axios
        .get(getUrl("code-compile"))
        .then(() => {
          console.log("code compiled")
        }).catch(e => {
          if (!e.response || !e.response.data) return console.error(e);
          console.error(e);
          successCompile &= !e.response.data.e.match('error: ');
        }).then(() => {
          this.compileStatus = successCompile ? 'success' : 'failed';
          return axios.get('http://192.168.1.34:5051/code-update')
        }).then(() => console.log('requested'));
    },
    fetch() {
      this.onCompileCode();
      axios
        .get(getUrl("lock"))
        .then(({ data }) => {
          this.locks = data;
        })
      axios
        .get(getUrl("door"))
        .then(({ data }) => {
          this.elements = data;
        })
        .then(() => {
          //   axios.get(getUrl(`access/${this.elements[1].id}/dsadsadsa`)).then(({ data }) => {
          //     console.log('should succeed',data)
          // });

          // axios
          //   .get(getUrl(`access/${this.elements[1].id}/badges1`))
          //   .then(({ data }) => {
          //     console.log("should succeed", data);
          //   });

          // axios
          //   .get(getUrl(`access/download/badge/${this.elements[1].id}`))
          //   .then(({ data }) => {
          //     console.log(data);
          //   });
          // axios
          //   .get(getUrl(`access/download/schedule/${this.elements[1].id}`))
          //   .then(({ data }) => {
          //     console.log(data);
          //   });

          // axios.get(getUrl(`access/${this.elements[1].id}/badge not exits`)).then(({ data }) => {
          //     console.log('should fail',data)
          // });

          //  axios.get(getUrl(`access/door not exist/hdisfidsfhdsi`)).then(({ data }) => {
          //     console.log('should fail',data)
          // });
        });
    },
    getIp(door){
      const lock = this.locks.find(lock => lock.doorId === door.id);
      return lock ? lock.ip : null;
    },
    getElementsToFilter(elements) {
      return elements.map((door) => {
        const ip = this.getIp(door);
        return {
          ...door,
          ip,
        };
      });
    },
  },
  components: {
    Door,
    ElementsDisplay,
  },
};
</script>
<style>
</style>
