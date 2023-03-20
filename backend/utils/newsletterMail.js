const generateNewsletter = (body) => {
  return `
    
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body data-new-gr-c-s-loaded="14.1087.0"
    style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
    <div class="es-wrapper-color" style="background-color:#FFFFFF;width:100%;height:100px;display:flex;justify-contents:center;align-items-center;flex-direction:column">
        ${body}
    </div>
</body>

</html>`;
};

export default generateNewsletter;
