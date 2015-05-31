var TOTAL_DIST = 0,
  DIST_FOR_PAGES = 0,
  LEFT_VIDEO = 0,
  LEFT_PAGE = 0,
  LAST_PAGE = 0,
  VID_PER_PAGE = 0,
  ARRAY_OF_ALL_VIDEOS = [],
  ACTIVE_PAGE = 0,
  offsetWidth = document.body.offsetWidth,
  nextPageToken = '';

(function() {
  var header = document.createElement('header');
  document.body.appendChild(header);

  var search = document.createElement('input');
  search.type = "search";
  search.id = "search";
  search.name = "search";
  search.placeholder = "type smth like cats...";
  header.appendChild(search);
  header.innerHTML += "<div class='logo'><span>U</span><span>T</span><span>U</span><span>B</span><span>E</span><br/><span>viewer</span></div>";

  var main = document.createElement('main');
  document.body.appendChild(main);

  var videoBlock = document.createElement('ul');
  videoBlock.id = "videoBlock";
  videoBlock.className = "videoBlock";
  main.appendChild(videoBlock);

  var footer = document.createElement('footer');
  document.body.appendChild(footer);

  var ulContainer = document.createElement('div');
  ulContainer.className = "ulContainer";
  footer.appendChild(ulContainer);

  var navWrapper = document.createElement('ul');
  navWrapper.id = "navWrapper";
  navWrapper.className = "navWrapper";
  ulContainer.appendChild(navWrapper);

  var popUp = document.createElement('div');
  popUp.innerHTML = "No videos found";
  popUp.id = "popUp";
  popUp.className = "popUp";
  document.body.appendChild(popUp);

  var loader = document.createElement('div');
  loader.className = 'loader';
  loader.id = "loader";
  loader.innerHTML = "<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>";
  document.body.appendChild(loader);
})();
var search = document.getElementById('search');
var videoBlock = document.getElementById('videoBlock');
var navWrapper = document.getElementById('navWrapper');
var loader = document.getElementById('loader');
var popUp = document.getElementById('popUp');
search.addEventListener('keypress', init);

function init(e) {
  key = e.keyCode || e.which;
  if (key === 13) {
    loader.style.display = "block";
    for (var i = 0; i < ARRAY_OF_ALL_VIDEOS.length; i++) {
      var div = document.getElementById('vid' + i);
      videoBlock.removeChild(div);
    }
    ARRAY_OF_ALL_VIDEOS = [];
    var lis = document.querySelectorAll('li');
    for (i = 0; i < lis.length; i++) {
      navWrapper.removeChild(lis[i]);
    }
    numberOfVideosToDisplay();
    videoBlock.style.width = offsetWidth + 2 + "px";
    TOTAL_DIST = 0;
    DIST_FOR_PAGES = 0;
    LEFT_VIDEO = 0;
    LEFT_PAGE = 0;
    LAST_PAGE = 0;
    nextPageToken = '';
    ACTIVE_PAGE = 0;
    videoBlock.style.paddingLeft = (offsetWidth - 320 * VID_PER_PAGE) / 2 + "px";
    navWrapper.style.webkitTransform = "translate3D(0px,0,0)";
    videoBlock.style.webkitTransform = "translate3D(0px,0,0)";
    loadContentWithPages();
  }
}
window.onresize = function() {
  if (ARRAY_OF_ALL_VIDEOS.length === 0) {
    return;
  }
  var videoWidth,
    pages,
    lastPageTemp,
    leftVidTemp;
  numberOfVideosToDisplay();
  videoWidth = 320 * VID_PER_PAGE;
  videoBlock.style.paddingLeft = (offsetWidth - videoWidth) / 2 + "px";
  pages = Math.ceil(ARRAY_OF_ALL_VIDEOS.length / VID_PER_PAGE);
  videoBlock.style.width = videoWidth * Math.ceil((LEFT_VIDEO - VID_PER_PAGE + 1) / VID_PER_PAGE) + offsetWidth + 2 + "px";
  lastPageTemp = LAST_PAGE;
  createPages();
  showHiddenAndMove();
  (pages > lastPageTemp) ? defineActivePageAndSwipe('left') : defineActivePageAndSwipe();

  function showHiddenAndMove() {
    ACTIVE_PAGE = Math.floor(LEFT_VIDEO / VID_PER_PAGE);
    TOTAL_DIST = -videoWidth * ACTIVE_PAGE;
    videoBlock.style.webkitTransform = "translate3D(" + TOTAL_DIST + "px,0,0)";
    leftVidTemp = LEFT_VIDEO;
    LEFT_VIDEO = ACTIVE_PAGE * VID_PER_PAGE;
    if (LEFT_VIDEO < leftVidTemp) {
      for (var i = LEFT_VIDEO; i <= leftVidTemp; i++) {
        ARRAY_OF_ALL_VIDEOS[i].classList.remove("hidden");
      }
    }
  }
};

