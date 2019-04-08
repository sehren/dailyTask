module.exports = (app,mysql,knex)=>{
  function check(req,res){
    if(!req.session.isLog){
      res.redirect('/')
    }
  }
  app.get('/task', function(req, res, next) {
    check(req,res)
    knex.select('*').from('task').where('idEmployee',req.session.data.id).orderBy('date','desc').then(function(task){
      res.render('employee/task',{task : task});
    })
  });
  app.get('/profile',function(req,res,next){
    check(req,res)
    knex.select('*').from('employee').where('id',req.session.data.id).then(function(data){
      res.render('employee/profile',{id:data[0].id,name : data[0].name,address : data[0].address});
    })
  })
  app.post('/editProfile',function(req,res){
    check(req,res)
    data = req.body
    knex('employee').update({name : data.name,address : data.address}).where('id',data.id).then(function(resp){
      res.redirect('/profile')
    })
    
  })
  app.get('/deleteTask/:id',function(req,res){
    check(req,res)
    knex('task').where('id',req.params.id).delete().then(function(resp){
      if(resp){
        res.redirect('/task')
      }
    })
  })
  app.post('/addTask',function(req,res){
    check(req,res)
    data = req.body
    data.date = new Date()
    data.idEmployee = req.session.data.id
    knex('task').insert(data).then(function(resp){
      if(resp){
        res.redirect('/task')
      }
    })
  })
  app.post('/editTask',function(req,res){
    check(req,res)
    data =req.body
    knex('task').update({task:data.task,date:new Date()}).where('id',data.id).then(function(resp){
      if(resp){
        res.redirect('/task')
      }
    })
  })

}
