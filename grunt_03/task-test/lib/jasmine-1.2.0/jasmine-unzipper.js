function FakeBurrowsZipArchievePlugin() {
    jasmine.Archive.unzip = this;
}

(function (objectPrototype) {

    function unzip(callbackFunctionSuccess, callbackFunctionError, sourceFileName, destinationFileName, overwrite) {

        var args = {};
        this.resultCallbackSuccess = callbackFunctionSuccess;
        this.resultCallbackError = callbackFunctionError;

        if (sourceFileName) {
            args.sourceFileName = sourceFileName;
        }

        if (destinationFileName) {
            args.destinationFileName = destinationFileName;
        }

        if (overwrite) {
            args.overwrite = overwrite;
        }

        if (jasmine.File.fileSystem) {
            addNewDirectory(sourceFileName, destinationFileName);
        }

        this.didFinishWithResultSuccess();
    }

    function addNewDirectory(fileName, destinationFolder) {

        var dirEntry = new FakeDirectoryEntry(),
            folderName = fileName.split('.')[0];

        dirEntry.name = folderName;
        dirEntry.fullPath = jasmine.File.fileSystem.root.fullPath + destinationFolder + '/' + folderName;

        jasmine.File.fileSystem.root.addDirectory(dirEntry);
    }

    function didFinishWithResultSuccess(result) {
        this.resultCallbackSuccess(result);
    }

    function didFinishWithResultError(result) {
        this.resultCallbackError(result);
    }

    objectPrototype.unzip = unzip;
    objectPrototype.didFinishWithResultSuccess = didFinishWithResultSuccess;
    objectPrototype.didFinishWithResultError = didFinishWithResultError;

}(FakeBurrowsZipArchievePlugin.prototype));

jasmine.Archive = {

    isInstalled: function () {
        return jasmine.Archive.installed;
    },

    assertInstalled: function () {
        if (!jasmine.Archive.isInstalled()) {
            throw new Error("Mock archive is not installed, use jasmine.Archive.useMock()");
        }
    },

    useMock: function () {
        if (!jasmine.Archive.isInstalled()) {
            var spec = jasmine.getEnv().currentSpec;
            spec.after(jasmine.Archive.uninstallMock);

            jasmine.Archive.installMock();
        }
    },

    installMock: function () {
        jasmine.Archive.installArchive();
        jasmine.Archive.installed = true;
    },

    installArchive: function () {
        if (!window.plugins) {
            window.plugins = {};
        }
        window.plugins.burrowsZipArchieve = new FakeBurrowsZipArchievePlugin();
    },

    uninstallMock: function () {
        jasmine.Archive.reset();
    },

    reset: function () {

    },

    installed: false
};