const path = require('path');
const { ingredientDao } = require('../../dao/ingredient-dao');
const { listIngredientSchema } = require('../../schemas/ingredient-schema');
const Ajv = require('ajv').default;
const { statusCodes } = require('../../utils/statusCodes');

async function ListAbl(body, res) {
    const ajv = new Ajv({useDefaults: true});
    const valid = ajv.validate(listIngredientSchema, body);
    if (!valid) {
        return res.status(statusCodes.BAD_REQUEST).json({ error: ajv.errors });
    }

    let ingredients;
    try {
        ingredients = await ingredientDao.list(parseInt(body.offset), parseInt(body.limit));
        res.status(statusCodes.OK).json(ingredients);
    } catch (e) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: e });
    }
}

module.exports = ListAbl;
