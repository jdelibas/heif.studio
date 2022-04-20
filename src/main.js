const convert = require('heic-convert');
(async () => {
  const $file = document.querySelector('#file');
  const $image = document.querySelector('#image');
  const $result = document.querySelector('#result');

  $file.addEventListener('change', async () => {
    $result.innerHTML = '';
    $file.removeAttribute('disabled');
    const file = $file?.files[0];
    if (!file) {
      $result.innerHTML = 'No file selected';
      return;
    }

    try {
      const filename = file.name.toLowerCase();
      const extension = filename.split('.').pop();
      const allowed = ['heic', 'heif'];
      if(!extension || !allowed.includes(extension)) {
        $result.innerHTML = `Filetype not supported: ${extension}`;
        return;
      }
    } catch(err) {
      $result.innerHTML = `Filetype not supported`;
      return;
    }

    convertImage(file)
  });

  function convertImage(file) {
    const reader = new FileReader();
    $result.innerHTML = 'Loading File...';
    $file.setAttribute('disabled', 'disabled');
    reader.onload = async (event) => {
      try {
        $result.innerHTML = 'Converting...';
        const outputBuffer = await convert({
          buffer: arrayBufferToBuffer(event.target.result),
          format: 'JPEG',
          quality: 1
        });
        $result.innerHTML = '';
        $image.src = `data:image/jpeg;base64,${outputBuffer.toString('base64')}`;
        $file.removeAttribute('disabled');
      } catch(err) {
        $file.removeAttribute('disabled');
        $result.innerHTML = `Failed to convert: ${err.message}`;
        console.log(err)
      }
    }
    reader.readAsArrayBuffer(file);
  }

  function arrayBufferToBuffer(arrayBuffer) {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    return buffer.map((_, i) => view[i]);
  }
})();
