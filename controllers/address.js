const Address = require('../models/address');
const User = require('../models/user');


exports.getIndex = (req, res, next) => {
  Address.find({isCitey:false})
    .then(Countries => {
      res.render('address/index', {
        countryId:false,
        counts: Countries,
        pageTitle: 'Countries',
        path: '/',
        isCitey: false
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getcities = (req, res, next) => {
  const coId = req.params.id;
  Address.find({isCitey:true, country_id :coId})
    .then(cities => {
      res.render('address/index', {
        countryId:coId,
        counts: cities,
        pageTitle: "cities",
        path: '/products',
        isCitey: true
      });
    })
    .catch(err => console.log(err));
};



exports.postAddCitey = (req, res, next) => {
  const nameEn = req.body.nameEn;
  const imageUrl = req.body.imageUrl;
  const nameAr = req.body.nameAr;
  const countryId = req.body.countryId;

  console.log(countryId)

  Address.findById(countryId)
    .then(Country => {
      if(!Country){
        res.redirect('/');
      }else{
        console.log(Country)
        const address = new Address({
          nameEn:nameEn,
          nameAr:nameAr,
          isCitey:true,
          imageUrl:imageUrl,
          country_id:Country
        });
        address
          .save()
          .then(result => {
            // console.log(result);
            console.log('Created citey');
            res.redirect(`/countries/${Country._id}`);
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    });



  
  
};

exports.getAddCountry = (req, res, next) => {
  res.render('address/country', {
    pageTitle: "add country",
    isCitey: false,
    path: '/products'
  });
};

exports.postAddCountry = (req, res, next) => {
  const nameEn = req.body.nameEn;
  const imageUrl = req.body.imageUrl;
  const nameAr = req.body.nameAr;

  const address = new Address({
    nameEn:nameEn,
    nameAr:nameAr,
    isCitey:false,
    imageUrl:imageUrl
  });
  address
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created country');
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
  
};




exports.getEditAddress =async (req, res, next) => {
  const addrId = req.body.country;
  Address.findById(addrId).then(addr=>{
    res.render('address/editAddr', {
      pageTitle: "edit country",
      country: addr,
      path: '/products'
    });
  })
  
}

exports.postEditAddress =async (req, res, next) => {
  console.log(req.body)
  Address.updateOne({ _id: req.body.countryId },req.body).then(()=>{
    Address.findById(req.body.countryId).then(addr=>{
      if(addr.isCitey){
        res.redirect(`/countries/${addr.country_id}`)
      }else{
        res.redirect("/")
      }
    })
    })
}

exports.postDeleteAddress =async (req, res, next) => {
  const addressId = req.body.addressId;
  
  try {
    const addr = await Address.findById({_id: req.body.addressId})
    
    
      if(addr.isCitey){
        
        await User.updateMany({"adress.citey": addressId}, { $set: {"adress.citey":null}  });

        await Address.deleteOne({_id:addressId});
        
        return res.redirect(`/countries/${addr.country_id}`);
    }else{
      await Address.deleteMany({country_id:addressId});
      await Address.deleteOne({_id:addressId});
      await User.updateMany({ "adress.country": addressId}, { $set: {adress: {country: null, citey: null} } });
      return res.redirect(`/`);
    }

  }catch (err) {
    res.redirect(`/`);
    }
  
  
  
};
