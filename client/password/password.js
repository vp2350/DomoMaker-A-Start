const SuccessMessage = (props) => {
    return (
        <div className="success"><h1>PASSWORD CHANGED SUCCESSFULLY</h1></div>
    );
};

const handlePassword = (e) => {
    e.preventDefault();
    
    $("#robotMessage").animate({width: 'hide'}, 350);
    
    if($("#pass").val() == '' || $("#pass2").val() == ''){
        handleError("All fields are required!");
        return false;
    }
    
    if($("#pass").val() !== $("#pass2").val()){
        handleError("Passwords do not match!");
        return false;
    }
    
    sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), (message) =>{
        console.log(message);
    });
    
    ReactDOM.render(
        <SuccessMessage />, document.querySelector("#content")
    );
    
    return false;
};

const PasswordWindow = (props) => {
    return (
    <form id="passwordForm" name="passwordForm"
          onSubmit={handlePassword}
          action="/password"
          method="POST"
          className ="mainForm"
    >
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password" />   
        <label htmlFor="pass2">Confirm Password: </label>
        <input id="pass2" type="password" name="pass2" placeholder="retype password" /> 
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="formSubmit" type="submit" value="Change Password" />     
    </form>
    );
};

const createPasswordWindow = (csrf) => {
    ReactDOM.render(
    <PasswordWindow csrf={csrf} />, document.querySelector("#content")
    );
};

const setup = (csrf) => { 
    createPasswordWindow(csrf);  
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken); 
    });
};

$(document).ready(function() {
    console.log("HELLO PASSWORD");
    getToken();
});