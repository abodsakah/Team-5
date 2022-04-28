jest.setTimeout(60000); // 1 minute 
const dbConnection = require('../API/src/dbConnection');
// import {getUserById} from '../API/src/dbConnection';

describe('test getting users by id', () => {
  test('Tries user id 1 and should return a user with a email of "abodsakka2001@gmail.com"', () => {
    return dbConnection.getUserById(1).then(data => {
      expect(data[0].email).toBe('abodsakka2001@gmail.com');
    });
  });
  test('Tries user id 5 and should return nothing', () => {
    return dbConnection.getUserById(5).then(data => {
      expect(data.length).toBe(0);
    });
  });
}); 

describe('test getting companies', () => {
  test('The first company in the list should be Tract', () => {
    return dbConnection.getCompanies().then(data => {
      expect(data[0].name).toBe('Tract');
    });
  });

  test('Get company styling', () => {
    return dbConnection.getCompanySetting(1).then(data => {
      console.log(data[0]);
      expect(data[0][0].name).toBe('Tract');
    });
  });
});

        