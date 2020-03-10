const dot = require('dotenv');
const express = require('express')
const mysql = require('mysql')
const moment = require('moment')
const router = express.Router()
const alert = require('alert-node')
dot.config();

var db = mysql.createConnection({
    host:process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_NAME
})

router.get('/',(req,res)=>{
    var sql = 'SELECT * FROM v20_clubs'
    var valueData =['seosin', 'wooa', 'junghwa', 'inhoo', 'etc', 'song', 'hyo', 'pyoung','sam','jeonbuk','wanju','abroad','other','noseperate']
    db.query(sql,(err, result)=>{
        console.log(result)
        res.render('index' , {result:result ,valueData:valueData })
    })
    
})
//리스트
router.get('/main',(req,res)=>{
    
    res.redirect('/main/1');
    //main경로 이동 요청시 main/1로 이동 요청.
});


router.get('/userquery',(req, res)=>{
    var select = req.query.select
    var searchData = req.query.userquery
    var headerName = ['번호','관계', '이름', '법명','생일', '핸드폰' ,'직업' ,'원불', '인등','순번'] 
    var familyName = ['relation' ,'name','bName','sBirthDate','hPhone', 'job' , 'hpYN' , 'hpYN']
    console.log(select, searchData)
    if(select=="mainNo" || select=="name" || select=="phone" ) {
        var sql = `SELECT * FROM v20_family WHERE ${select}  LIKE '%${searchData}%'`
        db.query(sql,(err, result)=>{
            
            if(err) {
                console.log(err)
                
            }
            if(result.length !=0){
                console.log(result)
                var familySql = `SELECT * FROM v20_main WHERE sno ='${result[0].mainNo}'` 
                db.query(familySql, (err, mainResult)=>{

                    // var selectFamilySql = `SELECT * FROM v20_family WHERE `
                    if(err){
                        console.log(err)
                        res.re
                        
                    }else {
                        console.log(mainResult)
                        res.render('userinfo_3',{mainData:mainResult, familyData : result , headerName:headerName,familyName:familyName})
                    }
                })
            } else {
                // res.render('err_with_nabvar', {data:null, familyData : result , headerName:headerName,familyName:familyName})
                res.redirect('/')
            }
        })
    } else {
        var sql = `SELECT * FROM v20_main WHERE ${select} LIKE '%${searchData}%'`
        db.query(sql, (err, result)=>{
            if(err){
                console.log(err)
            }else {
                if(result.length !=0) {
                    
                    var familySql = `SELECT * FROM v20_family WHERE mainNo LIKE '${result[0].sno}'`
                    db.query(familySql, (err, results)=>{
                        console.log(result , results, results.length)
                        res.render('userinfo_3', {data:result, familyData : results , headerName:headerName,familyName:familyName})
                        // res.send("Success")
                    })
                }else{
                    // alert("No DATA")
                    res.render('err_with_nabvar', {data:null, familyData : result , headerName:headerName,familyName:familyName})
                    // res.redirect('/')
                }
                
            }
        })
    }
    

   
})

router.get('/useredit',(req, res)=>{
    // var select = req.query.select
    var searchData = req.query.searchData
    var headerName = ['번호','관계', '이름', '법명','생일', '핸드폰' ,'직업' ,'원불', '인등','순번'] 
    var familyName = ['relation' ,'name','bName','sBirthDate','hPhone', 'job' , 'hpYN' , 'hpYN']
    console.log(searchData)
        var sql = `SELECT * FROM v20_main WHERE sno=${searchData}`
        db.query(sql,(err, result)=>{
            
            if(err) {
                console.log(err)
                
            }else {
                res.render('edituserinfo',{mainData:result} )
            }
            
        })
    })


router.get('/selectuserquery',(req, res)=>{
    var paramSno = req.query.mainNo
    var userNum = req.query.userNum
    console.log(userNum)
    var headerName = ['','관계', '이름', '법명','생일', '핸드폰' ,'직업' ,'원불', '인등','순번'] 
    var familyName = ['relation' ,'name','bName','sBirthDate','hPhone', 'job' , 'hpYN' , 'hpYN']
    // var searchData = req.query.userquery
    console.log(paramSno,userNum)
    var sql = `SELECT * FROM v20_family WHERE mainNo='${paramSno}' AND sno=${userNum} `

    db.query(sql, (err, result)=>{
        if(err) {
            console.log(err)
            res.redirect('/')
        }

        var sqlMain = `SELECT * FROM v20_main WHERE sno='${paramSno}'`
        db.query(sqlMain, (err, mainResult)=>{
            if(err){
                console.log(err)
            }else {
            
                if(result.length !=0) {
                    console.log(result)
                    
                    var familySql = `SELECT * FROM v20_family WHERE mainNo LIKE '${paramSno}'`
                    db.query(familySql, (err, results)=>{
                        console.log(result , results)
                        res.render('selectuserinfo_1', {mainData:mainResult,data:result, familyData : results , headerName:headerName,familyName:familyName})
                        // res.send("Success")
                    })
                   
                }else{
                    // alert("No DATA")
                    res.redirect('/')
                }
                
            }
        })
        
    })
})

