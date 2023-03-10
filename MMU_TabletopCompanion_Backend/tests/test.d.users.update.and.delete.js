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
let ADMIN_SESSION_TOKEN = '';
let USER_SESSION_TOKEN = '';
let FIRST_USER_ID = -1;

describe('Log in to test accounts', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 200 for successful login to admin', () => {
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
                 ADMIN_SESSION_TOKEN = res.body.session_token;
             })
             .catch((err) => {
                 throw err;
             });
    });

    it('Should return 200 for successful login to user', () => {
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
                 USER_SESSION_TOKEN = res.body.session_token;
                 FIRST_USER_ID = res.body.user_id;
             })
             .catch((err) => {
                 throw err;
             });
    });
})

describe('Test updating users if not logged in', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 401 due to no/invalid token', () => {
        return chai.request(SERVER_URL)
            .patch('/users/' + (FIRST_USER_ID + 1).toString())
            .send({
                'username': GOOD_USER_DATA[1].username + 'edited',
                'password': GOOD_USER_DATA[1].password + 'edited'
            })
            .then((res) => {
                expect(res).to.have.status(401);
            })
            .catch((err) => {
                throw err;
            });     
    });
})

describe('Test updating users with insufficient privilege', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 401 due to insufficient privilege', () => {
        return chai.request(SERVER_URL)
            .patch('/users/' +  (FIRST_USER_ID + 1).toString())
            .set('X-Authorization', USER_SESSION_TOKEN)
            .send({
                'username': GOOD_USER_DATA[1].username + 'edited',
                'password': GOOD_USER_DATA[1].password + 'edited'
            })
            .then((res) => {
                expect(res).to.have.status(401);
            })
            .catch((err) => {
                throw err;
            });     
    });
})

describe('Test updating user of lower privilege', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 200', () => {
        return chai.request(SERVER_URL)
            .patch('/users/' + (FIRST_USER_ID + 1).toString())
            .set('X-Authorization', ADMIN_SESSION_TOKEN)
            .send({
                'username': GOOD_USER_DATA[1].username + 'edited',
                'password': GOOD_USER_DATA[1].password + 'edited'
            })
            .then((res) => {
                expect(res).to.have.status(200);
            })
            .catch((err) => {
                throw err;
            });     
    });
})

describe('Test updating self', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 200', () => {
        return chai.request(SERVER_URL)
            .patch('/users/' + FIRST_USER_ID)
            .set('X-Authorization', USER_SESSION_TOKEN)
            .send({
                'username': GOOD_USER_DATA[0].username + 'edited',
                'password': GOOD_USER_DATA[0].password + 'edited'
            })
            .then((res) => {
                expect(res).to.have.status(200);
            })
            .catch((err) => {
                throw err;
            });     
    });
})

describe('Test deleting users when not logged in', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 401 due to no/invalid token', () => {
        return chai.request(SERVER_URL)
            .delete('/users/' + (FIRST_USER_ID + 2).toString())
            .then((res) => {
                expect(res).to.have.status(401);
            })
            .catch((err) => {
                throw err;
            });     
    });
})

describe('Test deleting users with insufficient privilege', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 401 due to insuffient privilege', () => {
        return chai.request(SERVER_URL)
            .delete('/users/' + (FIRST_USER_ID + 2).toString())
            .set('X-Authorization', USER_SESSION_TOKEN)
            .then((res) => {
                expect(res).to.have.status(401);
            })
            .catch((err) => {
                throw err;
            });     
    });
})

describe('Test deleting user of lower privilege', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 200', () => {
        return chai.request(SERVER_URL)
            .delete('/users/' + (FIRST_USER_ID + 2).toString())
            .set('X-Authorization', ADMIN_SESSION_TOKEN)
            .then((res) => {
                expect(res).to.have.status(200);
            })
            .catch((err) => {
                throw err;
            });     
    });
})

describe('Test deleting self', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 200', () => {
        return chai.request(SERVER_URL)
            .delete('/users/' + FIRST_USER_ID)
            .set('X-Authorization', USER_SESSION_TOKEN)
            .then((res) => {
                expect(res).to.have.status(200);
            })
            .catch((err) => {
                throw err;
            });     
    });
})

describe('Test deleting user that does not exist', () => {
    before(() => {
        console.log('[Script: ' + filename + ']');
    });

    it('Should return 404', () => {
        return chai.request(SERVER_URL)
            .delete('/users/-1')
            .set('X-Authorization', ADMIN_SESSION_TOKEN)
            .then((res) => {
                expect(res).to.have.status(404);
            })
            .catch((err) => {
                throw err;
            });     
    });
})