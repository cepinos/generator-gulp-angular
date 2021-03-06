'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular karma.conf template', function () {
  var karmaConf, model;

  before(function() {
    return templateTools.load('_karma.conf.js')
      .then(function(templateModule) {
        karmaConf = templateModule;
      });
  });

  beforeEach(function() {
    model = mockModel();
  });

  it('should add files in list files for each js preprocessors', function() {
    model.props.jsPreprocessor.key = 'none';
    var result = karmaConf(model);
    result.should.match(/conf\.paths\.src, '[^\s]*\.module\.js'/);
    result.should.match(/conf\.paths\.src, '[^\s]*\.js'/);

    model.props.jsPreprocessor.key = 'coffee';
    result = karmaConf(model);
    result.should.match(/conf\.paths\.tmp, '\/serve[^\s]*\.module\.js'/);
    result.should.match(/conf\.paths\.tmp, '\/serve[^\s]*\.js'/);

    model.props.jsPreprocessor.key = 'babel';
    result = karmaConf(model);
    result.should.match(/conf\.paths\.tmp, '\/serve\/app\/index\.module\.js/);
  });

  it('should add and configure angular filesort if needed', function() {
    model.props.jsPreprocessor.key = 'babel';
    var result = karmaConf(model);
    result.should.match(/frameworks: \['jasmine'\]/);
    result.should.not.match(/'karma-angular-filesort'/);

    model.props.jsPreprocessor.key = 'none';
    result = karmaConf(model);
    result.should.match(/frameworks: \['jasmine', 'angular-filesort'\]/);
    result.should.match(/whitelist: \[[^\s]*conf\.paths\.src/);
    result.should.match(/'karma-angular-filesort'/);

    model.props.jsPreprocessor.key = 'coffee';
    result = karmaConf(model);
    result.should.match(/frameworks: \['jasmine', 'angular-filesort'\]/);
    result.should.match(/whitelist: \[[^\s]*conf\.paths\.tmp/);
    result.should.match(/'karma-angular-filesort'/);
  });

  it('should replace phantom with chrome for traceur', function() {
    model.props.jsPreprocessor.key = 'none';
    var result = karmaConf(model);
    result.should.match(/browsers : \['PhantomJS'\]/);
    result.should.match(/'karma-phantomjs-launcher'/);
    result.should.not.match(/'karma-chrome-launcher'/);

    model.props.jsPreprocessor.key = 'traceur';
    result = karmaConf(model);
    result.should.match(/browsers : \['Chrome'\]/);
    result.should.match(/'karma-chrome-launcher'/);
    result.should.not.match(/'karma-phantomjs-launcher'/);
  });

});
