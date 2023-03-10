const fs = require('fs')
const chai = require('chai');
const chaiHttp = require('chai-http')

const expect = chai.expect;
chai.use(chaiHttp);

const path = require('path');
const filename = path.basename(__filename);

const {ADMIN_USERNAME, ADMIN_PASSWORD, SERVER_ADDRESS, HTTP_PORT} = require('../app/lib/config');
const SERVER_URL = SERVER_ADDRESS + ':' + HTTP_PORT;

const BAD_USER_DATA = require('./data/mock_users_bad.json');
const GOOD_USER_DATA = require('./data/mock_users_good.json');

describe('Test malformed creation of users', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    BAD_USER_DATA.forEach((user) => {
        it('Should return 400: ' + user.test_description, () => {
            return chai.request(SERVER_URL)
                .post('/users')
                .send({
                    'username': user.username,
                    'password': user.password
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                })
                .catch((err) => {
                    throw err;
                });
        });
    });

    it('Should return 400: missing username', () => {
        return chai.request(SERVER_URL)
            .post('/users')
            .send({
                'password': GOOD_USER_DATA[0].password
            })
            .then((res) => {
                expect(res).to.have.status(400);
            })
            .catch((err) => {
                throw err;
            });
    });

    it('Should return 400: missing password', () => {
        return chai.request(SERVER_URL)
            .post('/users')
            .send({
                'username': GOOD_USER_DATA[0].username
            })
            .then((res) => {
                expect(res).to.have.status(400);
            })
            .catch((err) => {
                throw err;
            });
    });

    it('Should return 400: extra field', () => {
        return chai.request(SERVER_URL)
            .post('/users')
            .send({
                'username': GOOD_USER_DATA[0].username,
                'password': GOOD_USER_DATA[0].password,
                'extra': 'field'
            })
            .then((res) => {
                expect(res).to.have.status(400);
            })
            .catch((err) => {
                throw err;
            });
    });
});

describe('Test successful creation of users', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    GOOD_USER_DATA.forEach((user) => {
        it('Should return 201, and JSON with user_id of new user: ' + user.username, () => {
            return chai.request(SERVER_URL)
                .post('/users')
                .send({
                    'username': user.username,
                    'password': user.password
                })
                .then((res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('user_id');
                })
                .catch((err) => {
                    throw err;
                });
        });
    });
});