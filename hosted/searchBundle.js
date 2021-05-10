"use strict";

var handleFileSearch = function handleFileSearch(e) {
  e.preventDefault();
  $("#robotMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#searchName").val() == '') {
    handleError("All fields are required!");
    return false;
  }

  sendAjax('GET', $("#searchForm").attr("action"), $("#searchForm").serialize(), function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(FileList, {
      files: data.files
    }), document.querySelector("#files"));
  });
  return false;
};

var handleFileSearchByName = function handleFileSearchByName(e) {
  e.preventDefault();
  $("#robotMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#fileSearchName").val() == '') {
    handleError("All fields are required!");
    return false;
  }

  sendAjax('GET', $("#fileSearchForm").attr("action"), $("#fileSearchForm").serialize(), function (data) {
    console.log(data);
    ReactDOM.render( /*#__PURE__*/React.createElement(FileList, {
      files: data.files
    }), document.querySelector("#files"));
  });
  return false;
};

var SearchForm = function SearchForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "searchForm",
      onSubmit: handleFileSearch,
      name: "searchForm",
      encType: "multipart/form-data",
      action: "/getFilesByUsername",
      method: "GET",
      className: "searchForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "searchName"
    }, "User Name To Search For: "), /*#__PURE__*/React.createElement("input", {
      id: "searchName",
      type: "text",
      name: "searchName",
      placeholder: "User Name"
    }), /*#__PURE__*/React.createElement("input", {
      id: "csrfFile",
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "searchSubmit",
      type: "submit",
      value: "Search Files"
    }))
  );
};

var FileNameSearchForm = function FileNameSearchForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "fileSearchForm",
      onSubmit: handleFileSearchByName,
      name: "fileSearchForm",
      encType: "multipart/form-data",
      action: "/getFilesByFilename",
      method: "GET",
      className: "fileSearchForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "fileSearchName"
    }, "File Name To Search For: "), /*#__PURE__*/React.createElement("input", {
      id: "fileSearchName",
      type: "text",
      name: "fileSearchName",
      placeholder: "File Name"
    }), /*#__PURE__*/React.createElement("input", {
      id: "csrfFile",
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "fileSearchSubmit",
      type: "submit",
      value: "Search Files"
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
      id: "retrieveFile",
      name: "fileName",
      type: "text"
    }), /*#__PURE__*/React.createElement("input", {
      id: "csrfFile",
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "retrieveSubmit",
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
    }, /*#__PURE__*/React.createElement("h2", null, "Uploader: ", props.uploaderName), /*#__PURE__*/React.createElement("h2", null, "File Name: ", props.fileName), /*#__PURE__*/React.createElement("h3", null, props.info))
  );
};

var FileList = function FileList(props) {
  if (props.files.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "fileList"
      }, /*#__PURE__*/React.createElement("h1", null, "FILES RECEIVED: (Click on each for more info)"), /*#__PURE__*/React.createElement("h3", {
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
      }, "Type: ", file.mimetype, " "))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "fileList"
    }, /*#__PURE__*/React.createElement("h1", null, "FILES RECEIVED: (Click on each for more info)"), fileNodes)
  );
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(FileList, {
    files: []
  }), document.querySelector("#files"));
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, {
    csrf: csrf
  }), document.querySelector("#searchFile"));
  ReactDOM.render( /*#__PURE__*/React.createElement(FileNameSearchForm, {
    csrf: csrf
  }), document.querySelector("#searchFileByName"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DownloadForm, {
    csrf: csrf
  }), document.querySelector("#downloadFile"));
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
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
