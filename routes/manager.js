module.exports = (app)=>{
  function check(req,res){
    if(!req.session.isLog){
      res.redirect('/')
    }
  }
  app.get('/daily',function(req,res,next){
    check(req,res)
    knex('task').join('employee','task.idEmployee','=','employee.id').select('*').orderBy('date','desc').then(function(task){
      daily = []
      today = new Date().toLocaleDateString()
      task.forEach(i => {
        if(i.date.toLocaleDateString() == today){
          daily.push(i)
        }
      });
      res.render('manager/daily',{daily : daily})
    })
  })
  app.get('/total',function(req,res,next){
    check(req,res)
    knex('task').join('employee','task.idEmployee','=','employee.id').select('*').orderBy('date','desc').then(function(task){
      res.render('manager/total',{task})
    })
  })
  app.post('/searchEmp',function(req,res){
    check(req,res)
    knex('task').join('employee','task.idEmployee','=','employee.id').select('*').where('name','like','%'+req.body.name+'%').orderBy('date','desc').then(function(task){
      res.render('manager/total',{task})
    })
  })
}
