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
    <txt-reader
      title="Kérem töltse fel a forrás (Kerités.txt) állományt!"
      @load="txtSorai = $event"
    />
    <div v-if="mutat" id="megoldás">
      <p>
        2. feladat:
        <br>
        Az eladott Telkek Száma {{ telkek.length }}.
      </p>

      <p>
        3. feladat:
        <br>
        A {{ utolsoTelek.oldal }} oldalon van az utolsó ház.
        <br>
        És ennek az épületnek a házszáma {{ utolsoTelek.hazSzama }}.
      </p>

      <p>
        4. feladat:
        <br>
        Ha a szomszédossal egyezik a kerítés színe: {{ ugyanOlyanSzinuKerites }}
      </p>

      <p>
        5. feladat:
        <br>Adjon meg egy Házszámot!
        <input v-model="hazszamInputStr" type="number" min="1" max="117">
        <br>
        A kerítés Szine/Állapota: {{ keritesSzineAllapota }}
        <br>
        Egy lehetséges Festési szín: {{ lehetsegesFestesiSzin }}
      </p>
    </div>
    <p v-if="mutat">
      <br>
      <txt-writer title="Utcakep.txt állomány mentése" :content="utcaKep" filename="utcakep.txt"/>
    </p>

    <!-- Megoldás DIV -->
    <!-- Nem a feladat része : -->

    <p v-if="mutat">
      <b>utcakep.txt fájl:</b>
    </p>

    <pre>{{ utcaKep }}</pre>

    <p v-if="mutat">
      <b>kerites.txt fájl:</b>
    </p>
    <pre>{{ txtSorai }}</pre>
    <!-- <span v-for="(t, index) in txtSorai.split('\n')" :key="index">
      {{ t.trim() }}
    </span>-->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Telek from "./telek";
import TxtReader from "./components/TxtReader.vue";
import TxtWriter from "./components/TxtWriter.vue";

// eslint-disable-next-line
@Component({ components: { TxtReader, TxtWriter } })
export default class App extends Vue {
  private telkek: Telek[] = [];
  private txtSorai: string = ""; // Watch végett nem lehet ékezetes azonosító! (pl.: forrás)!
  private mutat: boolean = false;
  // 5. feladat
  private hazszamInputStr: string = "83";
  // 6. feladat
  private utcaKep: string = "";

  @Watch("txtSorai", { immediate: true, deep: true })
  private haForrásVáltozik(val: string, oldVal: string) {
    if (val !== "") this.feldolgoz();
  }

  private feldolgoz(): void {
    try {
      Telek.hazszamReset();
      this.txtSorai.split("\n").forEach(i => {
        const aktSor: string = i.trim();
        if (aktSor.length > 0) this.telkek.push(new Telek(aktSor));
      });
      // 6. feladat: utcakép generálása
      let sor1: string = "";
      let sor2: string = "";
      for (const i of this.telkek.filter(x => x.paratlanOldali)) {
        sor1 += "".padEnd(i.telekSzelessege, i.keritesSzine);
        sor2 += i.hazSzama.toString().padEnd(i.telekSzelessege, " ");
      }
      this.utcaKep = `${sor1}\n${sor2}\n`;
      this.mutat = true;
    } catch (error) {
      this.mutat = false;
      this.telkek = [];
      this.txtSorai = "";
      window.alert("Hibás forrás!");
    }
  }

  private get utolsoTelek(): Telek {
    return this.telkek[this.telkek.length - 1];
  }

  private get ugyanOlyanSzinuKerites(): number {
    let elozoTelek: Telek; // induláskor Undefined értékű
    // elozoKerites! ez az jelenti hogy igaz ha értéke nem null vagy undefined
    for (const aktTelek of this.telkek.filter(x => x.paratlanOldali)) {
      if (
        elozoTelek! &&
        aktTelek.keritesSzine !== "#" &&
        aktTelek.keritesSzine !== ":" &&
        aktTelek.keritesSzine === elozoTelek!.keritesSzine
      ) {
        return elozoTelek!.hazSzama;
      } else elozoTelek = aktTelek; // ha még undefined az utolsó telek!
    }
    return -1; // ez csak egy technikai return! idáig nem jut el a feladat ugy sem
  }

  private get keritesSzineAllapota(): string {
    const hazszamInput: number = parseInt(this.hazszamInputStr, 10);
    const keresettTelek: Telek[] = this.telkek.filter(
      x => x.hazSzama === hazszamInput
    );

    if (keresettTelek.length !== 0) {
      return keresettTelek[0].keritesSzine;
    } else {
      return "Nincs ilyen házszám";
    }
  }

  private get lehetsegesFestesiSzin(): string {
    const hazszamInput: number = parseInt(this.hazszamInputStr, 10);
    const keresettTelek: Telek[] = this.telkek.filter(
      x => x.hazSzama === hazszamInput
    );
    const balszomszedTelek: Telek[] = this.telkek.filter(
      x => x.hazSzama === hazszamInput + 2
    );
    const jobbszomszedTelek: Telek[] = this.telkek.filter(
      x => x.hazSzama === hazszamInput - 2
    );

    let lehetsegesSzinek: string[] = ["A", "B", "C", "D"];
    if (keresettTelek.length !== 0) {
      // van telek aminek a kerítését festeni kell
      lehetsegesSzinek = lehetsegesSzinek.filter(
        x => x !== keresettTelek[0].keritesSzine
      );
    } else return "Nincs ilyen Házszám";

    // ha van balszomszéd
    if (balszomszedTelek.length !== 0) {
      // van telek aminek a kerítését festeni kell
      lehetsegesSzinek = lehetsegesSzinek.filter(
        x => x !== balszomszedTelek[0].keritesSzine
      );
    }

    if (jobbszomszedTelek.length !== 0) {
      // van telek aminek a kerítését festeni kell
      lehetsegesSzinek = lehetsegesSzinek.filter(
        x => x !== jobbszomszedTelek[0].keritesSzine
      );
    }

    return lehetsegesSzinek[0];
  }
}
</script>

<style>
#app {
  font-family: Courier;
}
#megoldás {
  background-color: lightgrey;
  border: 2px dotted black;
  border-radius: 10px;
  padding:12px;
  max-width: 490px;
  content: inherit;
}
a {
  text-decoration: none;
  padding-left: 10px;
}


</style>
