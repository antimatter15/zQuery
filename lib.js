function $(els){
  var lastres = {},
      getter = function(prop){
        return function(){
          return (lastres[prop] = ((typeof els[0][prop] == 'function') ?
            function(){
              var argz = arguments;
              return els.map(function(el){
                return el[prop].apply(el, argz);
              })
            } :
            els.map(function(el){
              return el[prop]
            }).join(' ')));
        }
      },
      setter = function(prop){
        return function(val){
          console.log(lastres);
          if(lastres[prop]){
            val = val.substr((lastres[prop]+'').length);
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
        if(els.__defineGetter__){
          els.__defineGetter__(alias, getter(i));
          els.__defineSetter__ && els.__defineSetter__(alias, setter(i));
        }else{
          Object.defineProperty && Object.defineProperty(els, alias, {
            get: getter(i),
            set: setter(i)
          })
        }
      },
      shorthand = {
        on: 'addEventListener'
      };
  if(typeof els == 'string'){
    els = [].slice.call(document.querySelectorAll(els), 0)
  }else if(els instanceof Element){
    els = [els]
  } //if it's an array, it'll slip through.
  for(var i in els[0]) addProp(i,i);
  for(var i in shorthand) addProp(i,shorthand[i]);
  els.find = function(sel){
    var out = [];
    els.forEach(function(el){
      out = out.concat([].slice.call(el.querySelectorAll(sel), 0))
    });
    return $(out);
  }
  return els;
}
