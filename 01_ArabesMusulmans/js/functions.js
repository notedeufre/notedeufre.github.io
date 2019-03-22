var findCountryByLabel = function(label,countries){

	for (var c in countries )
	{
		if ( countries[c].label == label )
		{
			return countries[c] ; 
			break  ;
		}
	}
}

var sortByKey = function( array, key , direction) {
    var direction ; 
    
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if ( direction == undefined )
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        else if ( direction == 'ASC' )
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

var toFloat = function ( _str ){

	let int = _str ; 

	int = int.replace(/\s/g, "") ; 
	int = int.replace(',','.') ; 

	return parseFloat( int ) ; 
}

// sort on key values
var keysrt = function (key,desc) {
  return function(a,b){
   return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
  }
}


var clone_array = function ( array_data )
{ 
  if ( array_data == undefined || array_data == null || array_data == []) return [] ; 
  return Array.prototype.slice.call( array_data ) ; 
}