router.get('/search',(req,res)=>{
    // res.redirect('/search/1');
    //boardList경로 이동 요청시 boardList/1로 이동 요청.
    res.render('search')
});

router.get('/search/result',(req, res)=>{
    var fieldName = req.query.select
    var searchData = req.query.search
    console.log(fieldName , searchData)

    var sql = `SELECT * FROM v20_main WHERE ${fieldName} LIKE '%${searchData}%';`
    db.query(sql,(err, result)=>{
        if(err){
            console.log(err)
            res.status(500).send('No response at Server')
        }else{
            console.log(result)
            // var relationqry = `SELECT * FROM v20_family WHERE mainNo LIKE '%${result[0].sno}%'`
            // db.query(relationqry,(err, relResult)=>{
            //     if(err){
            //         console.log(err)
            //     }else {
            //         if(result == undefined) {
            //             alert("NO DATA")
            //         }
                    // res.render('searchresult',{data:result , familyData:relResult}) 
                    res.render('searchresult',{data:result }) 

            //     }
               
            // })
            
        }
    })
    
})
router.get('/main/:currentPage' , (req , res)=>{
    console.log('/mainlist 요청')

    // 페이징
    var rowPerPage = 10;
    var currentPage = 1;
    if(req.params.currentPage){
        currentPage = parseInt(req.params.currentPage)
    }

    var beginRow = (currentPage-1)*rowPerPage
    console.log(`currentPage: ${currentPage}`)
    
    var model = {}

    //db연결
    var sqlCount = 'SELECT COUNT(*) AS cnt  FROM v20_main'
    db.query(sqlCount ,(err , result)=>{
        if(err) {
            console.log(err);
            res.status(500).send('서버가 응답이 없습니다.')
        }else{
            console.log(`totalRow:${result[0].cnt}`)
            var totalRow = result[0].cnt;
            lastPage = totalRow / rowPerPage
            if(totalRow%rowPerPage !=0){

                lastPage++;
            }
            
        }
    var getSql = `SELECT * from v20_main_1 ORDER BY id ASC LIMIT ?,?`
    db.query(getSql, [beginRow, rowPerPage] ,(err, results)=>{
            if(err){
                console.log(err);
                res.end();
            }else{
               model.mainList = results;
               model.currentPage = currentPage;
               model.lastPage = lastPage
               res.render('main',{data:model}) 
            }
        })            
    }) 
})


router.get('/search/:currentPage' , (req , res)=>{
    console.log('/mainlist 요청')

    // 페이징
    var rowPerPage = 10;
    var currentPage = 1;
    if(req.params.currentPage){
        currentPage = parseInt(req.params.currentPage)
    }

    var beginRow = (currentPage-1)*rowPerPage
    console.log(`currentPage: ${currentPage}`)
    
    var model = {}

    //db연결
    var sqlCount = 'SELECT COUNT(*) AS cnt  FROM v20_main'
    db.query(sqlCount ,(err , result)=>{
        if(err) {
            console.log(err);
            res.status(500).send('서버가 응답이 없습니다.')
        }else{
            console.log(`totalRow:${result[0].cnt}`)
            var totalRow = result[0].cnt;
            lastPage = totalRow / rowPerPage
            if(totalRow%rowPerPage !=0){

                lastPage++;
            }
            
        }
    var getSql = `SELECT * from v20_main_1 ORDER BY id ASC LIMIT ?,?`
    db.query(getSql, [beginRow, rowPerPage] ,(err, results)=>{
            if(err){
                console.log(err);
                res.end();
            }else{
               model.mainList = results;
               model.currentPage = currentPage;
               model.lastPage = lastPage
               res.render('main',{data:model}) 
            }
        })            
    }) 
})


