<template>
  <div id="app">
    <p>
      Linkek:
      <a href="kerites.txt" download>kerites.txt</a>
      <a href="Kerites_fel.pdf" target="_blank">Feladat</a>
      <a href="Kerites_jav.pdf" target="_blank">Javítási</a>
      <a href="https://github.com/nitslaszlo/ErettsegiHianyzasokTsVueJs" target="_blank">Forrás</a>
      <a href="https://github.com/nitslaszlo/JedlikVueJsStarter" target="_blank">SDK</a>
    </p>
    <txt-reader title="Kérem töltse fel a forrás (Kerités.txt) állományt!" @load="txtSorai = $event"/>
    <div v-show="mutat" id="megoldás">
      
      <p> 2. feladat: <br> Az eladott Telkek Száma {{ telkek.length }}. </p>

      <p> 3. feladat: <br> A {{telkek[telkek.length - 1].ezparos ? "páros" : "páratlan"}} oldalon van az utolsó ház. <br>
       És ennek az épületnek a házszáma {{telkek[telkek.length - 1].hazszam}}. </p>

       
     </div>
    <!-- Megoldás DIV -->
    <!-- Nem a feladat része : -->
    <!-- <p v-show="mutat">
      <b>kerites.txt fájl:</b>
    </p>
    <span v-for="(t, index) in txtSorai.split('\n')" :key="index">
      {{ t.trim() }}
      <br>
    </span> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Telek from "./telek";
import TxtReader from "./components/TxtReader.vue";

// eslint-disable-next-line
@Component({ components: { TxtReader } })
export default class App extends Vue {
  private telkek: Telek[] = [];
  private txtSorai: string = ""; // Watch végett nem lehet ékezetes azonosító! (pl.: forrás)!
  private mutat: boolean = false;

  @Watch("txtSorai", { immediate: true, deep: true })
  private haForrásVáltozik(val: string, oldVal: string) {
    if (val !== "") this.feldolgoz();
  }

  private feldolgoz(): void {
    try {
      this.txtSorai.split("\n").forEach(i => {
        const aktSor: string = i.trim();
        if (aktSor.length > 0) this.telkek.push(new Telek(aktSor));
      });
      this.mutat = true;
    } catch (error) {
      this.mutat = false;
      this.telkek = [];
      this.txtSorai = "";
      window.alert("Hibás forrás!");
    }
  }




}
</script>

<style>
#app {
  font-family: Courier;
}
#megoldás {
  background-color: lightgrey;
}
a {
  text-decoration: none;
  padding-left: 10px;
}
</style>
