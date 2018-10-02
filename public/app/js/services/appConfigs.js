/**
 * Services that persists and retrieves todos from localStorage or a backend API
 * if available.
 *
 * They both follow the same API, returning promises for all changes to the
 * model.
 */
angular.module('reshimgathi')
	.service('appConfig', ['$timeout','$window','$location',appConfig]);

function appConfig($timeout,$window,$location) {
	this.defaultUserImage='/images/default_user.jpg'
	this.cloudinaryBaseUrl=$location.protocol()+'://res.cloudinary.com/reshimgathi/image/upload'
}