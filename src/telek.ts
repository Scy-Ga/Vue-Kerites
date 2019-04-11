// Megjegyzések stílusa: JSDoc 3 -> http://usejsdoc.org/

/** Egy hiányzó tanulót leíró osztály */
export default class Telek {

  private static aktParosHazszam: number = 2;
  private static aktParatlanHazszam: number = 1;
  private hazszam: number;
  private szelesseg: number;
  private szin: string;


  /** Az osztály konstruktora
   * @constructor
   * @param {string} sor A file egy sora
   */

  public constructor(sor: string) {
    const m: string[] = sor.split(" ");
    if (m.length !== 3) throw new Error("Hibás Forrás");

    if (m[0] === "0") {
      this.hazszam = Telek.aktParosHazszam;
      Telek.aktParosHazszam += 2;

    } else {
      this.hazszam = Telek.aktParatlanHazszam;
      Telek.aktParatlanHazszam += 2;
    }

    this.szelesseg = parseInt(m[1], 10);

    if (Number.isNaN(this.szelesseg)) throw new Error("Hibás File!");

    this.szin = m[2];

    if (this.szin.length !== 1) throw new Error("Hibás File");

  }


}
