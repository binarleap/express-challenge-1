var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { authSecret } from "../settings";
import { Admin, User } from "../models";
import passportJWT from 'passport-jwt';
import { adminQuickKeys } from "../constants/administration";
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
export default function (passport) {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
    opts.secretOrKey = authSecret;
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        return __awaiter(this, void 0, void 0, function* () {
            if (jwt_payload.role === 'admin') {
                try {
                    let admin = yield Admin.query()
                        .findById(jwt_payload.id)
                        .withGraphFetched('permissions.permission')
                        .first();
                    if (admin) {
                        done(null, Admin.render(null, admin.toJSON(), adminQuickKeys), 'admin');
                    }
                    else {
                        done('no user found', null, null);
                    }
                }
                catch (error) {
                    return done('a server error occurred', null, null);
                }
            }
            else {
                try {
                    let user = yield User.query()
                        .findById(jwt_payload.id)
                        .first();
                    if (user) {
                        done(null, User.render(null, user.toJSON()), 'user');
                    }
                    else {
                        done('no user found', null, null);
                    }
                }
                catch (error) {
                    return done('a server error occurred', null, null);
                }
            }
        });
    }));
}
;
