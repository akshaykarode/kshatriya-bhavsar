module.exports = {
	mapIINtoFamilyMember : function(fromNse_iins,fromDb_clients){
		console.log('fromDb_clients',fromDb_clients.length);
		var insert=[],update=[],unmatched=[];
		/* filter matched objects */
		for(var i=0;i<fromDb_clients.length;i++){
			var all = _.filter(fromNse_iins, function(obj) { return (fromDb_clients[i].pan!="" && obj.FH_PAN_NO == fromDb_clients[i].pan) })
			if(all.length>0){ // Pan Match 
				// console.log("pan match : ",fromDb_clients[i])
				if(fromDb_clients[i].iin==null){ // but dont have iin - now insert in db mapping
					console.log("not in db",fromDb_clients[i])
					console.log("all",all)
					_.forEach(all,function(o){
						fromDb_clients[i].iin = o.CUSTOMER_ID
						_.assign(fromDb_clients[i],o)
						insert.push(_.clone(fromDb_clients[i]));
					})
				}else{ // already in db - so update in db mapping
					console.log("already in db",fromDb_clients[i])
					console.log("all",all)
					_.forEach(all,function(o){
						if(fromDb_clients[i].iin==o.CUSTOMER_ID){
							_.assign(fromDb_clients[i],o)
							update.push(_.clone(fromDb_clients[i]));
						}
					})
					console.log("update.length",update.length)
				}
			}
		}
		/* filter un-matched objects */
		for(var i=0;i<fromNse_iins.length;i++){
      var fi = _.findIndex(fromDb_clients, function(o) { return o.iin == fromNse_iins[i].CUSTOMER_ID; });
      if(fi==-1){
      	unmatched.push(fromNse_iins[i])
      }
    }
		return {
			'insert':insert,
			'update':update,
			'unmatched':unmatched
		};
	}
}