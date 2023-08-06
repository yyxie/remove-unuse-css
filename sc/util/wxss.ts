const path = require('path');
const fs = require('fs');
const postcss = require('postcss')
var scss = require('postcss-scss');
const stripInlineComments = require('postcss-strip-inline-comments')
const removeNode = function() {

}
const travelNodes = function(ast, pre, allClass){
    let nextPre = pre || '';
    ast.nodes.map((item)=>{
        if(item.type == 'rule'&& item.selector){
            if(item.selector.indexOf('&') == 0){
                const nextClass = item.selector.slice(1)
                console.log('&开始---', nextClass, pre + nextClass)
                if(nextClass.indexOf('.') == 0){ // 以.开始的
                    console.log('&.开始--')
                    const classArr = nextClass.split(' ')
                    // console.log('classArr---', classArr)
                    classArr.map((classItem)=>{
                        // item.remove()
                        if(allClass.indexOf(classItem.slice(1)) < 0){
                            console.log('class-item-删除-', classItem.slice(1))
                            item.remove()
                        }
                    })
                    // console.log('class1----', nextClass)
                } else if(!nextClass.includes(':') && !nextClass.includes('::')){
                // } else {
                    nextPre = pre + nextClass
                    console.log('非.&:&::开始--', nextPre)
                    if(item.nodes && item.nodes.filter((item)=>{ return item.type == 'rule' }).length != 0){ // 没有后代选择器
                        travelNodes(item, nextPre, allClass)
                    } else {
                        if(allClass.indexOf(nextPre.slice(1)) < 0){
                            console.log('删除了1---', nextPre.slice(1))
                            item.remove()
                        }
                        // console.log('class1----', nextPre)
                    }
                }
               
            } else {
                if(item.selector.indexOf(':') >= 0 || item.selector.indexOf('::') >= 0){
                    const preSelect = item.selector.split(':')[0];
                    if(allClass.indexOf(preSelect.slice(1)) < 0){
                        console.log('删除了带:或::---', item.selector)
                        item.remove()
                    }
                } else {
                    const nextClass = pre + item.selector;
                    console.log('非.开始的class--', nextClass.slice(1))
                    if(allClass.indexOf(nextClass.slice(1)) < 0){
                        console.log('删除了2---', nextClass.slice(1))
                        item.remove()
                    } else {
                        if(item.nodes && item.nodes.filter((item)=>{ return item.type == 'rule' }).length != 0){
                            nextPre = item.selector
                            travelNodes(item, nextPre, allClass)
                        } 
                    } 
                }
                
               
            }
        } 
    })
}
export default {
    parseWxss(pagePath, allClass){
        // const pagePath = path.join(__dirname, './successModal.wxss')
        let code = fs.readFileSync(pagePath, { encoding: 'utf8' })
        // postcss().process(code, { parser: scss }).then( result => {
        //     const ast = postcss.parse(result.css)
        //     travelNodes(ast)
        // })

        // const myPlugin = () => ({
        //     postcssPlugin: 'remove-dirty-class',
        //     AtRule (atRule) {
        //         console.log('--atRule---', atRule)
        //       atRule.map((item)=>{
        //         console.log('--selector---')
        //       })
               
        //     },
        //     AtRuleExit(){

        //     }

        // })
        // myPlugin.postcss = true
        // postcss([myPlugin]).process(code,{from: pagePath}).then(result => {
        //     console.log('css',)
        // }).catch((e)=>{
        //     // console.log('catch---', e)
        // })
       
        const plugin = (options) => ({
            postcssPlugin: 'remove-dirty-class2',
            Root(ast){
                travelNodes(ast, '', options.allClass)
            },
            // Rule(item){
            //     console.log('node--', node.selector)
            //     if(item.selector && item.selector.indexOf('&') == 0){
            //         const nextClass = item.selector.slice(1)
            //         if(nextClass.indexOf('.') == 0){
            //             console.log('class1----', nextClass.indexOf('.'))
            //             pre = ''
            //             all.push(nextClass.indexOf('.'))
            //         } else {
            //             nextPre = pre + nextClass
            //             if(item.nodes && item.nodes.filter((item)=>{ return item.type == 'rule' }).length != 0){
            //                 // travelNodes(item, nextPre)
            //                 pre = nextPre
            //             } else {
            //                 all.push(nextPre)
            //                 console.log('class1----', nextPre)
            //             }
            //         }
                   
            //     } else {
            //         console.log('class----', item.selector, item.nodes.length)
            //         if(item.nodes && item.nodes.filter((item)=>{ return item.type == 'rule' }).length != 0){
            //             nextPre = item.selector
            //             pre = nextPre;
            //             // travelNodes(item, nextPre)
            //         } 
            //     }
            // },
            // RuleExit(node) {
            //     console.log('exit--', all)
            // },
            // prepare(result) {
            //     const all = [];
            //     let pre = '';
            //     let prePre = '';
            //     return {
            //         Rule(item) {
            //             console.log('pre--', pre, item.selector)
            //             if(item.selector && item.selector.indexOf('&') == 0){
            //                 if(pre = '' && prePre){ pre = prePre }
            //                 const nextClass = item.selector.slice(1)
            //                 if(nextClass.indexOf('.') == 0){
            //                     all.push(nextClass.indexOf('.'))
            //                     pre = '';
            //                     prePre = '';
            //                     // console.log('class----', nextClass.indexOf('.'))
            //                     // pre ;
            //                 } else {
            //                     nextPre = pre + nextClass
            //                     all.push(nextPre)
            //                     // console.log('pre2--', nextPre)
            //                     // if(item.nodes && item.nodes.filter((item)=>{ return item.type == 'rule' }).length != 0){
            //                     //     // travelNodes(item, nextPre)
            //                     //     pre = nextPre;
            //                     // } else {
            //                     //     pre = '';
            //                     //     // console.log('class1----', nextPre)
            //                     // }
            //                 }
                           
            //             } else {
            //                 all.push(pre + item.selector)
            //                 // console.log('class2----', item.selector)
            //                 if(item.nodes && item.nodes.filter((item)=>{ return item.type == 'rule' }).length != 0){
            //                     // nextPre = item.selector
            //                     pre = pre + item.selector
            //                     // console.log('class3----', pre)
            //                     // travelNodes(item, nextPre)
            //                 } else {
            //                     pre = ''
            //                     prePre = pre
            //                 }
            //             }
            //         },
            //         OnceExit() {
            //             // console.log(all)
            //         }
            //     }
            // }
            // Declaration(decl) {
            //   console.log(decl.toString())
            //   decl.value = "red"
            // }
        })
        plugin.postcss = true
        postcss([plugin({allClass})]).process(code, {  parser: scss, from: pagePath }).then(result => { // 这里由于是scss文件故要使用scss这个解析器
            // console.log('css',result.css);
            fs.writeFile(pagePath, result.css, function (err) {
                if (err) {
                  throw err;
                }
                console.log('文件写入成功', pagePath);
            });
        }).catch((e)=>{
            // console.log('catch---', e)
        })


    }
}