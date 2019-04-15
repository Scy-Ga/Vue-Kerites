// Megjegyzések stílusa: JSDoc 3 -> http://usejsdoc.org/

/** Egy Telket leíró osztály */
export default class Telek {

  public static aktParosHazszam: number = 2;
  public static aktParatlanHazszam: number = 1;

  public static hazszamReset(): void {
    Telek.aktParatlanHazszam = 1;
    Telek.aktParosHazszam = 2;
  }

  public ezparos: boolean = false;
  private hazszam: number;
  private szelesseg: number;
  private szin: string;





  /** Az osztály konstruktora
   * @constructor
   * @param {string} sor A file egy sora
   * @param {boolean} ezparos Megmonja hogy páros e az oldal vagy páratlan
   */

  public constructor(sor: string) {
    const m: string[] = sor.split(" ");
    if (m.length !== 3) throw new Error("Hibás Forrás");

    if (m[0] === "0") this.ezparos = true;

    if (m[0] === "0") {
      this.hazszam = Telek.aktParosHazszam;
      Telek.aktParosHazszam += 2;

    } else {
      this.hazszam = Telek.aktParatlanHazszam;
      Telek.aktParatlanHazszam += 2;
    }

    this.szelesseg = parseInt(m[1], 10);

    if (Number.isNaN(this.szelesseg)) throw new Error("Hibás Forrás");

    this.szin = m[2];

    if (this.szin.length !== 1) throw new Error("Hibás Forrás");





  }



  // 3. feladat

  public get oldal(): string {
    return this.hazszam % 2 === 0 ? "páros" : "páratlan";
  }

  public get hazSzama(): number {
    return this.hazszam;
  }

  // 4. feladat

  public get paratlanOldali(): boolean {
    return this.hazszam % 2 === 1;
  }

  public get keritesSzine(): string {
    return this.szin;
  }

  // 6. feladat

  public get telekSzelessege(): number {
    return this.szelesseg;
  }

}
