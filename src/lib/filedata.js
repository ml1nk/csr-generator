module.exports = function(div,onchange) {

  if(typeof onchange !== "function") {
    onchange = function(){};
  }

  var reader = false;
  var data = "";
  var callback = "";

  div.onchange = updateData;
  updateData();

  function updateData(e) {
    data = "";
    if (reader !== false) {
      reader.abort();
      if(typeof callback == "function") {
        callback(false);
      }
      reader = false;
    }
    if (div.files.length === 0) {
      setTimeout(function(){
        onchange({
          hasFile: hasFile,
          getData: getData
        });
      },0);
      return;
    }
    var file = div.files[0];
    // Datei muss kleiner als 2MB sein
    if (file.size < 1048576 * 2) {
      reader = new FileReader();
      reader.onload = function(e) {
        if (typeof reader.readAsBinaryString != "undefined") {
          data = reader.result; // Firefox, Chrome etc.
        } else {
          data = arrBufferCallback(e); // IE10+
        }
        if(typeof callback == "function") {
          callback(true,data);
        }
        reader = false;
      };
      if (typeof reader.readAsBinaryString != "undefined") {
        reader.readAsBinaryString(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    }
    setTimeout(function(){
      onchange({
        hasFile: hasFile,
        getData: getData
      });
    },0);
  }

  function arrBufferCallback(e) {
        var binary = "";
        var bytes = new Uint8Array(e.target.result);
        var length = bytes.byteLength;
        for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return binary;
  }

  function getData(myCallback) {
    if(data!=="") {
      (function(data) {
        setTimeout(function(){
          myCallback(true,data);
        });
      }(data));
    } else if(reader !== false) {
      callback = myCallback;
    } else {
      myCallback(false);
    }
  }

  function hasFile() {
     return (data!=="" || reader !== false);
  }

  return {
    hasFile: hasFile,
    getData: getData
  };

};
