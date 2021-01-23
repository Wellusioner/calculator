$(document).ready(function(){
  const input = $('input');
  var position = [],
      state = [];
  
  $('.clear').on('click', function(){
    clearFunc();
  });
  
  $('.remove').on('click', function(){
    removeLast();
  });
  
  $('.numbers').on('click', function(){
    numFunc($(this).text());
  });
  
  $('.operation').on('click', function(e){
    operFunc($(this).text());
  });
  
  $('.dot').on('click', function(){
    dotFunc($(this).text());
  });
  
  $('.calculate').on('click', function(){
    calcFunc();
  });
  
  window.addEventListener('keyup', function(e){
    const key = e.key.toLowerCase();
    
    if(key === 'c'){
      clearFunc();
    } else 
    if(key === 'backspace'){
      removeLast();
    } else
    if(key === '.'){
      dotFunc(key);
    } else
    if(typeof parseInt(key) === 'number' && 0 <= parseInt(key) && parseInt(key) <= 9){
      numFunc(key);
    } else
    if(key === '/' || key === '*' || key === '-' || key === '+'){
      operFunc(key);
    }
    
  });
  
  function calcFunc(){
    var value = input.val().trim();
    const last = value.slice(value.length - 1);
    
    if(!Number.isInteger(parseInt(last))){
      value = value.slice(0, value.length - 1);
    }
    
    if(value === ''){
      alert('Raqam kiriting');
    } else 
    if(!position.length){
      input.val(value);
    } else {
      
      var isEmpty = true;
      
      while(isEmpty){
        
        if(value.indexOf('/') > -1){
          
          const ps = value.indexOf('/');
          value = handleResult(value, ps, '/*-+', '/');
          
        } else 
        if(value.indexOf('*') > -1){
          
          const ps = value.indexOf('*');
          value = handleResult(value, ps, '*-+', '*');
          
        }else
        if(value.indexOf('-') > -1 && value[0] !== '-'){
          
          const ps = value.indexOf('-');
          value = handleResult(value, ps, '-+', '-');
          
        }else
        if(value.indexOf('+') > -1){
          
          const ps = value.indexOf('+');
          value = handleResult(value, ps, '+', '+');
        }else {
          isEmpty = false;
        }       
        
      }
      
      input.val(value);
    }
  }
  
  function handleResult(value, ps, data, type){
    const nextIndex = findNextIndex(value, data, ps);
    const prevIndex = findPrevIndex(value, data, ps);

    const nextEl = parseFloat(value.slice(ps+1, nextIndex));
    const prevEl = parseFloat(value.slice(prevIndex > 0 ? prevIndex+1 : 0, ps));

    const result = (
      function(){
        switch(type){
          case '/':
            return prevEl / nextEl;
          case '*':
            return prevEl * nextEl;
          case '-':
            return prevEl - nextEl;
          case '+':
            return prevEl + nextEl;
          default:
            return ''
        }
      }
    )();
    
    const start = value.slice(0,(prevIndex > 0 ? prevIndex + 1 : 0));
    const end = value.slice(nextIndex);
    
    if(start[start.length - 1] === '+' && result[0] === '-'){
      start = start.slice(0, start.length - 1);
    }

    return value = start + '' + result + '' + end;
  }
  
  
  function findNextIndex(str, data, index){
    var nextIndex = str.length;
    for(var i  = index + 1; i < str.length; i++){
      if(data.indexOf(str[i]) > -1){
        return i;
      }
    }

    return nextIndex;
  }

  function findPrevIndex(str, data, index){

    var prevIndex = 0;
    for(var i  = 0; i < index; i++){
      if(data.indexOf(str[i])){
        prevIndex = i;
      }
    }

    return prevIndex
  }
  
  
  function clearFunc(){
    input.val('');
    toggleButton();
    position = [];
    state = [];
  }
  
  function operFunc(temp){
    const value = input.val().trim();
    const last = value.slice(value.length - 1);
    
    if(
      value !== '' &&
      last !== '+' && 
      last !== '-' &&
      last !== '*' &&
      last !== '/' &&
      last !== '.'
    ){
      const text = value + temp;
      input.val(text);
      position.push(input.val().length - 1);
      state.push(temp);
      toggleButton();
    }

  }
  
  function numFunc(temp){
    const value = input.val().trim();
    const last = value.slice(value.length - 1);
    if(last === '/' && temp === '0'){
      alert("Sonni nolga bo'lish mumkin emas");
      return
    }

    const text = value + temp;
    input.val(text);
  }
  
  function dotFunc(temp){
    toggleButton(true);
    
      const value = input.val().trim();
      const last = value.slice(value.length - 1);

      if(value === ''){
        input.val(value + '0.');
      } else if(
        last === '+' || 
        last === '-' ||
        last === '*' ||
        last === '/'
      ){
        input.val(value + '0.');
      } else if(last !== '.'){
        const text = value + temp;
        input.val(text);
      }
  }
  
  function removeLast(){
    const value = input.val().trim();
    const last = value.slice(value.length - 1);

    if(last === '.'){
      toggleButton();
    }else
    if(last === '/' || last === '*' || last === '-' || last === '+'){
      position.pop();
      state.pop();
      
      if(!position.length){
        if(value.indexOf('.') === -1){
          toggleButton();
        }else{
          toggleButton(true);
        }
      } else {
        if(value.indexOf('.', position[position.length - 1]) === -1){
          toggleButton();
        }else{
          toggleButton(true);
        }
      }
      
    }
    
    const res = value.slice(0, value.length - 1);
    input.val(res);
  }
  
  function toggleButton(isActive=false){
    
    if(isActive){
      $('.dot')
      .prop('disabled', true)
      .css({'cursor': 'not-allowed'});
    } else {
      $('.dot')
      .prop('disabled', false)
      .css({'cursor': 'pointer'});
    }
    
  }  
  
  
});







