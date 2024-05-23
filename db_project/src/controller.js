const pool=require("../db");
const queries=require("./queries")


const getAllClients=(req,res)=>{

    pool.query(queries.getAllClients,(error,results)=>{
        if(error) throw error
        res.status(200).json(results.rows);
    });
};

const getMyRequest=(req,res)=>{

    const uid=parseInt(req.params.uid);
    pool.query(queries.getMyRequest,[uid],(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows)
    })
    
};

const postMyRequest= (req , res) =>{
    
    const {uid1,uid2,myBooks,hisBooks,state,date}=req.body;

    pool.query(queries.postMyRequest,[uid1,uid2,date],(error,results)=>{
        if(error)
            throw error;
        
        
        const requestId = results.rows[0].rid;
        const mergedArr=myBooks.concat(hisBooks);

        mergedArr.forEach(element => {
            
            pool.query(queries.insertBookRequestQuery,[requestId,element],(error,results)=>{

                if(error)
                    throw error;
            })
        });
        
        res.status(200).send("done adding book request")
        
    })
}

const getBooksByFilter=(req,res)=>{
    const cats=req.params.cats;
    const uid=req.params.uid;
    const catsArr=cats.split('*')
    let s=queries.getBooks
    for(let i=0;i<catsArr.length;i++){
        
        s+=(' category =\'')
        s+=catsArr[i];
        s+='\''
        if(i!=catsArr.length-1)
            s+=' or ';
        console.log(s)
    }
    s+=' ) ';
    s+=';';
    console.log(s);

    pool.query(s,[uid],(error,result)=>{

        if(error)
            throw error;


        res.send(result.rows)

    })
    
    
}


const deleteBook=(req,res)=>{
    const bid = parseInt(req.params.bid);
    
    pool.query(queries.deleteBook, [bid],(error,results)=>{
        if(error) throw error
        res.status(200).send("Book Deleted successfuly");
    });

};

const addBook=(req,res)=>{
    const uid = parseInt(req.params.uid);
    const {title,description,image_link,category,bstate} = req.body ;
    
    pool.query(queries.addBook, [title,description,image_link,category,bstate,uid], (error,results)=>{
        if(error) throw error
        res.status(201).send("Book Added Successfully"); 
    });
};

const updateBook=(req,res)=>{
    const bid = parseInt(req.params.bid);
    const { title,description,image_link,category,bstate} = req.body ;
    
    pool.query(queries.updateBook, [title,description,image_link,category,bstate,bid], (error,results)=>{
        if(error) throw error
        res.status(201).send("Book Updated Successfully");
        
    });
};


const addFav=(req,res)=>{
    const uid = parseInt(req.params.uid);
    const {uid2} = req.body ;
    
    pool.query(queries.addFav, [uid,uid2], (error,results)=>{
        if(error) throw error
        res.status(201).send("User Added to Favorites Successfully");
    });
};

const getMyBooks=(req,res)=>{

    const uid=parseInt(req.params.uid);
    pool.query(queries.getMyBooks,[uid],(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows)
    })
    
};


const acceptRequest=(req,res)=>{
    const rid=parseInt(req.params.rid);
    pool.query (queries.updateAcceptAfterAcceptRequest,[rid],(error,result)=>{
        if(error) throw error
        
    });

    pool.query(queries.updateDeclinedAfterAcceptRequest,[rid],(error,result)=>{

        if(error) throw error;

    })

    pool.query(queries.deleteBooksAfterAcceptRequest,[rid],(error,result)=>{
        if(error) throw error;

    })

    res.status(200).send("done successfully");

};

const getAllBooksU=(req,res)=>{
    const uid = req.params.uid;
    pool.query(queries.getAllBooksU, [uid], (error,results)=>{
        if(error) throw error
        res.status(200).json(results.rows);
        
    });
};

const getBooksOfFav=(req,res)=>{

    const uid1 = req.params.uid1;
    pool.query(queries.getBooksOfFav, [uid1], (error, results) => {
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};

const getBooksBySearch=(req,res)=>{
    const uid = req.params.uid;
    const Kword = req.params.Kword;
    pool.query(queries.getBooksBySearch, [uid,`%${Kword}%`], (error, results) => {
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};

const makeThemClicked=(req,res)=>{

    const uid=req.params.uid;

    pool.query(queries.makeThemClicked,[uid],(error,results)=>{
        if(error)throw error;

        res.status(200).send("very good");    

    })


}




module.exports={
    getAllClients,
    getMyRequest,
    postMyRequest,
    getBooksByFilter,
    deleteBook,
    addBook,
    updateBook,
    addFav,
    getMyBooks,
    acceptRequest,
    getAllBooksU,
    getBooksOfFav,
    getBooksBySearch,
    makeThemClicked,
    

}