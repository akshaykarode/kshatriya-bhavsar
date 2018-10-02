/**
 * Services that persists and retrieves todos from localStorage or a backend API
 * if available.
 *
 * They both follow the same API, returning promises for all changes to the
 * model.
 */
angular.module('reshimgathi')
	.service('profileService', ['$http','$q','appConfig',profileService]);

function profileService($http,$q,appConfig) {
	this.config={
		urls:{
			getProfiles:'/js/static-data/profiles.json', // /get-profiles
		},
    data:{
      'profiles':[]
    },
    _inProgressFlags:{
    	getProfiles:false
    }
	}

	this.getProfiles = function(postData){
		var _ref = this;
		var def = $q.defer()
		if(_.isEmpty(_ref.config.data.profiles) && _ref.config._inProgressFlags.getProfiles==false){
			_ref.config._inProgressFlags.getProfiles=true
			$http.get(_ref.config.urls.getProfiles,{})
			.then(function(data){
				_ref.config.data.profiles=parseProfiles(data.data)
				_ref.config._inProgressFlags.getProfiles=false
				def.resolve(_ref.config.data.profiles)
			})
		}else{
			if(_ref.config._inProgressFlags.getProfiles==true){ // call inprogerss
				$rootScope.$watch(function(){
					return _ref.config._inProgressFlags.getProfiles
				},function(newval,oldval){
					if(newval==false){ // now data available
						console.debug('newval',newval)
						console.debug('oldval',oldval)
						def.resolve(_ref.config.data.profiles)
					}
				})
			}else{
				def.resolve(_ref.config.data.profiles)
			}
		}
		return def.promise;
	}

	/*--------------------- Data Parsers ---------------------*/
	var parseProfiles=function(arr){
		_.forEach(arr,function(o){
			_.forEach(o.images,function(image){
				image.c_url=appConfig.cloudinaryBaseUrl+image.url
			})
			o.dp=(_.find(o.images,{is_display_picture:true}) && _.find(o.images,{is_display_picture:true}).c_url) 
				|| appConfig.defaultUserImage
		})
		return arr
	}
	/*--------------------- Data Parsers End ---------------------*/

	/*--------------------- Helpers ---------------------*/
  this.reset=function(){
    this.config={
			urls:{
				getProfiles:'/get-profiles'
			},
	    data:{
	      'profiles':[]
	    },
	    _inProgressFlags:{
	    	getProfiles:false
	    }
		}
    console.error("profileService data cleared",this.config)
  }
	/*--------------------- Helpers End---------------------*/

}