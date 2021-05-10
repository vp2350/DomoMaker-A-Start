const handleFileSearch = (e) => {
    e.preventDefault();
    
    $("#robotMessage").animate({width: 'hide'}, 350);
    
    if($("#searchName").val() == '') {
        handleError("All fields are required!");
        return false;
    }
    sendAjax('GET', $("#searchForm").attr("action"), $("#searchForm").serialize(), (data) => {
        ReactDOM.render(
            <FileList files={data.files} />, document.querySelector("#files")
        );
    });
    
    return false;
};

const handleFileSearchByName = (e) => {
    e.preventDefault();
    
    $("#robotMessage").animate({width: 'hide'}, 350);
    
    if($("#fileSearchName").val() == '') {
        handleError("All fields are required!");
        return false;
    }
    sendAjax('GET', $("#fileSearchForm").attr("action"), $("#fileSearchForm").serialize(), (data) => {
        console.log(data);
        ReactDOM.render(
            <FileList files={data.files} />, document.querySelector("#files")
        );
    });
    
    return false;
};

const SearchForm = (props) => {
    return (
    <form id="searchForm"
        onSubmit={handleFileSearch}
        name="searchForm"
        encType="multipart/form-data"
        action="/getFilesByUsername"
        method="GET"
        className="searchForm"
    >
        <label htmlFor="searchName">User Name To Search For: </label>
        <input id="searchName" type="text" name="searchName" placeholder="User Name" />
        <input id="csrfFile" type="hidden" name="_csrf" value={props.csrf} />
        <input className="searchSubmit" type="submit" value="Search Files" />
    </form>
    );
};

const FileNameSearchForm = (props) => {
    return (
    <form id="fileSearchForm"
        onSubmit={handleFileSearchByName}
        name="fileSearchForm"
        encType="multipart/form-data"
        action="/getFilesByFilename"
        method="GET"
        className="fileSearchForm"
    >
        <label htmlFor="fileSearchName">File Name To Search For: </label>
        <input id="fileSearchName" type="text" name="fileSearchName" placeholder="File Name" />
        <input id="csrfFile" type="hidden" name="_csrf" value={props.csrf} />
        <input className="fileSearchSubmit" type="submit" value="Search Files" />
    </form>
    );
};

const DownloadForm = (props) => {
    return (<form 
        id='retrieveForm'
        action='/retrieve'
        method='get'>
        <label htmlFor='fileName'>Retrieve File By Name: </label>
        <input id='retrieveFile' name='fileName' type='text' />
        <input id="csrfFile" type="hidden" name="_csrf" value={props.csrf} />
        <input className = "retrieveSubmit" type='submit' value='Download!' />        
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
            <h2>Uploader: {props.uploaderName}</h2>
            <h2>File Name: {props.fileName}</h2>
            <h3>{props.info}</h3>
        </div>
    );
};

const FileList = function(props) {
    if(props.files.length === 0) {
        return (
            <div className="fileList">
                   <h1>FILES RECEIVED: (Click on each for more info)</h1>
                   <h3 className="emptyFile">No Files yet</h3>
            </div>
        );
    }
    
    const displayInfo= (info, uploaderName, fileName) => {
        ReactDOM.render(
            <FileInfo info={info} uploaderName = {uploaderName} fileName = {fileName}/>, document.querySelector("#fileDescription")
        );
    };
    const fileNodes = props.files.map(function(file) {
        return (
            <div key={file._id} className="file" onClick = {() => displayInfo(file.fileInformation, file.uploaderName, file.name)}>
                <h3 className="fileName">Name: {file.name} </h3>
                <h3 className="fileSize">Size: {file.size} bits </h3>  
                <h3 className="fileUploader">Uploader: {file.uploaderName} </h3>
                <h3 className="fileType">Type: {file.mimetype} </h3> 
            </div>
        );
    });
    
    return (
        <div className="fileList">
           <h1>FILES RECEIVED: (Click on each for more info)</h1>
            {fileNodes}
        </div>
    );
};

const setup = function(csrf) {
    ReactDOM.render(
            <FileList files={[]} />, document.querySelector("#files")
    );
    ReactDOM.render(
            <SearchForm csrf={csrf} />, document.querySelector("#searchFile")
    );
    ReactDOM.render(
            <FileNameSearchForm csrf={csrf} />, document.querySelector("#searchFileByName")
    );
    ReactDOM.render(
            <DownloadForm csrf={csrf} />, document.querySelector("#downloadFile")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});