function $(selector){
  var els = [].slice.call(document.querySelectorAll(selector), 0),
      obj = {},
      lastres = {},
      getter = function(prop){
        return function(){
          return (lastres[prop] = ((typeof els[0][prop] == 'function') ?
            function(){
              var argz = arguments;
              return els.map(function(el){
                el[prop].apply(el, argz);
              })
            } :
            els.map(function(el){
              return el[prop]
            }).join(' ')));
        }
      },
      setter = function(prop){
        return function(val){
          if(lastres[prop]){
            val = val.substr((lastres+'').length);
            els.forEach(function(el){
              el[prop] += val;
            })
          }else{
            els.forEach(function(el){
              el[prop] = val;
            })
          }
        }
      },
      addProp = function(alias, i){
        if(obj.__defineGetter__){
          obj.__defineGetter__(alias, getter(i));
          obj.__defineSetter__ && obj.__defineSetter__(alias, setter(i));
        }else{
          Object.defineProperty && Object.defineProperty(obj, alias, {
            get: getter(i),
            set: setter(i)
          })
        }
      },
      shorthand = {
        on: 'addEventListener'
      };
  for(var i in els[0]) addProp(i,i);
  for(var i in shorthand) addProp(i,shorthand[i]);
  return obj;
}
