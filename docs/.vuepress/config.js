const path = require("path");

module.exports = {
  title: '개발자 박하은 : Note',
  description: '간단한 기록',
  themeConfig: {
    logo: '/logo.svg', // 로고 svg
    nav: [
      { text: 'Blog', link: 'https://pullingoff.github.io' },
      { text: 'TIL', link: 'https://pullingoff.github.io/vue-til' },
      { text: 'Github', link: 'https://github.com/pullingoff' }
    ],
    sidebar: getSidebarArr(), 
    smoothScroll: true
  },
  base: "/vue-note/",  // github.io 뒤 주소
  plugins: [
    ["@vuepress/back-to-top"],
    ["@vuepress/last-updated"],
  ],
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    // ['link', { rel: 'manifest', href: '/manifest.json' }]
  ]
}

function getSidebarArr() {
  const fs = require("fs");
  let docsPath = __dirname + "/../note/";
  let sidebarArr = [];
  let filelist = fs.readdirSync(docsPath);

  // Next.js 처럼 폴더명에 . 들어가도 되게 수정하기

  filelist.forEach(function(file) {
    if (file === ".vuepress") return;
    var til_path = docsPath + "/" + file
    var stat = fs.lstatSync(til_path);
    if (stat.isDirectory()) {
      var docsFolderPath = til_path;
      var list = fs.readdirSync(docsFolderPath);
      sidebarArr.push(makeSidebarObject(file, list));
    } 
  });
  
  return recentTilToFirst(sidebarArr, 1, 0);
}

// 디렉토리명때문에 최근거가 맨 위로 못 오니까 맨 위로 오도록 수정
function recentTilToFirst(arr, fromIndex, toIndex) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
  return arr
}
function makeSidebarObject(folder, mdfileList) {
  let note_path = "/note/"
  let path = folder ? note_path + folder + "/" : note_path;
  mdfileList = aheadOfReadme(mdfileList);
  let tmpMdfileList = [];
  
  // remove .md, add Path
  mdfileList.forEach(function(mdfile) {
    if (mdfile.substr(-3) === ".md") {
      mdfile = mdfile.slice(0, -3) === "README" ? "" : mdfile.slice(0, -3);
      tmpMdfileList.push(path + mdfile);
    }
  });
  mdfileList = tmpMdfileList;

  // remove folder prefix number
  if (folder) {
    const dotIdx = folder.indexOf(".");
    var title = Number(folder.substr(0, dotIdx))
      ? folder.substr(dotIdx + 1)
      : folder;
  } else {
    title = "HOME";
  }
  return {
    title: title,
    // path: `/${folder}`,
    children: mdfileList
  };
}
function aheadOfReadme(arr) {
  // ['1.test.md','README.md'] => ['README.md','1.test.md']
  let readmeIdx = arr.indexOf("README.md");
  if (readmeIdx > 0) {
    arr.unshift(arr.splice(readmeIdx, 1)[0]);
  }
  return arr;
}
  