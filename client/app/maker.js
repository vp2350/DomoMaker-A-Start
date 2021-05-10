const FileForm = (props) =>{
    return(
    <form 
        id='uploadForm'
        action='/upload'
        method='post'
        encType="multipart/form-data"
    >
        <label htmlFor="userName">Uploade As(uses current username if empty): </label>
        <input id="userName" type="text" name="userName" placeholder="User Name" />
        <label htmlFor="fileInfo">File Description: </label>
        <input id="fileInfo" type="text" name="fileInfo" placeholder="File Description" />
        <input type="file" name="sampleFile" />
        <input id="csrfFile" type="hidden" name="_csrf" value={props.csrf} />
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
        <input id="csrfFile" type="hidden" name="_csrf" value={props.csrf} />
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
                   <h1>MY FILES: (Click on each for more info)</h1>
                   <h3 className="emptyFile">No Files yet</h3>
            </div>
        );
    }
    
    const displayInfo = (info, uploaderName, fileName) => {
        ReactDOM.render(
            <FileInfo info={info} uploaderName = {uploaderName} fileName = {fileName}/>, document.querySelector("#fileDescription")
        );
    };
    
    console.log(props.files);
    const downloadFile = (fileName) => {
        sendAjax('GET', '/retrieve', "fileName="+fileName, (data) => {
            console.log(doc.data);
        });
    };
    const fileNodes = props.files.map(function(file) {
        return (
            <div key={file._id} className="file" onClick = {() => displayInfo(file.fileInformation, file.uploaderName, file.name)}>
                <h3 className="fileName">Name: {file.name} </h3>
                <h3 className="fileSize">Size: {file.size} bits </h3>  
                <h3 className="fileUploader">Uploader: {file.uploaderName} </h3>
                <h3 className="fileType">Type: {file.mimetype} </h3> 
                <button onClick = {() => downloadFile(file.name)}>Download</button>
                <h4>Could not get the download button to work, use retrieve file</h4>>
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

const loadFilesFromServer = () => {
    sendAjax('GET', '/getOwnerFiles', null, (data) => {
        console.log(data);
        ReactDOM.render(
            <FileList files={data.files} />, document.querySelector("#files")
        );
    });
};


const setup = function(csrf) {
    ReactDOM.render(
            <FileForm csrf={csrf} />, document.querySelector("#uploadFile")
    );
    ReactDOM.render(
            <DownloadForm csrf={csrf} />, document.querySelector("#downloadFile")
    );
    ReactDOM.render(
            <FileList files={[]} />, document.querySelector("#files")
    );
    
    loadFilesFromServer();
    
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