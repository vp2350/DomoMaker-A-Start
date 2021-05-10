"use strict";

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
    handleError("All fields are required!");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });
  return false;
};

var DomoForm = function DomoForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "domoForm",
      onSubmit: handleDomo,
      name: "domoForm",
      encType: "multipart/form-data",
      action: "/maker",
      method: "POST",
      className: "domoForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Name: "), /*#__PURE__*/React.createElement("input", {
      id: "domoName",
      type: "text",
      name: "name",
      placeholder: "Domo Name"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "age"
    }, "Age: "), /*#__PURE__*/React.createElement("input", {
      id: "domoAge",
      type: "text",
      name: "age",
      placeholder: "Domo Age"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "height"
    }, "Height: "), /*#__PURE__*/React.createElement("input", {
      id: "domoHeight",
      type: "text",
      name: "height",
      placeholder: "Domo Height"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "file"
    }, "File: "), /*#__PURE__*/React.createElement("input", {
      id: "domoFile",
      type: "file",
      name: "file",
      placeholder: "Domo File"
    }), /*#__PURE__*/React.createElement("input", {
      id: "csrfDomo",
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeDomoSubmit",
      type: "submit",
      value: "Make Domo"
    }))
  );
};

var FileForm = function FileForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "uploadForm",
      action: "/upload",
      method: "post",
      encType: "multipart/form-data"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "userName"
    }, "Uploader Name: "), /*#__PURE__*/React.createElement("input", {
      id: "userName",
      type: "text",
      name: "userName",
      placeholder: "Domo Name"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "fileInfo"
    }, "File Description: "), /*#__PURE__*/React.createElement("input", {
      id: "fileInfo",
      type: "text",
      name: "fileInfo",
      placeholder: "Domo Name"
    }), /*#__PURE__*/React.createElement("input", {
      type: "file",
      name: "sampleFile"
    }), /*#__PURE__*/React.createElement("input", {
      id: "csrfDomo",
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Upload!"
    }))
  );
};

var DownloadForm = function DownloadForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "retrieveForm",
      action: "/retrieve",
      method: "get"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "fileName"
    }, "Retrieve File By Name: "), /*#__PURE__*/React.createElement("input", {
      name: "fileName",
      type: "text"
    }), /*#__PURE__*/React.createElement("input", {
      id: "csrfDomo",
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Download!"
    }))
  );
};

var FileInfo = function FileInfo(props) {
  if (props.info.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "fileInfo"
      }, /*#__PURE__*/React.createElement("h3", null, "No Information on this File"))
    );
  }

  return (/*#__PURE__*/React.createElement("div", {
      className: "fileInfo"
    }, /*#__PURE__*/React.createElement("h2", null, props.uploaderName), /*#__PURE__*/React.createElement("h2", null, props.fileName), /*#__PURE__*/React.createElement("h3", null, props.info))
  );
};

var FileList = function FileList(props) {
  if (props.files.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "fileList"
      }, /*#__PURE__*/React.createElement("h1", null, "MY FILES"), /*#__PURE__*/React.createElement("h3", {
        className: "emptyFile"
      }, "No Files yet"))
    );
  }

  var displayInfo = function displayInfo(info, uploaderName, fileName) {
    ReactDOM.render( /*#__PURE__*/React.createElement(FileInfo, {
      info: info,
      uploaderName: uploaderName,
      fileName: fileName
    }), document.querySelector("#fileDescription"));
  };

  var downloadFile = function downloadFile(fileName) {
    sendAjax('GET', '/retrieve', "fileName=" + fileName, function (data) {
      console.log(doc.data);
    });
  };

  var fileNodes = props.files.map(function (file) {
    return (/*#__PURE__*/React.createElement("div", {
        key: file._id,
        className: "domo",
        onClick: function onClick() {
          return displayInfo(file.fileInformation, file.uploaderName, file.name);
        }
      }, /*#__PURE__*/React.createElement("h3", {
        className: "fileName"
      }, "Name: ", file.name, " "), /*#__PURE__*/React.createElement("h3", {
        className: "fileSize"
      }, "Size: ", file.size, " "), /*#__PURE__*/React.createElement("h3", {
        className: "fileUploader"
      }, "Uploader: ", file.uploaderName, " "), /*#__PURE__*/React.createElement("h3", {
        className: "fileType"
      }, "Type: ", file.mimetype, " "), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          return downloadFile(file.name);
        }
      }, "Download"))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "fileList"
    }, /*#__PURE__*/React.createElement("h1", null, "MY FILES"), fileNodes)
  );
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "domoList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyDomo"
      }, "No Domos yet"))
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    return (/*#__PURE__*/React.createElement("div", {
        key: domo._id,
        className: "domo"
      }, /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/domoface.jpeg",
        alt: "domo face",
        className: "domoFace"
      }), /*#__PURE__*/React.createElement("h3", {
        className: "domoName"
      }, "Name: ", domo.name, " "), /*#__PURE__*/React.createElement("h3", {
        className: "domoAge"
      }, "Age: ", domo.age, " "), /*#__PURE__*/React.createElement("h3", {
        className: "domoHeight"
      }, "Height: ", domo.height, " "), /*#__PURE__*/React.createElement("h3", {
        className: "domoHeight"
      }, "File: ", domo.file, " "))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, domoNodes)
  );
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {//ReactDOM.render(
    //    <DomoList domos={data.domos} />, document.querySelector("#domos")
    //);
  });
};

var loadFilesFromServer = function loadFilesFromServer() {
  sendAjax('GET', '/getOwnerFiles', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(FileList, {
      files: data.files
    }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(FileForm, {
    csrf: csrf
  }), document.querySelector("#uploadFile"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DownloadForm, {
    csrf: csrf
  }), document.querySelector("#downloadFile"));
  ReactDOM.render( /*#__PURE__*/React.createElement(FileList, {
    files: []
  }), document.querySelector("#domos"));
  loadFilesFromServer();
  loadDomosFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  console.log("HELLO MAKER");
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
