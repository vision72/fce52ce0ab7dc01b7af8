import HttpHelper from '../utils/HttpHelperUtil';

function getCountry(country) {
	return HttpHelper.get(country).then((data) => {
		const countries = data.map(({ name, capital, latlng, population, flag }) => ({
			name,
			capital,
			latlng,
			population,
			flag
		}));
		return countries;
	});
}

export const countryService = {
	getCountry
};
