"use strict";

var SuccessMessage = function SuccessMessage(props) {
  return (/*#__PURE__*/React.createElement("div", {
      className: "success"
    }, /*#__PURE__*/React.createElement("h1", null, "PASSWORD CHANGED SUCCESSFULLY"))
  );
};

var handlePassword = function handlePassword(e) {
  e.preventDefault();
  $("#robotMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required!");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match!");
    return false;
  }

  sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), function (message) {
    console.log(message);
  });
  ReactDOM.render( /*#__PURE__*/React.createElement(SuccessMessage, null), document.querySelector("#content"));
  return false;
};

var PasswordWindow = function PasswordWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "passwordForm",
      name: "passwordForm",
      onSubmit: handlePassword,
      action: "/password",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "password"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass2"
    }, "Confirm Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass2",
      type: "password",
      name: "pass2",
      placeholder: "retype password"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Change Password"
    }))
  );
};

var createPasswordWindow = function createPasswordWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PasswordWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  createPasswordWindow(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  console.log("HELLO PASSWORD");
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
