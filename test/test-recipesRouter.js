
const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const expect = chai.expect;


chai.use(chaiHttp);

//test recipes
describe('Recipes', function(){

	before(function() {
    	return runServer();
  	});

  after(function() {
    return closeServer();
  });

  //GET - list of recipes
  it('should return list of recipes', function(){
    return chai.request(app)
                            .get('/recipes')
                            .then(function(res){
						      expect(res).to.have.status(200);
						      expect(res).to.be.json;
						      expect(res.body).to.be.a('array');
                              const expectedKeys = ['id', 'name', 'ingredients'];
                              res.body.forEach(function(item){
                              	expect(item).to.be.a('object');

          						expect(item).to.include.keys(expectedKeys);
                              })
                            });
  });
  //POST - add recipe menu
  it('Should add recipe menu', function(){
  	const newMenue = {name: 'Ranch Chicken', ingredients: ['chicken breast', 'ranch', 'oil']};
  	return chai.request(app)
  							.post('/recipes')
  							.send(newMenue)
  							.then(function(res){
  								expect(res).to.have.status(201);
  								expect(res).to.be.json;
  				        		expect(res.body).to.be.a('object');
					       		expect(res.body).to.include.keys('id', 'name', 'ingredients');
					       		expect(res.body.id).to.not.equal(null);
					        	expect(res.body).to.deep.equal(Object.assign(newMenue, {id: res.body.id}));
  							});
  });

  it('should update menu on PUT', function() {
    const updateData = {
      name: 'Fried Chicken',
      ingredients: ['chicken breast', 'ranch', 'dry bread crumbs']
    };

    return chai.request(app)
      .get('/Recipes')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/recipes/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(updateData);
      });
  });

  it('should delete menu on DELETE', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
})


