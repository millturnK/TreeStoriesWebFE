import {User} from "./user";
/**
 * Created by evan on 19/02/2017.
 */
// Straight Jasmine - no imports from Angular test libraries
describe("User without the TestBed", () => {
    let user: User;
    beforeEach(() => { user = new User(); });
    it("logged in should return real value", () => {
        expect(user.loggedin).toBe(false);
        user.loggedin = true;
        expect(user.loggedin).toBe(true);
        user.clear();
        expect(user.loggedin).toBe(false);

    });
});
