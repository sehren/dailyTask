module.exports = (app,mysql,knex)=>{
    var bcrypt = require('bcryptjs');
    app.post('/api/register/:type',function(req,res){
      data = req.body
      if(req.params.type == 'employee'){
        knex.select('*').from('employee').where('email',data.email).then(function(emp){
          if(emp[0]==null){
            bcrypt.hash(data.password, 10, function(err, password) {
              data.password = password
              knex('employee').insert(data).then(function(resp){
                res.send({isReg : true,id: resp})
              })
            });
          }
          else{
            res.send({isReg : false,err : 'Email sudah terdaftar'})
          }
        })
      }
      else if(req.params.type = 'manager'){
        knex.select('*').from('manager').where('email',data.email).then(function(emp){
          if(emp[0]==null){
            bcrypt.hash(data.password, 10, function(err, password) {
              data.password = password
              knex('manager').insert(data).then(function(resp){
                res.send({isReg : true,id: resp})
              })
            });
          }
          else{
            res.send({isReg : false,err : 'Email sudah terdaftar'})
          }
        })
      }
    })
    app.post('/api/login/:type',function(req,res){
        data = req.body
        if(req.params.type == 'employee'){
            knex.select('*').from('employee').where('email',data.email).then(function(employee){
                if(employee[0]!=null){
                  bcrypt.compare(data.password,employee[0].password, function(err, result) {
                    if(result){
                      delete data.password
                      data.id = employee[0].id
                      res.send({isLog : true,id : employee[0].id})
                    }
                    else{
                      res.send({isLog : false,err : 'Password Salah'})
                    }
                  })
                }
                else{
                  res.send({isLog : false,err : 'Data yang anda masukkan salah'})
                }
            })
        }
        else if(req.params.type == 'manager'){
            knex.select('*').from('manager').where('email',data.email).then(function(manager){
                if(manager[0]!=null){
                  bcrypt.compare(data.password,manager[0].password, function(err, result) {
                    if(result){
                      delete data.password
                      data.id = manager[0].id
                      res.send({isLog : true,data : data})
                    }
                    else{
                      res.send({isLog : false,err : 'Password Salah'})
                    }
                  })
                }
                else{
                  res.send({isLog : false,err : 'Data yang anda masukkan salah'})
                }
            })
        }
    })
    app.post('/api/employee',function(req,res){
        knex.select('*').from('task').where('idEmployee',req.body.id).then(function(task){
            daily = 0
            today = new Date().toLocaleDateString()
            task.forEach(i => {
              if(i.date.toLocaleDateString() == today){
                daily++
              }
            });
            res.send({total : task.length,daily : daily})
        })
    })
    app.post('/api/task',function(req,res){
        knex.select('*').from('task').where('idEmployee',req.body.id).orderBy('date','desc').then(function(task){
            res.send({task : task});
        })
    })
    app.post('/api/delete',function(req,res){
        knex('task').where('id',req.body.id).delete().then(function(resp){
            if(resp){
              res.send({status : true})
            }
        })
    })
    app.post('/api/addTask',function(req,res){
        data = {idEmployee : req.body.id,task : req.body.task,date : new Date()}
        knex('task').insert(data).then(function(resp){
            if(resp){
              res.send({status : true})
            }
        })
    })
    app.post('/api/editTask',function(req,res){
        data = {id : req.body.id,task : req.body.task,date : new Date()}
        knex('task').update({task:data.task,date:data.date}).where('id',data.id).then(function(resp){
            if(resp){
              res.send({status:true})
            }
        })
    })
    app.post('/api/profile',function(req,res){
        knex.select('name','address').from('employee').where('id',req.body.id).then(function(resp){
            res.send({name : resp[0].name,address : resp[0].address})
        })
    })
    app.post('/api/editProfile',function(req,res){
        data = req.body
        knex('employee').update({name : data.name,address : data.address}).where('id',data.id).then(function(resp){
            if(resp){
                res.send({status:true})
            }
        })
    })
    

    //manager


    app.get('/api/manager',function(req,res){
      knex.select('*').from('task').then(function(task){
        daily = 0
        today = new Date().toLocaleDateString()
        task.forEach(i => {
          if(i.date.toLocaleDateString() == today){
            daily++
          }
        });
        res.send({total : task.length,daily : daily})
      })
    })
    app.get('/api/daily',function(req,res){
      knex('task').join('employee','task.idEmployee','=','employee.id').select('*').orderBy('date','desc').then(function(task){
        daily = []
        today = new Date().toLocaleDateString()
        task.forEach(i => {
          if(i.date.toLocaleDateString() == today){
            daily.push(i)
          }
        });
        res.send({task : daily})
      })
    })
    app.get('/api/total',function(req,res){
      knex('task').join('employee','task.idEmployee','=','employee.id').select('*').orderBy('date','desc').then(function(task){
        res.send({task : task})
      })
    })
    app.post('/api/search',function(req,res){
      knex('task').join('employee','task.idEmployee','=','employee.id').select('*').where('name','like','%'+req.body.name+'%').orderBy('date','desc').then(function(task){
        res.send({task : task})
      })
    })
}