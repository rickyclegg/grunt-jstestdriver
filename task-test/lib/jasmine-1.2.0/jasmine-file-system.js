LocalFileSystem = {
    PERSISTENT: 'PERSISTENT',
    TEMPORARY: 'TEMPORARY'
};

function FakeFile() {}

function FakeFileReader() {
    this.readTime = 0;
}

(function (objectPrototype) {

    function abort() {
        if (this._readTimer) {
            clearTimeout(this._readTimer);

            if (this.onabort) {
                this.onabort();
            }
        }
    }

    function readAsDataURL() {
        //Read file and return data as a base64 encoded data url.
    }

    function readAsText(file) {

        var self = this;

        this._readTimer = setTimeout(function () {

            jasmine.File.fileSystem.root.getFile(file.fullPath, {create: false}, onSuccess, onFail);

            function onSuccess(fileEntry) {
                if (self.onloadend) {

                    self.result = fileEntry.dataAsText;

                    self.onloadend({
                        target: self
                    });
                }
            }

            function onFail(error) {
                if (self.onerror) {
                    self.onerror(error);
                }
            }

        }, this.readTime);
    }

    objectPrototype.abort = abort;
    objectPrototype.readAsDataURL = readAsDataURL;
    objectPrototype.readAsText = readAsText;

}(FakeFileReader.prototype));

function FakeFileTransfer() {
    this.downloads = [];
    this.downloadTime = 0;

    jasmine.File.fileTransfer = this;
}

(function (objectPrototype) {

    function upload() {
        //sends a file to a server.
    }

    function addDownload(fileEntry) {
        this.downloads.push(fileEntry);
    }

    function download(pathToDownload, pathToSave, onSuccess, onFail) {

        var self = this;

        setTimeout(function () {

            var i, l = self.downloads.length,
                fileEntry = new FakeFileEntry();

            for (i = 0; i < l; i += 1) {
                if (pathToSave === self.downloads[i].fullPath) {
                    fileEntry = self.downloads[i];
                    break;
                }
            }

            if (fileEntry) {
                jasmine.File.fileSystem.root.addFile(fileEntry);
                onSuccess(fileEntry);
            }
            else {
                onFail(new Error('Cannot get new FakeFileEntry'));
            }

        }, this.downloadTime);
    }

    function reset() {
        this.downloads = [];
    }

    objectPrototype.upload = upload;
    objectPrototype.addDownload = addDownload;
    objectPrototype.download = download;
    objectPrototype.reset = reset;

}(FakeFileTransfer.prototype));

function FakeFileEntry() {
    this.isFile = true;
    this.isDirectory = false;
    this.name = 'FakeFileEntry';

    this._file = new FakeFile();
    this._file.name = this.name;
    this._file.type = 'application/json';
    this._file.lastModifiedDate = new Date();
    this._file.size = 111111111;
}

(function (objectPrototype) {

    function getMetadata() {
        return this._metadata;
    }

    function setMetadata(value) {
        this._metadata = value;
    }

    function moveTo() {
        //Move a directory to a different location on the file system.
    }

    function copyTo() {
        //Copy a directory to a different location on the file system.
    }

    function toURL() {
        //Return a URL that can be used to locate a directory.
    }

    function remove(success, fail) {
        var i,
            files = jasmine.File.fileSystem.root.files,
            l = files.length,
            hasRemoved = false;

        for (i = 0; i < l; i +=1) {
            if (files[i] && files[i].fullPath === this.fullPath) {
                files.splice(files.indexOf(files[i], 1));
                hasRemoved = true;
            }
        }

        if (hasRemoved) {
            success();
        }
        else {
            fail();
        }
    }

    function getParent() {
        //Look up the parent directory.
    }

    function createWriter() {
        //Creates a FileWriter object that can be used to write to a file.
    }

    function file() {
        this._file.fullPath = this.fullPath;
        return this._file;
    }

    objectPrototype.getMetadata = getMetadata;
    objectPrototype.setMetadata = setMetadata;
    objectPrototype.moveTo = moveTo;
    objectPrototype.copyTo = copyTo;
    objectPrototype.toURL = toURL;
    objectPrototype.remove = remove;
    objectPrototype.getParent = getParent;
    objectPrototype.createWriter = createWriter;
    objectPrototype.file = file;

}(FakeFileEntry.prototype));

function FakeDirectoryEntry() {
    this.isFile = false;
    this.isDirectory = true;
    this.name = '';
    this.files = [];
    this.directories = [];
}

