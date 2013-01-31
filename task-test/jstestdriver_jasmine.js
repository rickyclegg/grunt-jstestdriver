describe("JsTestDriver Jasmine numbers test", function () {
    "use strict";
    it("Test adding numbers", function () {
        var total = 10 + 10 + 10;

        expect(total).toBe(30);
    });

    it("Test multiplying numbers", function () {
        var total = 10 * 10 * 10;

        expect(total).toBe(1000);
    });

});