function createPages() {
  var numberOfPages = Math.ceil(ARRAY_OF_ALL_VIDEOS.length / VID_PER_PAGE);
  if (numberOfPages > LAST_PAGE) {
    for (var i = LAST_PAGE; i < numberOfPages; i++) {
      var page = document.createElement('li');
      page.id = "page" + i;
      page.dataset.after = i + 1;
      if (page.dataset.after > 999) {
        page.style.fontSize = "10px";
      }
      navWrapper.appendChild(page);
    }
    if (!document.querySelector('.activePage')) {
      document.getElementById('page0').className = "activePage";
    }
  }
  if (numberOfPages < LAST_PAGE) {
    for (var i = numberOfPages; i < LAST_PAGE; i++) {
      var li = document.getElementById("page" + i);
      navWrapper.removeChild(li);
    }
  }
  LAST_PAGE = numberOfPages;
}
var _isTouch = 'ontouchstart' in videoBlock,
  startType = _isTouch ? 'ontouchstart' : 'onmousedown';

videoBlock[startType] = function(e) {
  var moveType = _isTouch ? 'ontouchmove' : 'onmousemove',
    endType = _isTouch ? 'ontouchend' : 'onmouseup',
    leaveType = _isTouch ? 'ontouchleave' : 'onmouseleave';
  search.blur();
  if (startType === 'ontouchstart') {
    e = e.changedTouches[0];
  } else {
    e.preventDefault();
  }
  var start = e.pageX;
  var end;
  var difference;
  this.style.transition = "all 0.0s ease-in-out";
  videoBlock.style.cursor = '-moz-grabbing';
  videoBlock.style.cursor = '-webkit-grabbing';

  function moveAt(e) {
    videoBlock.style.webkitTransform = "translate3D(" + (difference + TOTAL_DIST) + "px,0,0)";
  }
  document[moveType] = function(e) {
    if (moveType === 'ontouchmove') {
      e = e.changedTouches[0];
    } else {
      e.preventDefault();
    }
    end = e.pageX;
    difference = end - start;
    moveAt(e);
  };
  this[leaveType] = function() {
    document[moveType] = null;
    videoBlock.style.webkitTransform = "translate3D(" + (TOTAL_DIST) + "px,0,0)";
    this.style.cursor = '-moz-grab';
    this.style.cursor = '-webkit-grab';
    difference = 0;
  };
  this[endType] = function(e) {
    if (startType === 'ontouchstart') {
      e = e.changedTouches[0];
    } else {
      e.preventDefault();
    }
    document[moveType] = null;
    this.style.cursor = '-moz-grab';
    this.style.cursor = '-webkit-grab';
    if (ARRAY_OF_ALL_VIDEOS.length === 0) {
      this.style.cursor = '-moz-grab';
      this.style.cursor = '-webkit-grab';
      return;
    }

    if (difference < -20) {
      if (((+ARRAY_OF_ALL_VIDEOS[ARRAY_OF_ALL_VIDEOS.length - 1].id.slice(3) + 1)) <= (ACTIVE_PAGE + 1) * VID_PER_PAGE) {
        this.style.webkitTransform = "translate3D(" + TOTAL_DIST + "px,0,0)";
        return;
      }
      move('left');
    } else if (difference > 20 && ACTIVE_PAGE !== 0) {
      move('right');
    } else {
      this.style.webkitTransform = "translate3D(" + TOTAL_DIST + "px,0,0)";
    }
  };
};
videoBlock.ondragstart = function() {
  return false;
};

