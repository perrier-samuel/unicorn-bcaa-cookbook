import axios from 'axios';

const caller = (url = '/api') => {
    return axios.create({
        baseURL: url,
    });
};

const API = {
    createIngredient(data) {
        return caller().post('/ingredient/create', data);
    },
    updateIngredient(data) {
        return caller().post('/ingredient/update', data);
    },
    listIngredients() {
        return caller().get('/ingredient/list');
    },
    deleteIngredient(id) {
        return caller().delete(`/ingredient/delete/${id}`);
    },
    validateIngredient(data) {
        return caller().post('/ingredient/validate', data);
    },
    createRecipe(data) {
        return caller().post('/recipe/create', data);
    },
};

export default API;