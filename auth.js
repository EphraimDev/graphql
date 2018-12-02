import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';

const createTokens = async (user, SECRET) => {
    const createToken = jwt.sign(
        {
            user: _.pick(user, ['userId', 'isAdmin']),
        },
        SECRET,
        {
            expiresIn: '20m',
        },
    );

    const createRefreshToken = jwt.sign(
        {
            user: _.pick(user, 'userId'),
        },
        SECRET,
        {
            expiresIn: '7d',
        },
    );

    return Promise.all([createToken, createRefreshToken]);
};

export const refreshTokens = async (token, refreshToken, models, SECRET) => {
    let id = -1;
    try {
        const {user: {userId}} = jwt.verify(refreshToken, SECRET);
        id = userId;
    } catch (err) {
        return {};
    }

    const user = await models.Users.findOne({where:{userId: id}, raw: true});

    const [newToken, newRefreshToken] = await createTokens(user, SECRET);
    return {
        token: newToken,
        refreshToken: newRefreshToken,
        user,
    };
};

export const tryLogin = async (email, password, models, SECRET) => {
    const user = await models.Users.findOne({where:{email}, raw: true});
    if(!user) {
        //user with provided email not found
        throw new Error('Invalid login');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        // bad password
        throw new Error('Invalid login');
    }

    const [token, refreshToken] = await createTokens(user, SECRET);

    return {
        token,
        refreshToken
    };
};