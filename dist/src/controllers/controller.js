import _ from 'lodash';
import validator from 'validator';
// controller class to make life easier!
class Controller {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.response = {
            errors: {},
            data: {},
            code: 200,
            message: '',
        };
    }
    // filter required values
    filterEmpty(fields) {
        var _a;
        for (const field of fields) {
            if (validator.isEmpty(`${(_a = this.req.body[field]) !== null && _a !== void 0 ? _a : ''}`)) {
                this.makeError(field, `${field} is required`);
            }
        }
    }
    // validate email address
    isEmailAddress(email) {
        return validator.isEmail(`${email}`);
    }
    // make an error in the response object
    makeError(field, error) {
        this.response.errors[field] = error;
    }
    // check if we do not have any errors
    canProceed() {
        return (Object.keys(this.response.errors).length === 0 && this.response.code === 200);
    }
    // make server error 500
    makeServerError() {
        this.response.message = "A server error occurred. Please try again.";
        this.response.code = 500;
    }
    // make unauthorized error 401
    makeUnauthorizedError() {
        this.response.message = "Access Denied.";
        this.response.code = 401;
    }
    // set a cookie in the header
    setCookie(name, value, options) {
        this.res.cookie(name, value, Object.assign(Object.assign({}, options), { encode: String }));
    }
    // make the response object
    makeResponse() {
        return this.res.status(Object.keys(this.response.errors).length > 0 ? 400 : this.response.code).json({
            errors: _.mapKeys(this.response.errors, (v, k) => _.camelCase(k)),
            data: _.mapKeys(this.response.data, (v, k) => _.camelCase(k)),
            message: this.response.message
        });
    }
}
export default Controller;
