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
  if (lastEvent === 'paste') {
    document.getElementById('last-text').textContent = lastText;
    document.getElementById('last-html').textContent = lastHtml;
    document.getElementById('last-image').src = URL.createObjectURL(lastImage);
  }
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
  if (event.target == document.getElementById('text-field')) {
    copyText(event);
    return;
  } else if (event.target.tagName === 'BODY') {
    console.log('hit body');
  }

  console.log(event.clipboardData);
  updateLastEvent('copy', event.clipboardData);
}

function copyText(event) {
  event.clipboardData.setData('text/plain', 'Copied: ' + document.getElementById('text-field').value);
  event.preventDefault();
  updateLastEvent('copy', event.clipboardData);
}

function copy(event) {
  document.execCommand('copy');
}

function handleMouseDown(event) {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  context.fillRect(event.offsetX, event.offsetY, 2, 2);
}

window.onload = function () {
  document.addEventListener('paste', handlePaste);
  document.addEventListener('copy', handleCopy);

  document.getElementById('canvas').addEventListener('mousedown', handleMouseDown);
  document.getElementById('copy').addEventListener('click', copy);
}