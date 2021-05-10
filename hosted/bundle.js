"use strict";

var FileForm = function FileForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "uploadForm",
      action: "/upload",
      method: "post",
      encType: "multipart/form-data",
      className: "uploadForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "userName"
    }, "Upload As: "), /*#__PURE__*/React.createElement("input", {
      id: "userName",
      type: "text",
      name: "userName",
      placeholder: "User Name"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "fileInfo"
    }, "File Description: "), /*#__PURE__*/React.createElement("input", {
      id: "fileInfo",
      type: "text",
      name: "fileInfo",
      placeholder: "File Description"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "sampleFile"
    }, "Upload File: "), /*#__PURE__*/React.createElement("input", {
      type: "file",
      name: "sampleFile"
    }), /*#__PURE__*/React.createElement("input", {
      id: "csrfFile",
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Upload!",
      className: "formSubmit"
    }))
  );
};

var DownloadForm = function DownloadForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "retrieveForm",
      action: "/retrieve",
      method: "get",
      className: "retrieveForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "fileName"
    }, "Retrieve File By Name: "), /*#__PURE__*/React.createElement("input", {
      id: "fileName",
      name: "fileName",
      type: "text"
    }), /*#__PURE__*/React.createElement("input", {
      id: "csrfFile",
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Download!",
      className: "formSubmitRetrieve"
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
    }, /*#__PURE__*/React.createElement("h2", null, "Uploader: ", props.uploaderName), /*#__PURE__*/React.createElement("h2", null, "File Name: ", props.fileName), /*#__PURE__*/React.createElement("h3", null, props.info))
  );
};

var FileList = function FileList(props) {
  if (props.files.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "fileList"
      }, /*#__PURE__*/React.createElement("h1", null, "MY FILES: (Click on each for more info) (Only files uploaded with this username will show here)"), /*#__PURE__*/React.createElement("h3", {
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

  console.log(props.files);

  var downloadFile = function downloadFile(fileName) {
    sendAjax('GET', '/retrieve', "fileName=" + fileName, function (data) {
      console.log(doc.data);
    });
  };

  var fileNodes = props.files.map(function (file) {
    return (/*#__PURE__*/React.createElement("div", {
        key: file._id,
        className: "file",
        onClick: function onClick() {
          return displayInfo(file.fileInformation, file.uploaderName, file.name);
        }
      }, /*#__PURE__*/React.createElement("h3", {
        className: "fileName"
      }, "Name: ", file.name, " "), /*#__PURE__*/React.createElement("h3", {
        className: "fileSize"
      }, "Size: ", file.size, " bits "), /*#__PURE__*/React.createElement("h3", {
        className: "fileUploader"
      }, "Uploader: ", file.uploaderName, " "), /*#__PURE__*/React.createElement("h3", {
        className: "fileType"
      }, "Type: ", file.mimetype, " "), /*#__PURE__*/React.createElement("button", {
        className: "downloadButton",
        onClick: function onClick() {
          return downloadFile(file.name);
        }
      }, "Download"), /*#__PURE__*/React.createElement("h4", null, "Could not get the download button to work, use retrieve file"), ">")
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "fileList"
    }, /*#__PURE__*/React.createElement("h1", null, "MY FILES: (Click on each for more info) (Only files uploaded with this username will show here)"), fileNodes)
  );
};

var loadFilesFromServer = function loadFilesFromServer() {
  sendAjax('GET', '/getOwnerFiles', null, function (data) {
    console.log(data);
    ReactDOM.render( /*#__PURE__*/React.createElement(FileList, {
      files: data.files
    }), document.querySelector("#files"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(FileForm, {
    csrf: csrf
  }), document.querySelector("#uploadFile"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DownloadForm, {
    csrf: csrf
  }), document.querySelector("#downloadFile"));
  ReactDOM.render( /*#__PURE__*/React.createElement(FileList, {
    files: []
  }), document.querySelector("#files"));
  loadFilesFromServer();
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
  $("#robotMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#robotMessage").animate({
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
