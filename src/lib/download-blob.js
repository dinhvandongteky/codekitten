import ConfigServer from "../config_server";

export default (filename, blob) => {
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);

    // Use special ms version if available to get it working on Edge.
    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
        return;
    }

    if ('download' in HTMLAnchorElement.prototype) {
        const url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.type = blob.type;
        downloadLink.click();


        const formData = new FormData();
        console.log("DownloadFile::::XXX:");
    
        var reader = new window.FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            const base64data = reader.result;
            formData.append("file", new File([blob], filename));
            console.log('form data', formData);
            // console.log('form base64data', base64data);
            const  link_download = ConfigServer.host +'/api/upload';
            fetch(link_download, {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((result) => {
                    console.log("Success:", result);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
            // remove the link after a timeout to prevent a crash on iOS 13 Safari
            window.setTimeout(() => {
                document.body.removeChild(downloadLink);
                window.URL.revokeObjectURL(url);
            }, 1000); };
        } else {
            // iOS 12 Safari, open a new page and set href to data-uri
            let popup = window.open('', '_blank');
            const reader = new FileReader();
            reader.onloadend = function () {
                popup.location.href = reader.result;
                popup = null;
            };
            reader.readAsDataURL(blob);
        }

    };
