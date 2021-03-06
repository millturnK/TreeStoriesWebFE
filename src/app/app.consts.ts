/**
 * Created by evan on 10/12/2016.
 */

export class AppConsts {

  public static ERR_401_MSG = `You don't have authorisation to perform the requested action. Most likely this is because your 
        session has expired. Please Login again`;
  public static ERR_520_MSG = 'Sorry, you can\'t create this requirement as it already exists in our system.';
  public static ERR_DUPLICATE_DB_CODE = 520;
  public static ERR_500_MSG = 'Oops, something has gone wrong on the server. Please take a screenshot and email it to IT support (office@millturn.com.au).';

    // Consts used in the common front end components
    public APP_COMPANY = 'Millturn IT';
    public APP_COMPANY_WEBSITE = 'https://www.millturn.com.au';
    public APP_TOOL = 'Tree Stories';
    public APP_WIKI = 'https://millturn.com.au/wp/wiki/tree-stories/';

}
