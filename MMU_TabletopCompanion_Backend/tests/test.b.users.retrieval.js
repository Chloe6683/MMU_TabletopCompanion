const fs = require('fs')
const chai = require('chai');
const chaiHttp = require('chai-http')

const expect = chai.expect;
chai.use(chaiHttp);

const path = require('path');
const filename = path.basename(__filename);

const {ADMIN_USERNAME, ADMIN_PASSWORD, SERVER_ADDRESS, HTTP_PORT} = require('../app/lib/config');
const SERVER_URL = SERVER_ADDRESS + ':' + HTTP_PORT;

const GOOD_USER_DATA = require('./data/mock_users_good.json');
let SESSION_TOKEN = '';

describe('Test getting users when not logged in', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 401', () => {
        return chai.request(SERVER_URL)
            .get('/users')
            .then((res) => {
                expect(res).to.have.status(401);
            })
            .catch((err) => {
                throw err;
            });
    });
});

describe('Log into unprivileged account', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 200, and JSON with user_id and session_token of first unprivileged user', () => {
        return chai.request(SERVER_URL)
            .post('/login')
            .send({
                "username": GOOD_USER_DATA[0].username,
                "password": GOOD_USER_DATA[0].password
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property("user_id");
                expect(res.body).to.have.property("session_token");
                SESSION_TOKEN = res.body.session_token;
            })
            .catch((err) => {
                throw err;
            });
    });
});

describe('Test getting users when logged in as unprivileged user', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 401', () => {
        return chai.request(SERVER_URL)
            .get('/users')
            .set('X-Authorization', SESSION_TOKEN)
            .then((res) => {
                expect(res).to.have.status(401);
            })
            .catch((err) => {
                throw err;
            });
    });
});

describe('Log into admin account', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 200, and JSON with user_id and session_token of admin user', () => {
        return chai.request(SERVER_URL)
            .post('/login')
            .send({
                'username': ADMIN_USERNAME,
                'password': ADMIN_PASSWORD
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('user_id');
                expect(res.body).to.have.property('session_token');
                SESSION_TOKEN = res.body.session_token;
            })
            .catch((err) => {
                throw err;
            });
    });
});

describe("Test getting users when logged in as admin", () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 200, and be an array of users', () => {
        return chai.request(SERVER_URL)
            .get('/users')
            .set('X-Authorization', SESSION_TOKEN)
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.equal(11);

                res.body.forEach(user => {
                    expect(user).to.have.property('user_id');
                    expect(user).to.have.property('username');
                    expect(user).to.have.property('privilege_level');
                });
            })
            .catch((err) => {
                throw err;
            });
    });
});