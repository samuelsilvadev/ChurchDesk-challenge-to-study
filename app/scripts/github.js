'use strict';

const github = {};

github.config = {
	ROOT_END_POINT: `https://api.github.com`
};

github.searchUser = async function searchUser(user) {
	const END_POINT_SEARCH_USER = `/search/users?q=${user}`
	const result = await fetch(`${this.config.ROOT_END_POINT}${END_POINT_SEARCH_USER}`)
		.then(resp => resp.json());
	return result;
};

github.getUser = async function getUser(user) {
	const END_POINT_GET_USER = `/users/${user}`;
	const result = await fetch(`${this.config.ROOT_END_POINT}${END_POINT_GET_USER}`)
		.then(resp => resp.json());
	return result;
};

github.getFollowers = async function getFollowers(user) {
	const END_POINT_GET_FOLLOWERS = `/users/${user}/followers`
	const result = await fetch(`${this.config.ROOT_END_POINT}${END_POINT_GET_FOLLOWERS}`)
		.then(resp => resp.json());
	return result;
};

github.getFollowing = async function getFollowing(user) {
	const END_POINT_GET_FOLLOWING = `/users/${user}/following`
	const result = await fetch(`${this.config.ROOT_END_POINT}${END_POINT_GET_FOLLOWING}`)
		.then(resp => resp.json());
	return result;
};

github.getStarredUrls = async function getStarredUrls(user) {
	const END_POINT_GET_STARREDURLS = `/users/${user}/starred`
	const result = await fetch(`${this.config.ROOT_END_POINT}${END_POINT_GET_STARREDURLS}`)
		.then(resp => resp.json());
	return result;
};

github.getRepositories = async function getRepositories(user) {
	const END_POINT_GET_REPOSITORIES = `/users/${user}/repos`
	const result = await fetch(`${this.config.ROOT_END_POINT}${END_POINT_GET_REPOSITORIES}`)
		.then(resp => resp.json());
	return result;
};

module.exports = github;
