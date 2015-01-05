'use strict';

function updateLastEvent(lastEvent, clipboardData) {
  var lastText = null;
  var lastHtml = null;
  var lastImage = null;

  console.log(clipboardData.types);

  for (var i in clipboardData.items) {
    var item = clipboardData.items[i];
    console.log(item.type);
    // The spec includes a list of mandatory supported data types:
    // http://dev.w3.org/2006/webapi/clipops/clipops.html#mandatory-data-types-1
    // This demo just handles the following:
    if (item.type === 'text/plain') {
      lastText = clipboardData.getData(item.type);
    } else if (item.type === 'text/html') {
      lastHtml = clipboardData.getData(item.type);
    } else if (item.type === 'image/png') {
      lastImage = item.getAsFile();
    }
  }

  document.getElementById('last-event').textContent = lastEvent;
  document.getElementById('last-text').textContent = lastText;
  document.getElementById('last-html').textContent = lastHtml;
  document.getElementById('last-image').src = URL.createObjectURL(lastImage);
}

function handlePaste(event) {
  if (!event.clipboardData)
    return;

  updateLastEvent('paste', event.clipboardData);
}

function handleCopy(event) {
  if (!event.clipboardData)
    return;

  console.log(event.target);
  event.clipboardData.setData('text/plain', 'Copied: ' + document.getElementById('text-field').value);
  event.clipboardData.items.add(dataURItoBlob(canvas.toDataURL()));
  event.preventDefault();

  console.log(event.clipboardData);
  updateLastEvent('copy', event.clipboardData);
}

// This is effectively <canvas>.toFile().
function dataURItoBlob(dataURI) {
    // Convert base64/URLEncoded data component to raw binary data held in a string.
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new File([ia], "hello", {type:mimeString});
}

function copy(event) {
  document.execCommand('copy');
}

function paste(event) {
  document.execCommand('paste');
}

function handleMouseDown(event) {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  context.fillRect(event.offsetX, event.offsetY, 5, 5);
}

window.onload = function () {
  document.addEventListener('paste', handlePaste);
  document.addEventListener('copy', handleCopy);

  document.getElementById('canvas').addEventListener('mousedown', handleMouseDown);
  document.getElementById('copy').addEventListener('click', copy);
  document.getElementById('paste').addEventListener('click', paste);
}
