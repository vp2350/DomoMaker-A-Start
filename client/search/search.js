const handleFileSearch = (e) => {
    e.preventDefault();
    
    console.log("1234");
    $("#domoMessage").animate({width: 'hide'}, 350);
    
    if($("#searchName").val() == '') {
        handleError("All fields are required!");
        return false;
    }
    sendAjax('GET', $("#searchForm").attr("action"), $("#searchForm").serialize(), (data) => {
        ReactDOM.render(
            <FileList files={data.files} />, document.querySelector("#domos")
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
        <label htmlFor="searchName">Name: </label>
        <input id="searchName" type="text" name="searchName" placeholder="Domo Name" />
        <input id="csrfDomo" type="hidden" name="_csrf" value={props.csrf} />
        <input className="searchSubmit" type="submit" value="Search Files" />
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
    
    const displayInfo= (info, uploaderName, fileName) => {
        ReactDOM.render(
            <FileInfo info={info} uploaderName = {uploaderName} fileName = {fileName}/>, document.querySelector("#fileDescription")
        );
    };
    const fileNodes = props.files.map(function(file) {
        return (
            <div key={file._id} className="domo" onClick = {() => displayInfo(file.fileInformation, file.uploaderName, file.name)}>
                <h3 className="fileName">Name: {file.name} </h3>
                <h3 className="fileSize">Size: {file.size} </h3>  
                <h3 className="fileUploader">Uploader: {file.uploaderName} </h3>
                <h3 className="fileType">Type: {file.mimetype} </h3> 
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

const setup = function(csrf) {
    ReactDOM.render(
            <FileList files={[]} />, document.querySelector("#domos")
    );
    ReactDOM.render(
            <SearchForm csrf={csrf} />, document.querySelector("#searchFile")
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