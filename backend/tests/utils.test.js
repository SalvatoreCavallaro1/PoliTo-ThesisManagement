import request from 'supertest';
import { server, psqlDriver, app, isLoggedIn } from '../index.js';
import { thesisProposalTable, teacherTable } from '../dbentities.js';
import { jest } from '@jest/globals';

afterAll(async () => {
    await psqlDriver.closeAll();
});

afterEach(async() => {
    await server.close();
})

describe('isLoggedIn middleware', () => {
    test('Should allow the user who is still logged in to proceed', async () => {
        const isAuthenticated = jest.fn(() => true);
        const req = {
            isAuthenticated: isAuthenticated,
        };
        const res = {};
        const next = jest.fn();
        await isLoggedIn(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    test('Should throw an error with 401 error code when the user is not authenticated', async () => {
        const isAuthenticated = jest.fn(() => false);
        const req = {
            isAuthenticated: isAuthenticated,
        };
        const res = {status: jest.fn(() => ({ json: jest.fn() })) };
        const next = jest.fn();
        await isLoggedIn(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});

describe('GET /api/ProposalsList', () => {
    test('Should successfully retrieve the list of thesis proposals', async () => {
        const proposalList = [
            {
                id: 1,
                title: 'Proposal1',
                teacher_id: 1,
                supervisor: 'Supervisor1',
                cosupervisor: ['Cosupervisor1', 'Cosupervisor2'],
                keywords: ['keyword1', 'keyword2'],
                type: 'Type1',
                groups: ['Group1', 'Group2'],
                description: 'Description1',
                required_knowledge: ['Knowledge1', 'Knowledge2'],
                notes: 'Notes1',
                expiration: new Date().getMilliseconds(),
                level: 1,
                programmes: ['Program1', 'Program2'],
                archived: true,
            },
            {
                id: 2,
                title: 'Proposal2',
                teacher_id: 2,
                supervisor: 'Supervisor2',
                cosupervisor: ['Cosupervisor3', 'Cosupervisor4'],
                keywords: ['keyword3', 'keyword4'],
                type: 'Type2',
                groups: ['Group3', 'Group4'],
                description: 'Description2',
                required_knowledge: ['Knowledge3', 'Knowledge4'],
                notes: 'Notes2',
                expiration: new Date().getMilliseconds(),
                level: 2,
                programmes: ['Program3', 'Program4'],
                archived: false, }
        ];
        jest.spyOn(thesisProposalTable, 'getAll').mockImplementationOnce(() => proposalList);
        const response = await request(app).get('/api/ProposalsList');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(proposalList);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        jest.spyOn(thesisProposalTable, 'getAll').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).get('/api/ProposalsList');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving application List Error: Database error' });
    });
});

describe('POST /api/ProposalsList/filter', () => {
    test('Should successfully retrieve the list of filtered thesis proposals', async () => {
        const proposalList = [
            {
                id: 1,
                title: 'Proposal1',
                teacher_id: 1,
                supervisor: 'Supervisor1',
                cosupervisor: ['Cosupervisor1', 'Cosupervisor2'],
                keywords: ['keyword1', 'keyword2'],
                type: 'Type1',
                groups: ['Group1', 'Group2'],
                description: 'Description1',
                required_knowledge: ['Knowledge1', 'Knowledge2'],
                notes: 'Notes1',
                expiration: new Date().getMilliseconds(),
                level: 1,
                programmes: ['Program1', 'Program2'],
                archived: true,
            },
        ]
        jest.spyOn(thesisProposalTable, 'getFilteredProposals').mockImplementationOnce(() => proposalList)
        const response = await request(app)
            .post('/api/ProposalsList/filter')
            .send({
                title: 'Proposal1',
                professor: 1,
                date: '2023-01-01',
                type: ['Type1'],
                keywords: ['Keyword1', 'Keyword2'],
                level: 1,
                groups: ['Group1', 'Group2']
            });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(proposalList);
    });

    test('Should throw an error with 422 status code when a validation error occurs', async () => {
        const response = await request(app)
            .post('/api/ProposalsList/filter')
            .send({ date: 'invalid_date' });
        expect(response.status).toBe(422);
        expect(response.body).toBeTruthy();
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        jest.spyOn(thesisProposalTable, 'getFilteredProposals').mockImplementationOnce(() => {
            throw new Error('Database error');
        })
        const response = await request(app)
            .post('/api/ProposalsList/filter')
            .send({});
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during the getting proposals: Error: Database error' });
    });
});

describe('GET /api/teacher/list', () => {
    test('Should successfully retrieve the list of professors', async () => {
        const professorsList = [
            {
                id: 1,
                surname: 'surname1',
                name: 'name1',
                email: 'email1',
                cod_group: 1,
                cod_department: 1,
            },
            {
                id: 2,
                name: 'surname2',
                surname: 'name2',
                email: 'email2',
                cod_group: 2,
                cod_department: 2,
            },
        ];
        jest.spyOn(teacherTable, 'getAll').mockImplementationOnce(() => professorsList);
        const response = await request(app).get('/api/teacher/list');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(professorsList.map((p) => ({ name: p.name, surname: p.surname, id: p.id })));
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        jest.spyOn(teacherTable, 'getAll').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).get('/api/teacher/list');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving teacher list Error: Database error' });
    });
});

describe('GET /api/thesis/types', () => {
    test('Should successfully retrieve the list of thesis types', async () => {
        const types = ['Type1', 'Type2'];
        jest.spyOn(thesisProposalTable, 'getTypes').mockImplementationOnce(() => types);
        const response = await request(app).get('/api/thesis/types');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(types);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        jest.spyOn(thesisProposalTable, 'getTypes').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).get('/api/thesis/types');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving thesis types Error: Database error' });
    });
});

describe('GET /api/thesis/keywords', () => {
    test('Should successfully retrieve the list of thesis keywords', async () => {
        const keywords = ['Keyword1', 'Keyword2', 'Keyword3'];
        jest.spyOn(thesisProposalTable, 'getKeywords').mockImplementationOnce(() => keywords);
        const response = await request(app).get('/api/thesis/keywords');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(keywords);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        jest.spyOn(thesisProposalTable, 'getKeywords').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).get('/api/thesis/keywords');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving thesis keywords Error: Database error' });
    });
})

describe('GET /api/thesis/groups', () => {
    test('Should successfully retrieve the list of thesis groups', async () => {
        const groups = ['Group1', 'Group2', 'Group3'];
        jest.spyOn(thesisProposalTable, 'getGroups').mockImplementationOnce(() => groups);
        const response = await request(app).get('/api/thesis/groups');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(groups);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        jest.spyOn(thesisProposalTable, 'getGroups').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).get('/api/thesis/groups');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving thesis groups Error: Database error' });
    });
});