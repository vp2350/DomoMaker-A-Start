const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width: 'hide'}, 350);
    
    if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoHeight").val() == '') {
        handleError("All fields are required!");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
    
    return false;
};

const handleDomoSearch = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width: 'hide'}, 350);
    
    if($("#domoNameSearch").val() == '') {
        handleError("All fields are required!");
        return false;
    }
    
    loadDomosByName();

    
    return false;
};


const DomoForm = (props) => {
    return (
    <form id="domoForm"
        onSubmit={handleDomo}
        name="domoForm"
        action="/maker"
        method="POST"
        className="domoForm"
    >
        <label htmlFor="name">Name: </label>
        <input id="domoName" type="text" name="name" placeholder="Domo Name" />
        <label htmlFor="age">Age: </label>
        <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
        <label htmlFor="height">Height: </label>
        <input id="domoHeight" type="text" name="height" placeholder="Domo Height" />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeDomoSubmit" type="submit" value="Make Domo" />
    </form>
    );
};

const DomoSearchForm = (props) => {
    return (
    <form id="domoSearchForm"
        onSubmit={handleDomoSearch}
        name="domoSearchForm"
        action="/makerSearch"
        method="GET"
        className="domoSearchForm"
    >
        <label htmlFor="userName">Username to search: </label>
        <input id="userName" type="text" name="userName" placeholder="User Name" />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="searchDomoSubmit" type="submit" value="Search Domo" />
    </form>
    );
};


const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                    <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }
    
    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name} </h3>
                <h3 className="domoAge">Age: {domo.age} </h3>  
                <h3 className="domoHeight">Height: {domo.height} </h3>                
            </div>
        );
    });
    
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};


const loadDomosByName = () => {
    sendAjax('POST', '/getDomosByName', $("#domoSearchForm").serialize(), (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};


const setup = function(csrf) {
    ReactDOM.render(
            <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );
    ReactDOM.render(
            <DomoSearchForm csrf={csrf} />, document.querySelector("#searchDomo")
    );
    ReactDOM.render(
            <DomoList domos={[]} />, document.querySelector("#domos")
    );
    
    loadDomosFromServer();
    
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});