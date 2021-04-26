"use strict";

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoHeight").val() == '' || $("#domoFile").val() == '') {
    handleError("All fields are required!");
    return false;
  }

  var inputForm = {};
  inputForm["name"] = $("#domoName").val();
  inputForm["age"] = $("#domoAge").val();
  inputForm["height"] = $("#domoHeight").val();
  inputForm["_csrf"] = $("#csrfDomo").val();
  inputForm["file"] = $("#domoFile").files;
  console.log($("#domoForm").serialize());
  console.log($("#csrfDomo").val());
  console.log(inputForm["file"]); //var inputString = 

  sendAjax('POST', $("#domoForm").attr("action"), inputForm, function () {
    loadDomosFromServer();
  });
  return false;
};

var handleDomoSearch = function handleDomoSearch(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoNameSearch").val() == '') {
    handleError("All fields are required!");
    return false;
  }

  loadDomosByName();
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

var DomoSearchForm = function DomoSearchForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "domoSearchForm",
      onSubmit: handleDomoSearch,
      name: "domoSearchForm",
      action: "/makerSearch",
      method: "GET",
      className: "domoSearchForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "userName"
    }, "Username to search: "), /*#__PURE__*/React.createElement("input", {
      id: "userName",
      type: "text",
      name: "userName",
      placeholder: "User Name"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "searchDomoSubmit",
      type: "submit",
      value: "Search Domo"
    }))
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
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos
    }), document.querySelector("#domos"));
  });
};

var loadDomosByName = function loadDomosByName() {
  sendAjax('POST', '/getDomosByName', $("#domoSearchForm").serialize(), function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos
    }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoSearchForm, {
    csrf: csrf
  }), document.querySelector("#searchDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
    domos: []
  }), document.querySelector("#domos"));
  loadDomosFromServer();
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
