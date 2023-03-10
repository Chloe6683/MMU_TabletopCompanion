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

describe('Test user login/logout', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 200 for successful login', () => {
        return chai.request(SERVER_URL)
             .post('/login')
             .send({
                 'username': GOOD_USER_DATA[0].username,
                 'password': GOOD_USER_DATA[0].password
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

    it('Should return the same token if a logged in user tried to login again', () => {
        return chai.request(SERVER_URL)
            .post('/login')
            .send({
                'username': GOOD_USER_DATA[0].username,
                'password': GOOD_USER_DATA[0].password
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('user_id');
                expect(res.body).to.have.property('session_token');
                expect(res.body.session_token).to.equal(SESSION_TOKEN);
            })
            .catch((err) => {
                throw err;
            });
    });

    it('Should return 400 for incorrect username', () => {
        return chai.request(SERVER_URL)
            .post('/login')
            .send({
                'username': 'badUsername',
                'password': GOOD_USER_DATA[0].password
            })
            .then((res) => {
                expect(res).to.have.status(400);
            })
            .catch((err) => {
                throw err;
            });
    });

    it('Should return 400 for incorrect password', () => {
        return chai.request(SERVER_URL)
            .post('/login')
            .send({
                'username': GOOD_USER_DATA[0].username,
                'password': 'badPassword'
            })
            .then((res) => {
                expect(res).to.have.status(400);
            })
            .catch((err) => {
                throw err;
            });
    });

    it('Should return 400 for missing username', () => {
        return chai.request(SERVER_URL)
            .post('/login')
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

    it('Should return 400 for missing password', () => {
        return chai.request(SERVER_URL)
            .post('/login')
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

    it('Should return 400 for extra field', () => {
        return chai.request(SERVER_URL)
            .post('/login')
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

    it('Should return 401 for logging out without a valid token', () => {
        return chai.request(SERVER_URL)
            .post('/logout')
            .set('X-Authorization', 'badToken')
            .then((res) => {
                expect(res).to.have.status(401);
            })
            .catch((err) => {
                throw err;
            });
    });

    it('Should return 200 for logging out with a valid token', () => {
        return chai.request(SERVER_URL)
            .post('/logout')
            .set('X-Authorization', SESSION_TOKEN)
            .send({
                'session_token': SESSION_TOKEN
            })
            .then((res) => {
                expect(res).to.have.status(200);
            })
            .catch((err) => {
                throw err;
            });
    });
})