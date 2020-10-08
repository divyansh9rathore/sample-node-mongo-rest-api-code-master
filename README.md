# sample-node-mongo-rest-api-code
This repository contains the sample code snippet of Node.js and MongoDB 

#### swagger-specification.yaml
This file contains the swagger specification that is responsible to select a appropriate controller file based on `x-swagger-router-controller` and then select the appropriate function of controller based on `operationId` value.

#### CandidateBasicInfoModel.js
This is a mongoose model file that will be used to communicate with the mongodb. It has the canidate basic information schema that models the candidate basic info like first name, last name, gender etc.

#### CandidateBasicInfoController.js
This is a controller file that bridges the swagger call to the service layer. 

#### CandidateBasicInfoService.js
This is our main business layer which has all the business logic. This file currently has business logic for the get list of candidate basic info. 

#### UnitTestCaseCandidateBasicInfo.js
To test the module works as a unit, this file contains the unit test cases for all the scenarious including runtime error, validation error and success response.

#### EndpointTestCase.js
It contains the end point test cases that test for the entire integrity of the route in the system. The response from the route is matched against the schema of the response.

The swagger doc for this route has been shown in `candidateBasicInfo.png` image.