'use strict';
(() => {
	const github = require('./github');
	const $ = require('./utils');
	
	let debounceTimeout = null;
	const $searchField = $('.js-search-field');
	const $searchButton = $('.js-search-button');
	const $gridUsers = $('.js-grid-users');
	const $loading = $('.js-loading');

	const actionSearch = searchTerm => {
		if (searchTerm && searchTerm.length > 3) {
			$gridUsers.innerHTML = '';
			$loading.classList.remove('loading--hide');
			github.searchUser(searchTerm).then(actionGetUsers);
		}
	};
	const actionGetUsers = data => {
		if (data) {
			data.items.length = 5;
			data.items
				.map(item => item.login)
				.forEach(login => {
					$loading.classList.add('loading--hide');
					github.getUser(login)
						.then(results => $gridUsers.innerHTML += createViewHTML(results));
				});
		}
	};
	const createViewHTML = results => {
		const { avatar_url, followers, following, public_repos, name, html_url } = results;
		return `
		<div class="grid__users__user user__detail">
			<div class="user__detail__image">
				<a href="${html_url}" target="_blank">
				<img src="${avatar_url}" alt="Profile photo">
				</a>
			</div>
			<div class="user__detail__description">
				<h4>${name}</h4>
				<p>Repositories: ${public_repos}</p>
				<p>Stars: 0</p>
				<p>Followers: ${followers}</p>
				<p>Following: ${following}</p>
			</div>
		</div>`;
	};
	const handleSearchUser = e => {
		e.preventDefault();
		const searchTerm = $searchField.value;
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			actionSearch(searchTerm);
		}, 1000);
	};
	$searchButton.addEventListener('click', handleSearchUser);
})();





