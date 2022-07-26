const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Address = require('../models/address');
const Task = require('../models/task')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    ErrPass:false,
    isNotName: false
  });
};
exports.postUserCountry = (req, res, next) => {
  if(req.body.countryId){
    Address.find({isCitey:true, country_id :req.body.countryId}).then(couns=>{
      if(couns.length==0){
        res.redirect('/');
      }else{
        res.render('auth/signup', {
          path: '/signup',
          cities:couns,
          pageTitle: 'Signup',
          isAuthenticated: false
        });
      }
    }).catch(err => console.log(err));
  }else{
    res.render('auth/country', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false
    });
  }
};

exports.getUserCountry = (req, res, next) => {
  Address.find({isCitey:false}).then(couns=>{
      res.render('auth/country', {
        path: '/signup',
        couns:couns,
        pageTitle: 'Signup',
        isAuthenticated: false,
        err: req.err||false,
        errMsg: req.errMsg||''
      });
  }).catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;
  User.findOne({ name: name })
    .then(user => {
      if (!user) {
        return res.render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          isAuthenticated: false,
          ErrPass:false,
          isNotName: true
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(() => {
              res.redirect('/toDo');
            });
        }else{
          res.render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            isAuthenticated: false,
            ErrPass:true,
            isNotName: false
          });
        }
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.getToDo = async(req, res, next) =>{
  const tasks = await Task.find({user:req.session.user._id});
  
  res.render('toDo/toDo', {
    path: '/toDo',
    pageTitle: 'tasks',
    isAuthenticated: true,
    user:req.session.user,
    tasks:tasks
  });
}

exports.postToDo = async (req, res, next) =>{
  const task = new Task({
    title:req.body.title,
    user:req.user._id
  });
  await task.save();
  const user = await User.findById({_id: req.user._id})
  await user.tasks.push(task.id);
  await user.save();
  res.redirect('/toDo');
}
exports.getEditToDo=async (req, res, next) =>{
  const task = await Task.findById({_id: req.body.taskId});
  console.log(task.user._id, req.session.user._id)
  if(task.user._id.toString() == req.session.user._id.toString()){
    res.render('toDo/editTask', {
      path: '/toDo',
      pageTitle: 'edit task',
      isAuthenticated: true,
      user:req.session.user,
      task:task
    });
  }
}
exports.postEditToDo=async (req, res, next) =>{
  const task = await Task.findById({_id: req.body.taskId});

  if(task.user._id.toString() == req.session.user._id.toString()){
    const edTask = {
      title:req.body.title,
      state:(req.body.state == 'true')||false
    }
    await Task.updateOne({_id:req.body.taskId},edTask);
    res.redirect('/toDo');

  }else{
    res.redirect('/err');
  }
}

exports.deleteToDo = async(req, res, next) => {

  const task = await Task.findById({_id: req.body.taskId})
    
    if(task.user._id.toString() == req.session.user._id.toString()){
      const user = await User.findById({_id: task.user})
      user.tasks.pull(task.id);
      await user.save();
      await Task.findByIdAndDelete(req.body.taskId);
      
      res.redirect('/toDo');
    }else{
      res.redirect('/err');
    }

}

exports.postSignup = async(req, res, next) => {

  const name = req.body.name;
  const password = req.body.password;
  const citey = req.body.citey;
  const country = await Address.findById(citey);
  User.findOne({ name: name })
    .then(userDoc => {
      if (userDoc) {
        return this.getUserCountry({err:true,errMsg:"this name is Exist"},res);
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            name: name,
            password: hashedPassword,
            adress: {
              country:country.country_id,
              citey:citey
            }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