router.post('/userinfo/add',(req, res)=>{
    console.log(req.body)
    
    var firstName1 = req.body.firstName1;
    var lastName1 = req.body.lastName1;
    var name = firstName1 +lastName1;
    var emailAddress1 = req.body.emailAddress1;
    var date1 = req.body.date1
    var phoneNumber1 = req.body.phoneNumber1;
    var postnumber =req.body.postnumber
    var detailaddress = req.body.detailaddress;
    var addresss = req.body.addresss;
    var comAdrress = addresss +detailaddress
    var introducer =req.body.introducer
    var clubNo = req.query.select
    var shortDescription1 = req.body.shortDescription1;
    if (req.body.birthYN ==='on') {
         var birthYN = 0;
       
    } else {
        var birthYN = 1
    }
   if (req.body.postit ==='on') {
    var postit = 0;
    
    } else {
    var postit =1
    }
    var inputArray = [name,date1,emailAddress1,postnumber,comAdrress,introducer, postit, birthYN ,phoneNumber1, clubNo, shortDescription1]
    console.log(`data: ${inputArray}`)
    var sql = 'INSERT INTO v20_main (name, joinDate ,email, zip,address,hname, dmYN, cardYN,phone,clubNo ,memo )  VALUES (?, ?, ?, ?,? , ?, ?,? , ?, ?,? )'
    // var params = [sno, name , joinDate,address, phone, hName,dmYN,cardYN,wishNo,clubNo,memo ];
    db.query(sql,inputArray, (err,result )=>{
        console.log(result)
        if(err) {
            console.log(err)
        }
        res.render('index')
        
    })
})

// 신도 상세 페이지 수정 버튼 클릭시 모달 
router.post('/useredit' , (req, res)=>{
    var mainSno = req.query.searchData
    var name =req.body.name
    var address =req.body.address;
    var Phone =req.body.Phone;
    var parentSno =req.body.parentSno;
    var memo =req.body.memo;

    var sql = `UPDATE  v20_main SET name='${name}',address='${address}',phone='${Phone}',parentSno='${parentSno}',memo='${memo}'  WHERE sno='${mainSno}'`;
    db.query(sql, (err, results)=>{
        if(err) {
            console.log(err)
        }else {
            console.log(results)
            res.render('index')
        }
    })
    // console.log("test")
    // res.render('index')
})
router.post('/topic/add',(req, res)=>{
    console.log(req.body);
    var sno = 30004;
    var name = req.body.name;
    var joinDate = req.body.joinDate;
    var address = req.body.address;
    var phone = req.body.phone;
    var hName = req.body.hName;     
    var cardYN = req.body.cardYN;
    var wishNo = req.body.wishNo;
    var parent = req.body.parent
    var clubNo = req.body.clubNo;
    var memo = req.body.memo;

    var sql = 'INSERT INTO main (sno, name , joinDate,address, phone, hName,dmYN,cardYN,wishNo,parentSno,clubNo,memo  )  VALUES (?, ?, ?,? , ?, ?,? , ?, ?,? , ? )'
    params = [sno, name , joinDate,address, phone, hName,dmYN,cardYN,wishNo,parent,clubNo,memo ];

    db.query(sql, params ,(err, result)=>{
        if(err){
            console.log(err);
            res.status(500).send('Internal Server error')
        }

        else{
            console.log("성공적으로 저장되었습니다.");
            console.log(result);
            res.redirect(`/topic/add`)

        }
    })
})



router.get('/topic/:id',(req, res)=>{
    var sql = 'SELECT * FROM topic';
    db.query(sql , (err , results)=>{
        var ids = req.params.id;
        if(ids){
            var sql = `SELECT * FROM topic WHERE id=${ids}`
            db.query(sql, (err , result)=>{
                if(err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                else{
                    console.log(result)
                    
                    if(result[0]){
                    res.render('view',{datas:results , data:result[0]})
                    }

                    else {
                        res.render('error', {datas:results , data:{id:1, title:"1",description:"1",author:"1"}})
                    }
                }
            })    
        }
        
    })
    
})

router.post('/topic/:id/edit' , (req , res ) =>{
    var sql = 'UPDATE topic SET title=? , description=? , author=? WHERE id=?';
    var title = req.body.title;
    var description =req.body.description;
    var author = req.body.author;
    var ids = req.params.id;
    var editData = [title, description,author, ids];
    

    db.query(sql,editData,(err, result)=>{
        if(err){
            console.log(err);
            res.status(500).send('Interval Server Error')
        }
        else{
            res.redirect(`/topic/${ids}/edit`)
        }
    })

})
router.get('/topic/:id/delete' , (req, res)=>{
    var sql = 'SELECT id , title FROM topic';
    
    db.query(sql,(err, results)=>{
        var ids = req.params.id;
        if(err){
            console.log(err);
            res.status(500).send('Interval Service Error')
        }
        else{
            var sql = 'SELECT * FROM topic WHERE id = ?'
            db.query(sql,[ids] ,(err, result)=>{
                if(err){
                    console.log(err);
                    res.status(500).send('Interval Service Error')
                }
                else {
                    res.render('delete' ,{})
                }
            })
        }
    })
})

router.post('/topic/:id/delete' , (req , res)=>{
    var ids = req.params.id;
    var sql = 'DELETE FROM topic WHERE id = ? '
    var deleteId = [ids]
    db.query(sql,deleteId,(err , result)=>{
        if(err) {
            console.log(err);
            res.status(500).send('Interval Server Error')
        }
        else {
            res.redirect('/topic/add')
        }
    } )
})


module.exports = router;