function defineActivePageAndSwipe(direction) {
  var step;
  var delta = ACTIVE_PAGE - LEFT_PAGE;
  if (document.querySelector(".activePage")) {
    document.querySelector(".activePage").classList.remove("activePage");
  }
  if (!document.getElementById('page' + ACTIVE_PAGE)) {
    return;
  }
  document.getElementById('page' + ACTIVE_PAGE).classList.add("activePage");
  if (direction === 'left') {
    if (LAST_PAGE - ACTIVE_PAGE <= 4) {
      loadContentWithPages();
    }
    for (var i = 10; i > 7; i--) {
      if ((LAST_PAGE - LEFT_PAGE >= i) && ((delta + 4) >= i)) {
        step = 7 - i;
        break;
      }
    }
    if ((delta - 7) >= 0) {
      step = 3 - delta;
    }
  } else {
    if (delta >= 3) {
      (delta >= 7) ? step = delta - 3 : step = 0;
    } else {
      step = 3 - delta;
    }
    step = Math.min(step, LEFT_PAGE);
  }
  if (step) {
    DIST_FOR_PAGES += 30 * step;
    LEFT_PAGE = LEFT_PAGE - step;
  }
  navWrapper.style.webkitTransform = "translate3D(" + DIST_FOR_PAGES + "px,0,0)";
  navWrapper.style.transition = "-webkit-transform 0.3s ease";
}

function loadContentWithPages(direction) {

  var lastLength = ARRAY_OF_ALL_VIDEOS.length;
  var xmh;
  var xmh2;
  var response;
  var clipList;
  var ids;
  if (window.XMLHttpRequest) {
    xmh = new XMLHttpRequest();
  } else {
    xmh = new ActiveXObject("Microsoft.XMLHTTP");
  }
  if (nextPageToken === undefined) {
    return;
  }
  var searchString = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" 
                			+ search.value + "&type=video&order=relevance&maxResults=" 
                			+ 15 + "&key=AIzaSyApZWNDlQ1rhUkIEiHR5HbcEPqtca0n4UE&pageToken=" + nextPageToken;
  xmh.open("GET", searchString, true);
  xmh.onreadystatechange = function() {
    if (xmh.readyState == 4) {
      response = JSON.parse(xmh.responseText);
      if (response.error || response.items.length === 0) {
        popUp.classList.add('show');
        setTimeout(function() {
          loader.style.display="none";
          popUp.classList.remove('show');
        }, 1000);
        return;
      }
      clipList = convertYouTubeResponseToClipList(response).clipList;
      ids = convertYouTubeResponseToClipList(response).ids;
      ids.join(',');
      if (window.XMLHttpRequest) {
        xmh2 = new XMLHttpRequest();
      } else {
        xmh2 = new ActiveXObject("Microsoft.XMLHTTP");
      }
      var string = "https://www.googleapis.com/youtube/v3/videos?part=statistics&id=" 
      			       + ids + "&key=AIzaSyApZWNDlQ1rhUkIEiHR5HbcEPqtca0n4UE";
      xmh2.open("GET", string, true);
      xmh2.onreadystatechange = function() {
        if (xmh2.readyState == 4) {
          var res = JSON.parse(xmh2.responseText);
          createDivs(clipList, res.items);
          createPages();
          if (direction === 'left') {
            defineActivePageAndSwipe('left');
          }
        }
      };
      xmh2.send(null);
      loader.style.display = "none";
    }
  };
  xmh.send(null);
}

