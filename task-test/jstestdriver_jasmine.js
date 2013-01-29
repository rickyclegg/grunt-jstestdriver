describe("JsTestDriver Jasmine numbers test", function () {

    it("Test adding numbers", function () {
        var total = 10 + 10 + 10;

        expect(total).toBeDefined(30);
    });

    it("Test multiplying numbers", function () {
        var total = 10 * 10 * 10;

        expect(total).toBeDefined(1000);
    });

});