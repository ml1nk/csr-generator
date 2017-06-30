function download(filename, type, text) {
  let element = document.createElement('a');
  element.setAttribute(
    'href',
      'data:'+type+';'
    + 'name='+ encodeURIComponent(filename)+','
    + encodeURIComponent(text));

  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

module.exports = download;
