import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import { useState } from "react";
import { positions, Provider, transitions } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { useAlert } from "react-alert";

const RegisterUploadPage = () => {
  const alert = useAlert();
  function regist() {
    // get user entered values
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const confirm_password = document.getElementById("confirm-password").value
    // check values' vadality
    if (username === '' || password === '' || confirm_password === '') {
      alert.info(<p style={{ textTransform: 'initial' }}>Plz fill-in <text style={{color:"yellow"}}>all</text> fields.</p>)
      return null
    }
    if (password !== confirm_password) {
      alert.info(<p style={{ textTransform: 'initial' }}>Password and Confirm Password <text style={{color:"red"}}>not</text> the same.</p>)
      return null
    }

    var myHeaders = new Headers();
    
    var raw = "";
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
      mode:'cors'
    };
    fetch("http://35.238.183.90:8000/register?username="+username+"&password="+password+"&confirmpw="+confirm_password, requestOptions)
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(result => {
        console.log(result)
        // register success/fail
        if (result.success) {
          alert.success(
          <div style={{color:'#90ee90'}}>
            <p>Success!</p>
            <small>Go to next step.</small>
          </div>)
        } else {
          alert.error(
            <div>
              <p style={{color:'red'}}>{result.message}</p>
            </div>
            )
        }
      })
      .catch(error => {
        alert.error(
          <div>
            <p style={{color:'red'}}>{error.message}</p>
          </div>
        )
      });
  }

  const [files, setFiles] = useState([]);
  const [imageSrc, setImageSrc] = useState(undefined);
  const updateFiles = (incommingFiles) => {
    console.log("incomming files", incommingFiles);
    setFiles(incommingFiles);
  };
  const onDelete = (id) => {
    setFiles(files.filter((x) => x.id !== id));
  };
  const handleSee = (imageSource) => {
    setImageSrc(imageSource);
  };

  return (
  <div style={{margin:0, padding:0}}>
    <div style={{width:"100%", height:"fit-content", background: `linear-gradient(#36d1dc, #5b86e5)`, overflowY:"scroll"}} id="register-load-container">
      <div style={{width:"100%"}} id="register-container">
        {/* register */}
        <div style={{marginTop:"10%", backgroundColor:"white",width:"12%", marginLeft:"44%",height:"fit-content",border: '5px solid white', borderRadius:5, transform: `scale(1.2)`}}>
          <div id="user-form" style={{border: '5px solid white'}}>
            <text>Register</text>
            <hr/>
            <label style={{marginTop:"1%", display:"inline-block"}}>Username</label>
            <br></br>
            <input type="text" id="username" style={{border: '1px solid grey', borderRadius:5, width:"100%"}}></input>
            <br></br>
            <label style={{marginTop:"1%", display:"inline-block"}}>Password</label>
            <br></br>
            <input type="password" id="password" style={{border: '1px solid grey', borderRadius:5, width:"100%"}}></input>
            <br></br>
            <label style={{marginTop:"1%", display:"inline-block"}}>Confirm Password</label>
            <br></br>
            <input type="password" id="confirm-password" style={{border: '1px solid grey', borderRadius:5, width:"100%"}}></input>
            <br></br>
            <input type="submit" id="regist" onClick={regist} style={{width:"100%", border: '1px solid grey', borderRadius:5, backgroundColor:"#007bff", color:"white", marginTop:"1%", display:"inline-block"}}></input>
          </div>
        </div>
      </div>
      <div style={{width:"100%"}} id="load-container">
        {/* uploader */}
        <Dropzone
          style={{ minWidth: "550px", width: "50%", marginLeft:"25%", marginTop:"10%"}}
          //view={"list"}
          onChange={updateFiles}
          value={files}
          maxFiles={30}
          //header={false}
          // footer={false}
          // maxFileSize={2998000}
          //label="Drag'n drop files here or click to browse"
          //label="Suleta tus archivos aquí"
          accept=".png,image/*"
          // uploadingMessage={"Uploading..."}
          url="http://localhost:2000/api/upload-file"
          // url to storage location
          //uploadOnDrop
          //clickable={false}
          // fakeUploading
          //localization={"FR-fr"}
        >
          {files.map((file) => (
            <FileItem
              {...file}
              key={file.id}
              onDelete={onDelete}
              onSee={handleSee}
              //localization={"FR-fr"}
              //localization={"ES-es"}
              preview
              info
              hd
            />
          ))}
          <FullScreenPreview
            imgSource={imageSrc}
            openImage={imageSrc}
            onClose={(e) => handleSee(undefined)}
          />
        </Dropzone>
      </div>
      <br></br>
      <div style={{width:"100%", marginTop:"10%", marginBottom:"5%", textAlign:"center", display:"inline-block"}}>End of page.</div>
    </div>
  </div>
  );
}

const app = () => (
  <Provider template={AlertTemplate}>
    <Provider
      template={AlertTemplate}
      position={positions.TOP_CENTER}
      transition={transitions.FADE}
      timeout={3000}
    >
      <RegisterUploadPage />
    </Provider>
  </Provider>
)

export default app;