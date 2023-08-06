
// import parser from '@babel/parser';
import { prettyPrint } from 'html';
import { parse }from 'himalaya-wxml'

const path = require('path');
const fs = require('fs');

let cls: string[]= [];

const traverse = ast => {
  ast.map(item => {
    if ((item.type === "element"|| item.type === 'text')  ) {
      (item.attributes || []).map(attr => {
        if (attr.key == "class") {
          const va = attr.value;
          const threeList = va.match(/{{(.*?)}}/g) || []; // 匹配{{}}中内容
          const constantList = va.replace(/{{(.*?)}}/g, '').split(' ') || []
          // console.log('threeList--', threeList)
          // console.log('constantList----', constantList)
          threeList.map((str) =>{
            // const ma = m.slice(2, -2);
            // if(ma){
            //   (ma || []).map((str)=>{
                const matches = str.match(/'([^']+)'/g)?.map(match => match.slice(1, -1));
                matches?.map((it)=>{
                  if(it.split(' ')){
                    cls = [...cls, ...(it.split(' ') || [])]
                  }
                })
              // })
            // }
            
          })
       
          constantList.map((item)=>{
            if(item){
              cls.push(item.trim())
            }
          })

          // const vaList = va.split(m1)
          // vaList.map((item)=>{
          //   const m = item.match(/{{(.*?)}}/g);
          //   if(m){
          //     const ma = m.map(match => match.slice(2, -2));
          //     ma.map((str)=>{
          //       const matches = str.match(/'([^']+)'/g)?.map(match => match.slice(1, -1));
          //       matches?.map((it)=>{
          //         if(it.split(' ')){
          //           cls = [...cls, ...(it.split(' ') || [])]
          //         }
                 
          //       })
          //     })
          //   } else {
          //     const splitQouta = item.split(' ')
          //     splitQouta.map((item)=>{
          //       if(item){
          //         cls.push(item.trim())
          //       }
          //     })
          //   }
          // })
          // cls.push(attr.value)
        }
      })
      if(item.children && item.children.length != 0){
        traverse(item.children)
      }
    }
  });
};
export default {
  parseWxml(pagePath){
    // const pagePath = path.join(__dirname, 'successModal.wxml')
    let code = fs.readFileSync(pagePath, { encoding: 'utf8' })
    let wxml = prettyPrint(code, {
      max_char: 0,
      indent_char: 0,
      unformatted: ['text', 'wxs']
    })
    wxml = parse(wxml.trim())
    traverse(wxml);
    return cls
  }
}