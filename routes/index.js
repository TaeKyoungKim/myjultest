const dot = require('dotenv');
const express = require('express')
const mysql = require('mysql')

const router = express.Router()
dot.config();

var db = mysql.createConnection({
    host:process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_NAME
})

//리스트
router.get('/main',(req,res)=>{
    res.redirect('/main/1');
    //boardList경로 이동 요청시 boardList/1로 이동 요청.
});
 
router.get('/main/:currentPage' , (req , res)=>{
    console.log('/mainlist 요청')

    // 페이징
    var rowPerPage = 10;
    var currentPage = 1;
    if(req.params.currentPage){
        currentPage = parseInt(req.params.currentPage)
    }

    var beginRow = (currentpage-1)*rowPerPage
    console.log(`currentPage: ${currentPage}`)
    
    var model = {}

    //db연결
    var sqlCount = 'SELECT COUNT(*) AS cnt  FROM v20_main'
    db.query(sqlCount ,(err , result)=>{
        if(err) {
            console.log(err);
            res.status(500).send('서버가 응답이 없습니다.')
        }else{
            console.log(`totalRow:${result[0].cont}`)
            var totalRow = result[0].cnt;
            lastPage = totalRow / rowPerPage
            if(totalRow%rowPerPage !=0){

                lastPage++;
            }
            
        }
    var getSql = `SELECT * from v20_main ORDER BY board_no DESC LIMIT ?.?`
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


router.post('/topic/add',(req, res)=>{
    console.log(req.body)
    var sno = 30004;
    var name = req.body.name;
    var joinDate = req.body.joinDate;
    var address = req.body.address;
    var phone = req.body.phone;
    var hName = req.body.hName;     
    var cardYN = req.body.cardYN;
    var wishNo = req.body.wishNo;
    var clubNo = req.body.clubNo;
    var memo = req.body.memo;

    var sql = 'INSERT INTO main (sno, name , joinDate,address, phone, hName,dmYN,cardYN,wishNo,clubNo,memo  )  VALUES (?, ?, ?,? , ?, ?,? , ?, ?,? , ? )'
    params = [sno, name , joinDate,address, phone, hName,dmYN,cardYN,wishNo,clubNo,memo ];

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

router.get('/topic/:id/edit' , (req, res)=>{
    var sql = "SELECT * FROM topic";
    db.query(sql, (err, results)=>{
        var ids = req.params.id
        if(ids){
        var sql = `SELECT * FROM topic where id=${ids}`;
        db.query(sql, (err, result)=>{
               
            if(err){
                console.log(err);
                res.status(500).send('Internal Server error')
            } 
            
            else {
                console.log(result);
                res.render('edit' , {datas:results , data:result[0]})
            }
        })
    }
    else{
        console.log(err);
        res.send("There is No id")
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