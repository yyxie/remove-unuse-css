import wxss from "./util/wxss";
import wxml from "./util/wxml";

const path = require("path");
const fs = require("fs");
let cls = [];

class UnUseClass {
  fileTypes: any
  hasTraversePath: string[];
  constructor() {
    this.hasTraversePath = [];
    this.fileTypes =  {
      TEMPL: ".wxml",
      STYLE: ".css",
      CONFIG: ".json",
      SCRIPT: ".js",
    };
  }
  deleteUnUseClass(wxmlPath, wxssPath) {
    // const cls = parseWxml(path.join(__dirname, 'successModal.wxml'))
    const cls = wxml.parseWxml(wxmlPath);
    // console.log("cls----", cls);
    wxss.parseWxss(wxssPath, cls);
  }
  traversePath(entryPath) {
    const dirArr = fs.readdirSync(entryPath);
    // console.log('dirArr---', dirArr)
    dirArr.forEach((item) => {
      const itemPath: string = path.join(entryPath, item);
      const fileName: string = path.basename(itemPath, path.extname(itemPath));
      const dirName: string = path.dirname(itemPath);
      const fileStat = fs.statSync(itemPath);
      if (fileStat.isDirectory()) {
        this.traversePath(itemPath);
      }
      if (
        fileStat.isFile() &&
        this.hasTraversePath.indexOf(`${dirName}/${fileName}`) < 0
      ) {
        const pageStylePath = dirName + "/" + fileName + this.fileTypes.STYLE;
        const pageTempPath = dirName + "/" + fileName + this.fileTypes.TEMPL;
        if (fs.existsSync(pageStylePath) && fs.existsSync(pageTempPath)) {
          // console.log('pageStylePath---', pageStylePath)
          // console.log('pageTempPath---',  pageTempPath)
          // console.log('hasTraversePath---', this.hasTraversePath)
          this.hasTraversePath.push(dirName + "/" + fileName);
          this.deleteUnUseClass(pageTempPath, pageStylePath);
        }
      }
    });
  }
  run() {
    this.traversePath(path.join(process.cwd()));
    // console.log("hasTraversePath---", this.hasTraversePath);
  }
}

export default UnUseClass;
