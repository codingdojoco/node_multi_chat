
/*
 * GET users listing.
 */

exports.list = function(req, res){

	var obj = {
		name: 'Dojo',
		location: 'Seattle WA'
	}

  	res.send(obj).send(200);
};