/**
 * Created by KatieMills on 3/4/17.
 */
export class Story {
  public _id: string;
  public title: string;
  public content: string;
  public latitude: number;
  public longitude: number;
  public location: Location;
  public contributors: string;
  public sources: string;
  public  botName: string;
  public  photoLinks: string[];
    // TODO: link, coords from photo, bounding box coords, replace lat lng with Location
  constructor(obj?: any) {
    this._id = obj && obj._id || null;
    this.title = obj && obj.title || null;
    this.content = obj && obj.content || null;
    this.latitude = obj && obj.latitude || null;
    this.longitude = obj && obj.longitude || null;
    this.location = obj && obj.location || null;
    this.sources = obj && obj.sources || null;
    this.contributors = obj && obj.contributors || null;
    this.botName = obj && obj.botName || null;
    this.photoLinks = obj && obj.photoLinks || null;

  }
}
