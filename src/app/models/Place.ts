/**
 * Created by evan on 28/5/17.
 */
export class Place {
  type: string;
  coordinates: number[];

  constructor(name: string, coords: number[]) {
    this.type = name;
    this.coordinates = coords;
  }



}
