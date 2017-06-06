import {Subject} from "rxjs/Subject";
declare var EXIF: any;
declare var dms2dec: any;
import {loggerFactory} from '../config/ConfigLog4j';

export class CoordsFromPhoto {
  coordsAttr: Number[] = [];
  coordsSubject = new Subject();
  private log;

  constructor() {
   this.log = loggerFactory.getLogger('component.CoordsFromPhoto');
  }


  getCoordsFromPhoto(photo:File)
  {
    let coords:Number[]=[];
    EXIF.getData( photo, () =>{

      let allMetaData = EXIF.getAllTags(photo);
      let GPSTags = null;
      GPSTags = EXIF.getPosition;
      let latArr = allMetaData.GPSLatitude;
      // for some reason the EXIF functions are not working with some photos
      if (GPSTags != null || latArr != null)
      {
        let lat = EXIF.getTag(photo,EXIF.GPSTags.GPSLatitude);
        let GPSVersionID = EXIF.getTag(photo,EXIF.GPSTags.GPSVersionID);
        // console.log('GPS lat:', allMetaData.GPSLatitude);
        let latArray = allMetaData.GPSLatitude;
        let latRef = allMetaData.GPSLatitudeRef;
        let lngArray = allMetaData.GPSLongitude;
        let lngRef = allMetaData.GPSLongitudeRef;

        let latDMS = latArray[0].numerator + '/' + latArray[0].denominator
          + ',' + latArray[1].numerator + '/' + latArray[1].denominator
          + ',' + latArray[2].numerator + '/' + latArray[2].denominator;

        let lngDMS = lngArray[0].numerator + '/' +lngArray[0].denominator
          + ',' + lngArray[1].numerator + '/' +lngArray[1].denominator
          + ',' + lngArray[2].numerator + '/' +lngArray[2].denominator;

        coords = dms2dec(latDMS,latRef,lngDMS,lngRef);
      }
      else {
        this.log.debug('Photo has no coords');
      }

      this.coordsSubject.next(coords);

    });

  }




}
/**
 * Created by KatieMills on 27/5/17.
 */
