var defaultDataToRemove = {
    history: true,
    cache: true,
    localStorage: true,
    indexedDB: true,
    appcache: false,
    cookies: true,
    formData: false,
    fileSystems: false,
    pluginData: true,
    passwords: false,
    downloads: true 
};
var last_date;
var display_date;
var dataToRemove = Object.assign({}, defaultDataToRemove);

var helpTextOptions = {
    history: 'History - Deletes browsing history to protect your online usage privacy.',
    cache: 'Cache - Deletes online website images stored on your computer to protect your privacy.',
    localStorage: 'LocalStorage - Deletes all online website data stored on your computer to free up space.',
    indexedDB: 'IndexedDB - Deletes database indexes created by Chrome to free up space.',
    appcache: 'AppCache - Deletes temporary data stored by applications, to free up space.',
    cookies: 'Cookies - Deletes tracking cookies to prevent online usage tracking.',
    formData: 'FormData - Deletes all form data to protect your privacy and prevent auto fill from automatically filling in web forms.',
    fileSystems: 'FileSystems - Deletes file systems folder contents to gains additional free space on your computer.',
    pluginData: 'PluginData - Deletes data created by any browser plug-in you may have. This protects your privacy and frees up space.  The plug in is not deleted.',
    passwords: 'Passwords - Deletes saved passwords. Once deleted, you will have to re-enter them again at any site that requires one.',
    downloads: 'Downloads - Deletes all the links to downloaded files and images, to protect your privacy and free up space. The downloaded file or images is not deleted.'
};

var selectedAll = false;

chrome.storage.local.get('dataToRemove', function(data) {
 // storage.StorageArea.get('dataToRemove', function(data) {
    if (data != undefined && data.dataToRemove) {
        dataToRemove = data.dataToRemove;
    }
  //});
    
});

