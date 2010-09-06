function $(selector){
  var els = [].slice.call(document.querySelectorAll(selector), 0),
      obj = {},
      getter = function(prop){
        return function(){
          return (typeof els[0][prop] == 'function') ?
            function(){
              var argz = arguments;
              return els.map(function(el){
                el[prop].apply(el, argz);
              })
            } :
            els.map(function(el){
              return el[prop]
            }).join(' ');
        }
      },
      setter = function(prop){
        return function(val){
          els.forEach(function(el){
            el[prop] = val;
          })
        }
      },
      addProp = function(alias, i){
        obj.__defineGetter__ && obj.__defineGetter__(alias, getter(i));
        obj.__defineSetter__ && obj.__defineSetter__(alias, setter(i));
        Object.defineProperty && Object.defineProperty(obj, alias, {
          get: getter(i),
          set: setter(i)
        })
      },
      shorthand = {
        on: 'addEventListener'
      };
  for(var i in els[0]) addProp(i,i);
  for(var i in shorthand) addProp(i,shorthand[i]);
  return obj;
}