(function (objectPrototype) {

    function getMetadata() {
        return this._metadata;
    }

    function setMetadata(value) {
        this._metadata = value;
    }

    function moveTo() {
        //Move a directory to a different location on the file system.
    }

    function copyTo() {
        //Copy a directory to a different location on the file system.
    }

    function toURL() {
        //Return a URL that can be used to locate a directory.
    }

    function remove(success, fail) {
        success();
    }

    function getParent() {
        //Look up the parent directory.
    }

    function createReader() {
        //Create a new DirectoryReader that can read entries from a directory.
    }

    function addDirectory(directoryEntry) {
        this.directories.push(directoryEntry);
    }

    function getDirectory(path, options, onSuccess, onFail) {
        var i, l = this.directories.length,
            directoryName = getDirectoryFromPath(path),
            directoryEntry;

        for (i = 0; i < l; i += 1) {
            if (directoryName === getDirectoryFromPath(this.directories[i].fullPath)) {
                directoryEntry = this.directories[i];
                break;
            }
        }

        if (directoryEntry) {
            onSuccess(directoryEntry);
        }
        else if (options && options.create) {
            directoryEntry = getNewFakeDirectory(directoryName, this.fullPath + path);
            this.directories.push(directoryEntry);
            onSuccess(directoryEntry);
        }
        else {
            onFail(new Error('Cannot get new FakeFileSystem'));
        }
    }

    function getDirectoryFromPath(path) {
        var directories = path.split('/');

        return directories[directories.length - 1] === '' ? directories[directories.length - 2] :
            directories[directories.length - 1];
    }

    function addFile(fileEntry) {
        this.files.push(fileEntry);
    }

    function getFile(path, options, onSuccess, onFail) {

        var i, l = this.files.length,
            relativePath,
            fileEntry;

        for (i = 0; i < l; i += 1) {

            relativePath = getRelativePath(this.fullPath, this.files[i].fullPath);

            if (relativePath === path) {
                fileEntry = this.files[i];
                break;
            }
        }

        if (fileEntry) {
            onSuccess(fileEntry);
        }
        else if (options && options.create) {
            fileEntry = getNewFakeFile(Math.floor(Math.random() * 1000), this.fullPath + path);
            this.files.push(fileEntry);
            onSuccess(fileEntry);
        }
        else {
            onFail(new Error('Cannot get new FakeFileSystem'));
        }
    }

    function getNewFakeFile(nameExtension, path) {
        var fileEntry = new FakeFileEntry();
        fileEntry.name += nameExtension;
        fileEntry.fullPath = path;

        return fileEntry;
    }

    function getNewFakeDirectory(name, path) {
        var directoryEntry = new FakeDirectoryEntry();
        directoryEntry.name += name;
        directoryEntry.fullPath = path;

        return directoryEntry;
    }

    function getRelativePath(rootPath, fullPath) {
        return rootPath && fullPath && fullPath.split(rootPath).join('') || "";
    }

    function removeRecursively(onSuccess, onFail) {
        var directories = jasmine.File.fileSystem.root.directories,
            dirIndex = directories.indexOf(this);

        if (dirIndex > -1) {
            directories.splice(directories.indexOf(this), 1);
            onSuccess();
        }
        else {
            onFail();
        }
    }

    function reset() {
        this.files = [];
        this.directories = [];
    }

    objectPrototype.getMetadata = getMetadata;
    objectPrototype.setMetadata = setMetadata;
    objectPrototype.moveTo = moveTo;
    objectPrototype.copyTo = copyTo;
    objectPrototype.toURL = toURL;
    objectPrototype.remove = remove;
    objectPrototype.getParent = getParent;
    objectPrototype.createReader = createReader;
    objectPrototype.addDirectory = addDirectory;
    objectPrototype.getDirectory = getDirectory;
    objectPrototype.addFile = addFile;
    objectPrototype.getFile = getFile;
    objectPrototype.removeRecursively = removeRecursively;
    objectPrototype.reset = reset;

}(FakeDirectoryEntry.prototype));

function FakeFileSystem() {
    this.name = 'FakeFileSystem-' + Math.floor(Math.random() * 1000);

    this.root = new FakeDirectoryEntry();
    this.root.name += 'Documents';
    this.root.fullPath = 'file://localhost/Applications/5952DF827F05/Documents/';
}

function fakeRequestFileSystem(fileSystemType, num, onSuccess, onFail) {

    window.fileSystemType = fileSystemType;

    if (jasmine.File.fileSystem) {
        onSuccess(jasmine.File.fileSystem);
    }
    else if (onFail) {
        onFail(new Error('Cannot get new FakeFileSystem'));
    }
}

jasmine.File = {

    isInstalled: function () {
        return jasmine.File.installed;
    },

    assertInstalled: function () {
        if (!jasmine.File.isInstalled()) {
            throw new Error("Mock FileSystem is not installed, use jasmine.File.useMock()");
        }
    },

    useMock: function () {
        if (!jasmine.File.isInstalled()) {
            var spec = jasmine.getEnv().currentSpec;
            spec.after(jasmine.File.uninstallMock);

            jasmine.File.installMock();
        }
    },

    installMock: function () {
        jasmine.File.installFile();
        jasmine.File.installed = true;
    },

    installFile: function () {
        jasmine.File.fileMock();
    },

    uninstallMock: function () {
        jasmine.File.assertInstalled();
        window.requestFileSystem = jasmine.File.realRequestFileSystem;
        window.FileReader = jasmine.File.realFileReader;
        window.FileTransfer = jasmine.File.realFileTransfer;

        jasmine.File.reset();
    },

    reset: function () {
        if (jasmine.File.fileTransfer) {
            jasmine.File.fileTransfer.reset();
        }

        jasmine.File.fileSystem.root.reset();
        jasmine.File.installed = false;
        jasmine.File.realFakeRequestFileSystem = null;
        jasmine.File.realFileReader = null;
        jasmine.File.realFileTransfer = null;
        jasmine.File.fileSystem = null;
    },

    fileMock: function () {
        jasmine.File.realRequestFileSystem = window.requestFileSystem;
        jasmine.File.fileSystem = new FakeFileSystem();
        jasmine.File.realFileReader = window.FileReader;
        jasmine.File.realFileTransfer = window.FileTransfer;

        window.requestFileSystem = fakeRequestFileSystem;
        window.FileReader = window.FakeFileReader;
        window.FileTransfer = FakeFileTransfer;
        window.requestFileSystem = fakeRequestFileSystem;
    },

    installed: false
};