window.onload = function() {
    // document.getElementById("clean_state").innerHTML = localStorage.getItem("display_date");
    document.getElementById("clean_state").innerText = localStorage.getItem("display_date");
    var start = false;
    var $startButton = document.getElementById('start_scan_btn'),
        $removeOptionsButtons_temp = document.getElementById('items').children,
        $loadings = document.getElementsByClassName('cssload-container');
    var $removeOptionsButtons = ['','','','','','','','','','',''];
    for (var i = 0; i<4; i++)
    {
        $removeOptionsButtons[i] = $removeOptionsButtons_temp[0].children[i];
    }
    for (var i = 4; i<8; i++)
    {
        $removeOptionsButtons[i] = $removeOptionsButtons_temp[1].children[i-4];
    }
    for (var i = 8; i<11; i++)
    {
        $removeOptionsButtons[i] = $removeOptionsButtons_temp[2].children[i-8];
    }
    var image_url = ['img/ic_history_',
                    'img/ic_cache_',
                    'img/ic_localStorage_',
                    'img/ic_indexedDB_',
                    'img/ic_appcache_',
                    'img/ic_cookies_',
                    'img/ic_fileSystems_',
                    'img/ic_pluginData_',
                    'img/ic_downloads_',
                    'img/ic_formData_',
                    'img/ic_passwords_'
                    ];
    $startButton.onclick = function() {
        if (!start) {
            start = true;
            // this.innerHTML = 'cleaning...';
            this.innerText = 'cleaning...';
            this.disabled = true;
            this.className = 'active';
            for (var i = 0; i < $loadings.length; i++) {
              if (!$loadings[i].parentNode.classList.contains('disabled')) $loadings[i].style.display = 'block';
            }
            last_date = new Date();
            display_date = last_date.getMonth() + 1 + "-" + last_date.getDate() + "-" + last_date.getFullYear();
            localStorage.setItem("display_date", display_date);

        } else startButtonReset();
        
        delete dataToRemove.appcache;
        delete dataToRemove.fileSystems;
        
        chrome.browsingData.remove({}, dataToRemove, function() {
            startButtonReset();
            // $startButton.innerHTML = 'ALL CLEAN!';
            $startButton.innerText = 'ALL CLEAN!';
             document.getElementById('clean_state').innerText = 'done';
            //document.getElementById('calean_state').innerHTML = 'completed';
            for (var i = 0; i < $removeOptionsButtons.length; i++) {
              if (!$removeOptionsButtons[i].classList.contains('disabled')) $removeOptionsButtons[i].children[1].src =image_url[i]+'shiny.png';
            }
        });

    };
    function startButtonReset() {
        start = false;
        $startButton.className = '';
        $startButton.disabled = false;
        for (var i = 0; i < $loadings.length; i++) {
          $loadings[i].style.display = 'none';
        }
    }

    document.getElementById('items')
      .addEventListener('click', function(e) {
        for (var target = e.target; target && target != this; target = target.parentNode) {
          if (target.matches('li')) {
            var removeOptionName = target.getAttribute('data-remove');
              if (target.className != 'disabled col-sm-3') {
                target.className = 'disabled col-sm-3';
                dataToRemove[removeOptionName] = false;
                target.children[1].src = 'img/ic_'+removeOptionName+'_empty.png';
                document.getElementById('select-all').checked = false;
              } else {
                if (target.id == "formData") {
                  document.getElementById('mymodal').style.display = 'block';
                  document.getElementById('headline').innerHTML = "FORM DATA - WARNING";
                  document.getElementById('offer').innerHTML = "This will erase your saved Form Data, so the next time you go to a website form, the fields will not be automatically filled in for you. You will have to enter in all of the fields."
                  $('#yes').unbind("click").click(function() {
                    target.className = 'col-sm-3';
                    dataToRemove[removeOptionName] = true;
                    target.children[1].src = 'img/ic_'+removeOptionName+'_full.png';
                    document.getElementById("mymodal").style.display = 'none';
                    document.getElementById('select-all-text').innerHTML = 'Restore To Default';
                    selectedAll = true;
                 });
                  $('#no').unbind("click").click(function() {
                    document.getElementById("mymodal").style.display = 'none';
                  });
                }
                else if (target.id == "passwords") {
                  document.getElementById('mymodal').style.display = 'block';
                  document.getElementById('headline').innerHTML = "PASSWORDS - WARNING";
                  document.getElementById('offer').innerHTML = "This will erase your saved Passwords, so the next time you log in to a website, you will have to enter your Password.";
                      $('#yes').unbind("click").click(function() {
                        target.className = 'col-sm-3';
                        dataToRemove[removeOptionName] = true;
                        target.children[1].src = 'img/ic_'+removeOptionName+'_full.png';
                        document.getElementById("mymodal").style.display = 'none';
                    });
                    $('#no').unbind("click").click(function() {
                      document.getElementById("mymodal").style.display = 'none';
                    });
                }
                else {
                  target.className = 'col-sm-3';
                  dataToRemove[removeOptionName] = true;
                  target.children[1].src = 'img/ic_'+removeOptionName+'_full.png';
                }
              }
              chrome.storage.local.set({
                // storage.StorageArea.set({
                dataToRemove: dataToRemove
              });
              document.getElementById('select-all')
                .disabled = false;
              e.preventDefault();
              break;
            }
          }
        }, false);

    document.getElementById('items')
        .addEventListener('mouseover', function(e) {
            for (var target = e.target; target && target != this; target = target.parentNode) {
                if (target.matches('li')) {
                  var removeOptionName = target.getAttribute('data-remove');
                  document.getElementsByTagName('h1')[0].innerText = helpTextOptions[removeOptionName];
                  e.preventDefault();
                  break;
                }
            }
        }, false);
    document.getElementById('items')
        .addEventListener('mouseout', function(e) {
            document.getElementsByTagName('h1')[0].innerHTML = 'All selected items will be cleaned - click on any item to unselect it.';
            e.preventDefault();
        }, false);
    document.getElementById('select-all')
      .addEventListener('click', function(e) {
        if (!selectedAll) {
          document.getElementById('mymodal_select').style.display = 'block';
          $('#continue').unbind("click").click(function() {
            document.getElementById("mymodal_select").style.display = 'none';
          });
          var i = 0;
          var checkedInterval = setInterval(function() {
            $removeOptionsButtons[i].className = 'disabled col-sm-3';
            $removeOptionsButtons[i].click();
            if (i < 8 ) i++;
            else clearInterval(checkedInterval);
          }, 50);

        } else {
            selectedAll = false;
            document.getElementById('select-all-text')
                .innerHTML = 'Select all';
            var i = 0;
            var checkedInterval = setInterval(function() {
                var removeOptionName = $removeOptionsButtons[i].getAttribute('data-remove');
                if (defaultDataToRemove[removeOptionName] == true) {
                    dataToRemove[removeOptionName] = true;
                    $removeOptionsButtons[i].className = 'col-sm-3';
                    $removeOptionsButtons[i].getElementsByTagName('img')[0].src = image_url[i]+'full.png';
                } else {
                    dataToRemove[removeOptionName] = false;
                    $removeOptionsButtons[i].className = 'disabled col-sm-3';
                    $removeOptionsButtons[i].getElementsByTagName('img')[0].src = image_url[i]+'full.png';
                }
                if ($removeOptionsButtons[i + 1]) i++;
                else clearInterval(checkedInterval);
            }, 50);
        }
        e.preventDefault();
      }, false);
};

function popup() {
    var modal = document.getElementById('mymodal');
   
}
