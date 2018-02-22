$(document).ready(function () {
    var x = window.screen.width;
    let options = {
        x: 1,
        y: 40,
        width: window.screen.width-1,
        height: window.screen.height-120,
        camera: CameraPreview.CAMERA_DIRECTION.BACK,
        toBack: true,
        tapPhoto: true,
        previewDrag: false
  
    };

    CameraPreview.startCamera(options);

    $("#swith-camera").on("click", function () {
        CameraPreview.switchCamera();
    });

    $("#btn-flash").on("click", function () {
        CameraPreview.getFlashMode(function (currentFlashMode) {
            if (currentFlashMode == CameraPreview.FLASH_MODE.ON)
                CameraPreview.setFlashMode(CameraPreview.FLASH_MODE.OFF);
            else
                CameraPreview.setFlashMode(CameraPreview.FLASH_MODE.ON);
        });
    });

    $("#btn-close").on("click", function () {
        $('img#my-img').attr('src', '');
        $('img#my-img').attr('style', 'display:none;');
        CameraPreview.stopCamera();
        var id = mobile.passedData;
        LoadView("cause_campaign", null, id, "down");
    });

    $("#btn-take-picture").on("click", function () {


 CameraPreview.takePicture({ width: window.screen.width, height: window.screen.height, quality: 85 }, function (base64PictureData) {
           imageSrcData = 'data:image/jpeg;base64,' + base64PictureData;
  //         imageSrcData =  base64PictureData;

		   CameraPreview.stopCamera();
            var data = { campaignid: mobile.passedData, base64PictureData: imageSrcData };
            LoadView("picture_edit_reframe", null, data, "left");
//b64toBlob(imageSrcData,
  
//    function(blob) {
        
//        var url = window.URL.createObjectURL(blob);

//      console.log(url);
//      var xhr = new XMLHttpRequest();
//    xhr.open( "GET", url, true );
//    xhr.responseType = "arraybuffer";
//    xhr.onload = function( ev ) {
//        // Obtain a blob: URL for the image data.
//        var arrayBufferView = new Uint8Array( this.response );
//        var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
      
//    };
   
//    xhr.send();

 
//   uploadToS3(blob, function (err, data) {
//        if (data) {
//            console.log('yay!');
//        }
//        else{
//            console.log('not successful');
//        }
//    });

//        // do something with url
//    }, function(error) {
//        // handle error
//    });
    });
});

function b64toBlob(b64, onsuccess, onerror) {
   
    var img = new Image();

    img.onerror = onerror;

    img.onload = function onload() {
    
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(onsuccess);
    };
    CameraPreview.stopCamera();
    SpinnerPlugin.activityStop();
    img.src = b64;
    var data = { campaignid: mobile.passedData, base64PictureData: b64 };
    LoadView("picture_edit_reframe", null, data, "left");
}

    function uploadToS3(blob, callback) {
    var data = { action: "awscreds" };
    callApi(data, "GET", function success(d) {
        AWS.config = new AWS.Config();
        AWS.config.accessKeyId = d.accessKeyId;
        AWS.config.secretAccessKey = d.secretAccessKey;
        AWS.config.region = 'us-east-2';
        let s3 = new AWS.S3();
        var d = new Date();
        var t = d.getTime();
        let options = { Bucket: 'selfiecausebucket', Key: 'myFile' + t + '.jpg', Body: blob };// <--
        s3.upload(options, callback);
    }, function error(d){
        showNotification("Network error, please check your internet connection");
    });
}

function getImageAsBlob(url, blobCallback) {
    
    var xhr = new XMLHttpRequest();
    xhr.open( "GET", url, true );
    xhr.responseType = "arraybuffer";
    xhr.onload = function( ev ) {
        // Obtain a blob: URL for the image data.
        var arrayBufferView = new Uint8Array( this.response );
        var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
        blobCallback(blob);
    };
    xhr.send();
}


function takePicture(urlCallback)
{
    let options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,// <--
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.JPG
    };
    
    navigator.camera.getPicture(urlCallback, onFail, options);  
    
    function onFail(message) {
        alert('Failed because: ' + message);
    }
}
});


function ConfigAWS()
{
    var albumBucketName = 'selfiecausebucket';
    var bucketRegion = 'us-east-2';
    var IdentityPoolId = 'us-east-2:1ec8f487-3527-47a6-aa25-09d23fc9d91a';
    AWS.config.update({
        region: bucketRegion,
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: IdentityPoolId
        })
    });
}
