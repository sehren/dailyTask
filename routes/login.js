module.exports = (app,mysql,knex)=>{
  var bodyParser = require('body-parser');
  var bcrypt = require('bcryptjs');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.get('/', function(req, res){
    if(req.session.auth=='employee'){
      knex.select('*').from('task').where('idEmployee',req.session.data.id).then(function(task){
        daily = 0
        today = new Date().toLocaleDateString()
        task.forEach(i => {
          if(i.date.toLocaleDateString() == today){
            daily++
          }
        });
        res.render('employee/dashboard',{total : task.length,daily : daily})
      })
    }
    else if(req.session.auth == 'manager'){
      knex.select('*').from('task').then(function(task){
        daily = 0
        today = new Date().toLocaleDateString()
        task.forEach(i => {
          if(i.date.toLocaleDateString() == today){
            daily++
          }
        });
        res.render('manager/dashboard',{total : task.length,daily : daily})
      })
    }
    else{
      res.render("home",{err:req.flash('err')})
    }
  });

  app.get('/register/manager',function(req,res){
    if(req.session.isLog)
      res.redirect('/')
    res.render('registerMgr',{err:req.flash('err')})
  })

  app.get('/register/employee',function(req,res){
    if(req.session.isLog)
      res.redirect('/')
    res.render('registerEmp',{err:req.flash('err')})
  })

  app.post('/login/:type',function(req,res){
    data = req.body
    if(req.session.isLog)
      res.redirect('/')
    if(req.params.type == 'manager'){
      knex.select('*').from('manager').where('email',data.email).then(function(manager){
        if(manager[0]!=null){
          bcrypt.compare(data.password,manager[0].password, function(err, result) {
            if(result){
              data.password = manager[0].password
              req.session.auth = 'manager'
              req.session.isLog = true
              req.session.data = data
              res.redirect('/')
            }
            else{
              req.flash('err','password salah')
              res.redirect('/')
            }
          })
        }
        else{
          req.flash('err','Data yang anda masukkan salah')
          res.redirect('/')
        }
      })
    }
    else if(req.params.type == 'employee'){
      knex.select('*').from('employee').where('email',data.email).then(function(employee){
        if(employee[0]!=null){
          bcrypt.compare(data.password,employee[0].password, function(err, result) {
            if(result){
              data.password = employee[0].password
              data.id = employee[0].id
              req.session.auth = 'employee'
              req.session.isLog = true
              req.session.data = data
              res.redirect('/')
            }
            else{
              req.flash('err','password salah')
              res.redirect('/')
            }
          })
        }
        else{
          req.flash('err','Data yang anda masukkan salah')
          res.redirect('/')
        }
      })
    }
  })
  app.post('/register/:type',function(req,res){
    data = req.body
    if(req.session.isLog)
      res.redirect('/')
    if(req.params.type == 'employee'){
      knex.select('*').from('employee').where('email',data.email).then(function(emp){
        if(emp[0]==null){
          bcrypt.hash(data.password, 10, function(err, password) {
            data.password = password
            knex('employee').insert(data).then(function(resp){
              data.id = resp[0]
              req.session.auth = "employee"
              req.session.isLog = true
              req.session.data = data
              res.redirect('/')
            })
          });
        }
        else{
          req.flash('err','email sudah terdaftar')
          res.redirect('/register/employee')
        }
      })
    }
    else if(req.params.type = 'manager'){
      knex.select('*').from('manager').where('email',data.email).then(function(emp){
        if(emp[0]==null){
          bcrypt.hash(data.password, 10, function(err, password) {
            data.password = password
            knex('manager').insert(data).then(function(resp){
              req.session.auth = "manager"
              req.session.isLog = true
              req.session.data = data
              res.redirect('/')
            })
          });
        }
        else{
          req.flash('err','email sudah terdaftar')
          res.redirect('/register/manager')
        }
      })
    }
  })
  app.get('/logout',function(req,res){
    req.session.destroy(function (err) {
      if(!err)
        res.redirect('/');
    })
  })
}