//      if(value.indexOf('/') > -1){
//        
//        position.forEach(function(pos, i){
//          if(value[pos] === '/'){
//
//            var prev, next, start, end;
//
//            if(position[i-1]){
//              prev = parseFloat(value.slice(position[i-1]+1, pos));
//              start = value.slice(0, position[i-1]+1);
//            }else{
//              prev = parseFloat(value.slice(0, pos));
//              start = '';
//            }
//
//            if(position[i + 1]){
//              next = parseFloat(value.slice(pos+1, position[i+1]));
//              end = value.slice(position[i+1]);
//            }else{
//              next = parseFloat(value.slice(pos+1));
//              end = '';
//            }
//
//
//            const division = parseFloat(prev) / parseFloat(next);
//            result = start + division + end;
//          }
//        });
//
//        position = position.filter(function(el){
//          return value[el] !== '/';
//        });
//      }
//        
//      if(value.indexOf('*') > -1){
//        
//        position.forEach(function(pos, i){
//          if(value[pos] === '*'){
//
//            var prev, next, start, end;
//
//            if(position[i-1]){
//              prev = parseFloat(value.slice(position[i-1]+1, pos));
//              start = value.slice(0, position[i-1]+1);
//            }else{
//              prev = parseFloat(value.slice(0, pos));
//              start = '';
//            }
//
//            if(position[i + 1]){
//              next = parseFloat(value.slice(pos+1, position[i+1]));
//              end = value.slice(position[i+1]);
//            }else{
//              next = parseFloat(value.slice(pos+1));
//              end = '';
//            }
//
//            const division = parseFloat(prev) * parseFloat(next);
//            result = start + division + end;
//          }
//        });
//
//        position = position.filter(function(el){
//          return value[el] !== '*';
//        });
//        
//      }
        
//      if(value.indexOf('-') > -1){
//        
//        position.forEach(function(pos, i){
//          if(value[pos] === '-'){
//
//            var prev, next, start, end;
//
//            if(position[i-1]){
//              prev = parseFloat(value.slice(position[i-1]+1, pos));
//              start = value.slice(0, position[i-1]+1);
//            }else{
//              prev = parseFloat(value.slice(0, pos));
//              start = '';
//            }
//
//            if(position[i + 1]){
//              next = parseFloat(value.slice(pos+1, position[i+1]));
//              end = value.slice(position[i+1]);
//            }else{
//              next = parseFloat(value.slice(pos+1));
//              end = '';
//            }
//
//            const division = parseFloat(prev) - parseFloat(next);
//            result = start + division + end;
//          }
//        });
//
//        position = position.filter(function(el){
//          return value[el] !== '-';
//        });
//        
//      }
        
//      if(value.indexOf('+') > -1){
//        
//        position.forEach(function(pos, i){
//          if(value[pos] === '+'){
//
//            var prev, next, start, end;
//
//            if(position[i-1]){
//              prev = parseFloat(value.slice(position[i-1]+1, pos));
//              start = value.slice(0, position[i-1]+1);
//            }else{
//              prev = parseFloat(value.slice(0, pos));
//              start = '';
//            }
//
//            if(position[i + 1]){
//              next = parseFloat(value.slice(pos+1, position[i+1]));
//              end = value.slice(position[i+1]);
//            }else{
//              next = parseFloat(value.slice(pos+1));
//              end = '';
//            }
//
//            const division = parseFloat(prev) + parseFloat(next);
//            result = start + division + end;
//          }
//        });
//
//        position = position.filter(function(el){
//          return value[el] !== '+';
//        });
//      }