function convertYouTubeResponseToClipList(rawYouTubeData) {
  var clipList = [];
  var ids = [];
  var entries = rawYouTubeData.items;
  nextPageToken = rawYouTubeData.nextPageToken;
  if (entries) {
    for (var i = 0, l = entries.length; i < l; i++) {
      var item = entries[i].snippet;
      var date = new Date(Date.parse(item.publishedAt));
      var shortId = entries[i].id.videoId;
      clipList.push({
        id: shortId,
        youtubeLink: "http://www.youtube.com/watch?v=" + shortId,
        title: item.title,
        thumbnail: item.thumbnails.medium.url,
        description: item.description,
        publishDate: date.toDateString(),
        author: item.channelTitle
      });
      ids.push(shortId);
    }
  }
  return {
    clipList: clipList,
    ids: ids
  };
}
function createDivs(clipList, res) {
  var lastLength = ARRAY_OF_ALL_VIDEOS.length;
  var newLength = ARRAY_OF_ALL_VIDEOS.length + 15;
  var clipsCount = 0;
  for (var i = lastLength; i < newLength; i++) {
    var divVideo = document.createElement('li');
    divVideo.className = "item";
    if (!clipList[clipsCount]) {
      return;
    }
    divVideo.innerHTML="<div class='info'><img src='"+clipList[clipsCount].thumbnail+
                     "'><ul class='forStat'><li class='views'>"+res[clipsCount].statistics.viewCount+
                     "</li><li class='likes'>"+res[clipsCount].statistics.likeCount+"</li><li class='button'><a href='"
                     +clipList[clipsCount].youtubeLink+"' target='_blank'>watch</a></li></ul></div><p class='forTitle'><a class='title' href='"
                     +clipList[clipsCount].youtubeLink+"' target='_blank'>"
                     +clipList[clipsCount].title+"</a></p><p class='descr'>"+clipList[clipsCount].description
                     +"</p><ul class='addInfo'><li class='author'>"+clipList[clipsCount].author+"</li><li class='date'>"
                     +clipList[clipsCount].publishDate+"</li></ul>";    
    divVideo.id = 'vid' + i;
    clipsCount++;
    ARRAY_OF_ALL_VIDEOS.push(divVideo);
    videoBlock.appendChild(divVideo);
  }
}

function numberOfVideosToDisplay() {
  offsetWidth = document.body.offsetWidth;
  if (offsetWidth <= 320) {
    offsetWidth = 320;
    videoBlock.style.paddingLeft = 0;
  }
  VID_PER_PAGE = parseInt(offsetWidth / 320);
}

function move(direction, delta) {
  var oldLeft,
    factor;
  videoBlock.style.transition = "all .5s ease";
  delta = delta || 1;
  (direction === 'left') ? factor = 1 : factor = -1;
  var videosWidth = factor * 320 * VID_PER_PAGE * delta;
  videoBlock.style.width = parseInt(videoBlock.style.width) + videosWidth + "px";
  TOTAL_DIST = TOTAL_DIST - videosWidth;
  videoBlock.style.webkitTransform = "translate3D(" + TOTAL_DIST + "px,0,0)";
  ACTIVE_PAGE += factor * delta;
  if (direction === 'left') {
    if ((ARRAY_OF_ALL_VIDEOS.length - ACTIVE_PAGE * VID_PER_PAGE) < 10) {
      loadContentWithPages('left');
    }
    defineActivePageAndSwipe('left');
    oldLeft = LEFT_VIDEO;
    LEFT_VIDEO += VID_PER_PAGE * delta;
    for (var i = oldLeft; i < LEFT_VIDEO; i++) {
      ARRAY_OF_ALL_VIDEOS[i].classList.add("hidden");
    }
  }
  if (direction === 'right') {
    oldLeft = LEFT_VIDEO;
    LEFT_VIDEO -= VID_PER_PAGE * delta;
    for (var i = LEFT_VIDEO; i < oldLeft; i++) {
      ARRAY_OF_ALL_VIDEOS[i].classList.remove("hidden");
    }
    defineActivePageAndSwipe();
  }
}

navWrapper.addEventListener('mousedown', function(e) {
  var target;
  target = e.target;
  if (target.tagName === 'LI') {
    var idOfNewPage = +target.id.slice(4);
    if (idOfNewPage === ACTIVE_PAGE) {
      return;
    } else if (idOfNewPage > ACTIVE_PAGE) {
      move('left', idOfNewPage - ACTIVE_PAGE);
    } else if (idOfNewPage < ACTIVE_PAGE) {
      move('right', ACTIVE_PAGE - idOfNewPage);
    }
  }
  search.blur();
});