// Wait for Cordova to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
//
function onDeviceReady() {
    //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    window.webkitRequestFileSystem(PERSISTENT, 0, gotFS, fail);
}

function gotFS(fileSystem) {
    fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
    fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer) {
    writer.onwriteend = function(evt) {
        console.log("contents of file now 'some sample text'");
        writer.truncate(11);
        writer.onwriteend = function(evt) {
            console.log("contents of file now 'some sample'");
            writer.seek(4);
            writer.write(" different text");
            writer.onwriteend = function(evt){
                console.log("contents of file now 'some different text'");
            }
        };
    };
    //writer.write("some sample text");
    //alert("writer");
}

function fail(error) {
    alert("fail");
    console.log(error.code);
}