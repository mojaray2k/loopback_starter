'use strict';

module.exports = function(Cat) {

  /**
   * An Operational 
   * Reference: https://loopback.io/doc/en/lb3/Operation-hooks
   */
  Cat.observe('before save', (context, next) => {
    if(context.instance) context.instance.updated = new Date();
    next();
  });

  // 
  /**
   * A Remote hook
   * Reference: https://loopback.io/doc/en/lb3/Remote-hooks.html
   */
  Cat.afterRemote('findById', (context, cat, next) => {
    cat.description = cat.name + 'is' + cat.age + 'years old and is a ' + cat.bread;
    next();
  });

  // Remote Method
  Cat.adoptable = (id, cb) => {
    Cat.findById(id, (err, cat) => {
      if(err) return cb("Error", null);
      if(!cat) return cb("Cat not found", null);
      let canAdobpt = false;
      if(cat.breed != 'tabbe' || (cat.age >= 2))
      canAdobpt = true;
      cb(null, canAdobpt);
    })
  };

  /**
   * Register a Remote method
   * https://loopback.io/doc/en/lb3/Remote-methods.html
   */
  Cat.remoteMethod('adoptable', {
    accepts: {arg: 'id', type: 'any'},
    returns: {arg: 'adoptable', type:'boolean'}
  });

  Cat.validatesInclusionOf('gender', {'in':['male', 'female']});
  Cat.validatesNumericalityOf('age', {int:true});
  Cat.validate('age', function(err){
    if(this.age <= 0) err();
  },{message: 'Age must be positive'});
};
