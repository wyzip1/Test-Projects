export default function (attrsString = '') {
  if(attrsString.trim() === '') return [];
  attrsString = attrsString.trim() + ' ';
  let attrs = [];
  let point = 0;
  let isIn = false;

  for(let i = 0; i < attrsString.length; i++){
    if (attrsString[i] === '"') isIn = !isIn;
    else if(!isIn && attrsString[i] === ' '){
      attrs.push(attrsString.substring(point, i));
      point = i;
    }
  }

  return attrs.map(item => ({
    name: item.split('=')[0].trim(),
    value: formatValue(item.split('=')[1])
  }));
}


function formatValue(value) {
  if(!value) return true;
  return value.trim().replace(/\"/g, '');
}