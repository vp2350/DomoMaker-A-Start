const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width: 'hide'}, 350);
    
    if($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("All fields are required!");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
    
    return false;
};

const DomoForm = (props) => {
    return (
    <form id="domoForm"
        onSubmit={handleDomo}
        name="domoForm"
        encType="multipart/form-data"
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
        <label htmlFor="file">File: </label>
        <input id="domoFile" type="file" name="file" placeholder="Domo File" />
        <input id="csrfDomo" type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeDomoSubmit" type="submit" value="Make Domo" />
    </form>
    );
};

const FileForm = (props) =>{
    return(
    <form 
        id='uploadForm'
        action='/upload'
        method='post'
        encType="multipart/form-data"
    >
        <label htmlFor="userName">Uploader Name: </label>
        <input id="userName" type="text" name="userName" placeholder="Domo Name" />
        <label htmlFor="fileInfo">File Description: </label>
        <input id="fileInfo" type="text" name="fileInfo" placeholder="Domo Name" />
        <input type="file" name="sampleFile" />
        <input id="csrfDomo" type="hidden" name="_csrf" value={props.csrf} />
        <input type="submit" value='Upload!' />    
    </form>
        );
};

const DownloadForm = (props) => {
    return (<form 
        id='retrieveForm'
        action='/retrieve'
        method='get'>
        <label htmlFor='fileName'>Retrieve File By Name: </label>
        <input name='fileName' type='text' />
        <input id="csrfDomo" type="hidden" name="_csrf" value={props.csrf} />
        <input type='submit' value='Download!' />        
    </form>);
};

const FileInfo = function(props){
    if(props.info.length === 0){
        return (
            <div className = "fileInfo">
                <h3>No Information on this File</h3>
            </div>
        );
    }
    
    return (
        <div className = "fileInfo">
            <h2>{props.uploaderName}</h2>
            <h2>{props.fileName}</h2>
            <h3>{props.info}</h3>
        </div>
    );
};

const FileList = function(props) {
    if(props.files.length === 0) {
        return (
            <div className="fileList">
                   <h1>MY FILES</h1>
                   <h3 className="emptyFile">No Files yet</h3>
            </div>
        );
    }
    
    const displayInfo = (info, uploaderName, fileName) => {
        ReactDOM.render(
            <FileInfo info={info} uploaderName = {uploaderName} fileName = {fileName}/>, document.querySelector("#fileDescription")
        );
    };
    
    const downloadFile = (fileName) => {
        sendAjax('GET', '/retrieve', "fileName="+fileName, (data) => {
            console.log(doc.data);
        });
    };
    const fileNodes = props.files.map(function(file) {
        return (
            <div key={file._id} className="domo" onClick = {() => displayInfo(file.fileInformation, file.uploaderName, file.name)}>
                <h3 className="fileName">Name: {file.name} </h3>
                <h3 className="fileSize">Size: {file.size} </h3>  
                <h3 className="fileUploader">Uploader: {file.uploaderName} </h3>
                <h3 className="fileType">Type: {file.mimetype} </h3> 
                <button onClick = {() => downloadFile(file.name)}>Download</button>
            </div>
        );
    });
    
    return (
        <div className="fileList">
           <h1>MY FILES</h1>
            {fileNodes}
        </div>
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
                <h3 className="domoHeight">File: {domo.file} </h3> 
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
        //ReactDOM.render(
        //    <DomoList domos={data.domos} />, document.querySelector("#domos")
        //);
    });
};

const loadFilesFromServer = () => {
    sendAjax('GET', '/getOwnerFiles', null, (data) => {
        ReactDOM.render(
            <FileList files={data.files} />, document.querySelector("#domos")
        );
    });
};


const setup = function(csrf) {
    ReactDOM.render(
            <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );
    ReactDOM.render(
            <FileForm csrf={csrf} />, document.querySelector("#uploadFile")
    );
    ReactDOM.render(
            <DownloadForm csrf={csrf} />, document.querySelector("#downloadFile")
    );
    ReactDOM.render(
            <FileList files={[]} />, document.querySelector("#domos")
    );
    
    loadFilesFromServer();
    loadDomosFromServer();
    
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    console.log("HELLO MAKER");
    getToken();
});