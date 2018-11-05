// Copyright (C) 2018  imrquake

//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.

//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.

//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <https://www.gnu.org/licenses/>.



var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var parseXmlString = require('xml2js').parseString;

router.get('/', function (req, res, next) {
    res.json({
        'api': 'XDA API'
    });
});


async function searchPhoneModel(model) {
    try {
        // The official sony URL to get device model information
        let searchUrl = 'https://software.sonymobile.com/ess-distribution/public/api/device-service/search?model='
        let searchQuery = searchUrl + model;

        // sony send back an xml document
        var xmlResponse = await rp.get(searchQuery);

        // converting the xml to json object
        let result = await convertXmlToJsonAsync(xmlResponse) ;
        return result ;
    } catch (error) {
        return {
            'error': error
        };
    }
}


/* GET users listing. */
router.get('/search/:model', async function (req, res, next) {
    try {
        // getting the data from sony
        let data = await searchPhoneModel(req.params.model);
        res.json(data);
    } catch (error) {
        res.json({
            'error': error
        });
    }

});


function convertXmlToJsonAsync(xml) {
    return new Promise(function(resolve, reject){
        parseXmlString(xml, function(error, result){
            if(error){
                reject(error);
            }
            else{
                resolve(result);
            }
        })
    });    
}

async function getPhonesIcons() {
    try {
        // The official Sony url to get icons for all supported devices
        let iconsUrl = 'https://dl-desktop-xcapps.sonymobile.com/production/xc/data/xc-cloud-capability.xml';

        // sony returns an xml document
        var xmlResponse = await rp.get(iconsUrl);
        let json = {};
        // converting the xml to json
        let result = await convertXmlToJsonAsync(xmlResponse) ;

        // getting only what we need from the sony data
        
        let jsonData = [];
        // getting the root XML object 
        let devicesetJsonObject = result['device-set'];
        // getting the root url to fetch the icons from
        let sharedpathJsonArray = devicesetJsonObject['sharedpath'][0];
        // console.log('Icons URL: ', sharedpathJsonArray );
        let devicesJsonArray = devicesetJsonObject['device'];
        let headers = ['model', 'marketingname', 'vendor', 'brand', 'typeID', 'class', 'icon'];
        jsonData.push(headers);
        devicesJsonArray.forEach(deviceJsonObject => {
            let deviceArray = [];
            headers.forEach(header => {
                if (header === 'icon') {
                    deviceArray.push(deviceJsonObject.hasOwnProperty('icon') ? sharedpathJsonArray + deviceJsonObject['icon'][0] : '');
                } else {
                    deviceArray.push(deviceJsonObject.hasOwnProperty(header) ? deviceJsonObject[header][0] : '');
                }
            });
            jsonData.push(deviceArray);
        });
        json['data'] = jsonData;

        return json;
    } catch (error) {
        return {
            'error': error
        };
    }
}


router.get('/icons', async function (req, res, next) {
    try {
        let data = await getPhonesIcons();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.json({
            'error': error
        });
    }
});


router.get('/icon/:model', async function (req, res, next) {
    try {
        // gettings the icons for all devices :( )

        let iconsJsonObject = await getPhonesIcons();
        let iconsDataJsonArray = iconsJsonObject['data'];
        for (let m = 0; m < iconsDataJsonArray.length; m++) {
            const iconjsonArray = iconsDataJsonArray[m];

            if (req.params.model === iconjsonArray[0]) {
                console.log(req.params.model, iconjsonArray);
                return res.json(iconjsonArray);
            }
        }

        res.json({
            'error': 'Not found icon for model : ' + req.params.model
        });

    } catch (error) {
        console.log(error);
        res.json({
            'error': error
        });
    }


});

module.exports = router;