const path = require('path');
const { recipeDao } = require('../../dao/recipe-dao');
const { validateRecipeSchema } = require('../../schemas/recipe-schema');
const Ajv = require('ajv').default;
const { statusCodes } = require('../../utils/statusCodes');

async function ValidateAbl(body, res) {
    const ajv = new Ajv();
    const valid = ajv.validate(validateRecipeSchema, body);

    if (!valid) {
        return res.status(statusCodes.BAD_REQUEST).json({ error: ajv.errors });
    }

    try {
        const mongoRes = await recipeDao.validate(body.id);
        res.status(statusCodes.OK).json({_id: body.id});
    } catch (e) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: e });
    }
}

module.exports = ValidateAbl;