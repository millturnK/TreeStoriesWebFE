//import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
declare var EXIF: any;
declare var dms2dec: any;

export class CoordsFromPhoto {
  coordsAttr: Number[] = [];
  coordsSubject = new Subject();

  constructor() { }


  getCoordsFromPhoto(photo:File)
  {
    let coords:Number[]=[];
    EXIF.getData( photo, () =>{

      let allMetaData = EXIF.getAllTags(photo);
      let GPSTags = null;
      GPSTags = EXIF.getPosition;
      if (GPSTags != null)
      {
        let lat = EXIF.getTag(photo,EXIF.GPSTags.GPSLatitude);
        let GPSVersionID = EXIF.getTag(photo,EXIF.GPSTags.GPSVersionID);
        // console.log('GPS lat:', allMetaData.GPSLatitude);
        let latArray = allMetaData.GPSLatitude;
        let latRef = allMetaData.GPSLatitudeRef;
        let lngArray = allMetaData.GPSLongitude;
        let lngRef = allMetaData.GPSLongitudeRef;

        // allMetaData

        // console.log('GPSlatArr', latArray);
        // console.log('LatRef', latRef);
        // console.log('GPSlongArr', lngArray);
        // console.log('LongRef', lngRef);
        //if()
        //convert deg, min, sec to dec e.g.
        //var dec = dms2dec("60/1, 21/1, 4045/100", "N", "5/1, 22/1, 1555/100", "E");
        // dec[0] == 60.36123611111111, dec[1] == 5.370986111111111
        //make a lat string
        let latDMS = latArray[0].numerator + '/' + latArray[0].denominator
          + ',' + latArray[1].numerator + '/' + latArray[1].denominator
          + ',' + latArray[2].numerator + '/' + latArray[2].denominator;

        let lngDMS = lngArray[0].numerator + '/' +lngArray[0].denominator
          + ',' + lngArray[1].numerator + '/' +lngArray[1].denominator
          + ',' + lngArray[2].numerator + '/' +lngArray[2].denominator;

        // console.log('latDMS', latDMS);
        // console.log('lngDMS', lngDMS);
        //coords = dms2dec(latDMS,latRef,lngDMS,lngRef);
        coords = dms2dec(latDMS,latRef,lngDMS,lngRef);
      }

      //console.log('internal coords', coords);
      this.coordsSubject.next(coords);

    });

  }




}
/**
 * Created by KatieMills on 27/5/17.
 */
